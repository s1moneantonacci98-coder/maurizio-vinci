"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase per Client Component ("use client").
 * Rispetta sempre la Row Level Security (usa la anon key).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
