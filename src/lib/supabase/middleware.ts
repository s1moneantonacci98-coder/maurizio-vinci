import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Aggiorna/rinfresca la sessione Supabase ad ogni richiesta e la propaga sia
 * alla request che alla response, cosi' Server Component e Server Action
 * vedono sempre una sessione valida (pattern consigliato da Supabase per
 * Next.js App Router).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: non aggiungere logica tra createServerClient e getUser().
  // Un bug semplice potrebbe rendere difficile il debug di problemi di
  // sessioni utente casuali.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Esempio di protezione rotte (da adattare nelle fasi successive):
  // if (!user && request.nextUrl.pathname.startsWith("/portale")) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}
