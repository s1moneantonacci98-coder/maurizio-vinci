import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase per Server Component e Server Action.
 * Rispetta sempre la Row Level Security (usa la anon key + sessione utente
 * dai cookie). Da chiamare una volta per request/azione, mai a livello di
 * modulo (i cookie sono legati alla request corrente).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Chiamato da un Server Component: se hai il middleware che
            // aggiorna la sessione, questo può essere ignorato in sicurezza.
          }
        },
      },
    }
  );
}
