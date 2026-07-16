import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { json, methodNotAllowed } from '../_lib/http.js';
import { getAdapter } from '../_lib/platforms/index.js';
import { sendGa4Event } from '../_lib/tracking/ga4.js';
import { sendMetaEvent } from '../_lib/tracking/metaCapi.js';
import { grantMemberAccess, revokeMemberAccess } from '../_lib/memberAccess.js';

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed(['POST']);

  const platformName = new URL(request.url).searchParams.get('platform') ?? 'hotmart';
  const adapter = getAdapter(platformName);
  if (!adapter) {
    return json(400, { error: `Unknown checkout platform "${platformName}"` });
  }

  // Read the raw body once, before any parsing — verify() may need the exact bytes
  // for future signature-based adapters, and re-reading request.json() twice throws.
  const rawBody = await request.text();

  let verified: boolean;
  try {
    verified = await adapter.verify(request, rawBody);
  } catch (err) {
    console.error(`${platformName} webhook verify() threw`, err);
    verified = false;
  }
  if (!verified) {
    return json(401, { error: 'Webhook verification failed' });
  }

  let purchase;
  try {
    purchase = adapter.parse(rawBody);
  } catch (err) {
    console.error(`${platformName} webhook payload could not be parsed`, err);
    return json(400, { error: 'Malformed payload' });
  }

  const supabase = getSupabaseAdmin();

  // Hotmart redelivers on retry, and sends a *new* webhook call for every status
  // transition of the same transaction (APPROVED, then later REFUNDED, ...). Read the
  // prior status first so we can tell "just became approved" apart from "already was".
  const { data: existing } = await supabase
    .from('purchases')
    .select('status')
    .eq('platform', purchase.platform)
    .eq('transaction_id', purchase.transactionId)
    .maybeSingle();
  const wasAlreadyApproved = existing?.status === 'approved';

  const { error: upsertError } = await supabase.from('purchases').upsert(
    [
      {
        email: purchase.email,
        platform: purchase.platform,
        product_id: purchase.productId,
        transaction_id: purchase.transactionId,
        amount_cents: purchase.amountCents,
        currency: purchase.currency,
        status: purchase.status,
        raw_payload: JSON.parse(rawBody),
      },
    ],
    { onConflict: 'platform,transaction_id' }
  );

  if (upsertError) {
    console.error('purchase upsert failed', upsertError);
    return json(500, { error: 'Could not record purchase' });
  }

  // Conversion tracking must fire exactly once per transaction's first approval —
  // never re-count a replayed/retried webhook for a transaction already marked approved.
  if (purchase.status === 'approved' && !wasAlreadyApproved) {
    await Promise.all([
      sendGa4Event(crypto.randomUUID(), {
        name: 'purchase',
        params: {
          currency: purchase.currency,
          value: (purchase.amountCents ?? 0) / 100,
          transaction_id: purchase.transactionId,
        },
      }),
      sendMetaEvent({
        eventName: 'Purchase',
        email: purchase.email,
        eventId: purchase.transactionId,
        customData: { currency: purchase.currency, value: (purchase.amountCents ?? 0) / 100 },
      }),
    ]);
  }

  // Access grant/revoke is retried on every delivery (not just the first) so a
  // transient GoTrue failure self-heals via the platform's own webhook retries —
  // unlike tracking above, re-attempting this is safe and desired, not double-counting.
  if (purchase.status === 'approved') {
    const grantError = await grantMemberAccess(supabase, purchase.email);
    if (grantError) {
      console.error('member access grant failed', purchase.email, grantError);
      return json(500, { error: 'Could not grant member access' });
    }
  } else if (purchase.status === 'refunded' || purchase.status === 'chargeback') {
    const revokeError = await revokeMemberAccess(supabase, purchase.email);
    if (revokeError) {
      console.error('member access revoke failed', purchase.email, revokeError);
      return json(500, { error: 'Could not revoke member access' });
    }
  }

  return json(200, { ok: true });
}
