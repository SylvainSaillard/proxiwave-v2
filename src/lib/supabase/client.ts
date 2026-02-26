import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// T019 — Client Supabase pour Client Components uniquement
// Sync (pas d'await nécessaire)

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
