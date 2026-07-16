import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import type { Database } from './database.types.js';

/**
 * Service-role Supabase client. Bypasses RLS — only ever import this inside /api
 * functions (server-side). Never expose SUPABASE_SERVICE_ROLE_KEY to the browser;
 * the client-side app uses src/lib/supabaseClient.ts with the anon key instead.
 */
let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (!client) {
    client = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}
