"use server";

import { createClient } from "@/lib/supabase/server";

export interface RegisterState {
  error?: string;
  success?: boolean;
}

export async function register(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const cognome = String(formData.get("cognome") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !password || !nome || !cognome) {
    return { error: "Nome, cognome, email e password sono obbligatori." };
  }

  const fullName = `${nome} ${cognome}`.trim();

  if (password.length < 8) {
    return { error: "La password deve contenere almeno 8 caratteri." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // OBBLIGATORIO: isola questo utente nel namespace maurizio_vinci,
        // cosi' il trigger SQL popola mv_profiles solo per questa app.
        app: "maurizio_vinci",
        role: "client",
        full_name: fullName,
        company_name: companyName || null,
        phone: phone || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
