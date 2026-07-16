import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Thrown lazily (only when the member-area/login pages actually import this
  // module) so the rest of the landing page keeps working without Supabase configured.
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — copy .env.example to .env.local and fill them in.'
  );
}

export const supabase = createClient(url, anonKey);
