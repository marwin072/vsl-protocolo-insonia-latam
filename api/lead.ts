import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { json, methodNotAllowed, isValidEmail } from './_lib/http.js';
import { sendGa4Event } from './_lib/tracking/ga4.js';
import { sendMetaEvent } from './_lib/tracking/metaCapi.js';

interface LeadPayload {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  client_id?: string;
  event_id?: string;
}

interface UtmFields {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export function pickUtm(body: Record<string, unknown>): UtmFields {
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  const out = {} as UtmFields;
  for (const key of utmKeys) {
    const value = body[key];
    out[key] = typeof value === 'string' && value.length <= 256 ? value : null;
  }
  return out;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed(['POST']);

  let body: Partial<LeadPayload>;
  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  if (typeof body !== 'object' || body === null) {
    return json(400, { error: 'Invalid JSON body' });
  }

  if (!isValidEmail(body.email)) {
    return json(400, { error: 'A valid "email" is required' });
  }

  const email = body.email.trim().toLowerCase();

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .upsert([{ email, ...pickUtm(body as Record<string, unknown>) }], { onConflict: 'email' });

  if (error) {
    console.error('lead upsert failed', error);
    return json(500, { error: 'Could not save lead' });
  }

  await Promise.all([
    // GA4 Measurement Protocol forbids PII in event params — never pass email here.
    // Fall back to a fresh anonymous id (not the email) when the client sent none.
    sendGa4Event(body.client_id ?? crypto.randomUUID(), { name: 'generate_lead' }),
    sendMetaEvent({
      eventName: 'Lead',
      email,
      eventId: body.event_id,
      eventSourceUrl: request.headers.get('referer') ?? undefined,
    }),
  ]);

  return json(200, { ok: true });
}
