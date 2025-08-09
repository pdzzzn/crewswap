import { createClient as createSupabaseBrowserClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Provide a createClient() for modules that import it from here (browser usage)
export function createClient() {
  return supabase;
}
