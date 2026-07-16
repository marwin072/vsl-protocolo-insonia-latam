import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.js';
import { env } from './env.js';

type Client = SupabaseClient<Database>;

// Supabase's own documented idiom for an effectively-permanent ban (see
// updateUserById's doc example in @supabase/auth-js) — there's no dedicated
// "permanent" value, just a very long duration.
const PERMANENT_BAN = '876000h';

/**
 * Resolves a buyer's auth.users id from our own email -> id mapping, falling back to
 * looking the user up directly in Supabase when the mapping is missing — which can
 * happen if a prior `members` upsert failed after a successful invite, or the auth
 * user predates this table entirely. The Admin API has no "get user by email", so
 * `generateLink({ type: 'recovery' })` is used purely as a lookup: it resolves an
 * existing user (and errors if none exists) without creating anyone or sending
 * anything — the generated link/OTP in the response is discarded. On a successful
 * fallback lookup, the mapping is backfilled so future calls hit the fast path.
 */
async function resolveMemberUserId(supabase: Client, email: string): Promise<string | null> {
  const { data: existing } = await supabase.from('members').select('user_id').eq('email', email).maybeSingle();
  if (existing?.user_id) return existing.user_id;

  const { data: linkData, error } = await supabase.auth.admin.generateLink({ type: 'recovery', email });
  if (error || !linkData?.user) return null;

  await supabase.from('members').upsert([{ email, user_id: linkData.user.id }], { onConflict: 'email' });
  return linkData.user.id;
}

/**
 * Grants (or re-confirms) member access for an approved purchase: invites the buyer
 * as a Supabase Auth user — a no-op for an already-confirmed member, which is the
 * expected renewal case — records the email -> auth user id mapping, and un-bans them
 * in case a prior refund/chargeback had revoked access that a later approval reverses.
 *
 * Returns an error string on genuine failure (so the caller can 500 and let the
 * checkout platform retry the whole webhook), or null on success.
 */
export async function grantMemberAccess(supabase: Client, email: string): Promise<string | null> {
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${env.publicSiteUrl}/membros`,
  });

  if (inviteError && inviteError.code !== 'email_exists') {
    return `invite failed: ${inviteError.message}`;
  }

  const userId = inviteData?.user?.id ?? (await resolveMemberUserId(supabase, email));
  if (!userId) {
    return `could not resolve auth user id for ${email} (no members mapping and generateLink lookup found no user)`;
  }

  const { error: upsertError } = await supabase
    .from('members')
    .upsert([{ email, user_id: userId }], { onConflict: 'email' });
  if (upsertError) return `member mapping upsert failed: ${upsertError.message}`;

  const { error: unbanError } = await supabase.auth.admin.updateUserById(userId, { ban_duration: 'none' });
  if (unbanError) return `unban failed: ${unbanError.message}`;

  return null;
}

/**
 * Revokes member access after a refund/chargeback. A no-op (not an error) if this
 * email was never granted access (no matching auth user at all), or if the account
 * was already deleted since — nothing left to ban in either case.
 */
export async function revokeMemberAccess(supabase: Client, email: string): Promise<string | null> {
  const userId = await resolveMemberUserId(supabase, email);
  if (!userId) return null;

  const { error } = await supabase.auth.admin.updateUserById(userId, { ban_duration: PERMANENT_BAN });
  if (error && error.code !== 'user_not_found') {
    return `ban failed: ${error.message}`;
  }
  return null;
}
