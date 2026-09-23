import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase con service_role key: BYPASSA la Row Level Security.
 *
 * Usare SOLO in codice server-only (Server Action / Route Handler admin)
 * per operazioni che richiedono privilegi elevati e mai esporre al client.
 * Non usare per operazioni "per conto dell'utente": in quei casi usare
 * sempre src/lib/supabase/server.ts, che rispetta la RLS.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
