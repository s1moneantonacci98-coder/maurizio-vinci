"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Inserisci email e password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Credenziali non valide. Riprova." };
  }

  // Isolamento multi-app: auth.users e' condivisa con altre applicazioni
  // sulla stessa istanza Supabase. Un account valido ma registrato per
  // un'altra app (user_metadata.app diverso da "maurizio_vinci") non deve
  // poter accedere a questo portale.
  if (data.user.user_metadata?.app !== "maurizio_vinci") {
    await supabase.auth.signOut();
    return {
      error: "Questo account non è registrato per Studio Maurizio Vinci.",
    };
  }

  const { data: profile } = await supabase
    .from("mv_profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  // Redirect condizionale in base al ruolo: admin -> /admin, client -> /dashboard.
  // Lo strato di protezione nei rispettivi layout resta comunque una seconda
  // barriera (difesa in profondità) in caso di accesso diretto all'URL.
  redirect(profile?.role === "admin" ? "/admin" : "/dashboard");
}
