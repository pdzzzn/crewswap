import { createClient as createSupabaseBrowserClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Derive a stable, project-specific storage key to prevent collisions when switching
// between environments or different Supabase projects in the same browser profile.
let storageKey = 'sb-auth';
try {
  const host = new URL(supabaseUrl).hostname; // e.g., efkjjozquqgnlinmxvcu.supabase.co
  const ref = host.split('.')[0];
  storageKey = `sb-${ref}-auth`;
} catch {}

export const supabase = createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Provide a createClient() for modules that import it from here (browser usage)
export function createClient() {
  return supabase;
}
