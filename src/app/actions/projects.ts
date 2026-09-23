"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ProjectRequestState {
  error?: string;
}

const BUDGET_LABELS: Record<string, string> = {
  quantifico: "Quantifico la disponibilità",
  necessita: "Preferisco stabilire in base alla necessità",
  proporzionale: "Budget proporzionale a margine e volumi",
  non_so: "Non ne ho idea",
};

/**
 * Richiesta di nuovo progetto da un cliente GIA' autenticato (pulsante
 * "Nuova richiesta" in /dashboard). A differenza del form pubblico
 * "Richiedi idea di progetto" (che crea un mv_leads da valutare), qui il
 * cliente e' gia' noto: la richiesta crea direttamente una commessa in
 * mv_projects, in stato iniziale "in_analisi".
 *
 * mv_projects consente INSERT via RLS solo all'admin, quindi qui usiamo il
 * client service_role — ma SOLO per impostare client_id sull'id
 * dell'utente autenticato nella sessione corrente (mai un valore letto dal
 * form): un cliente non puo' in alcun modo creare un progetto per conto di
 * un altro utente.
 */
export async function submitProjectRequest(
  _prevState: ProjectRequestState,
  formData: FormData
): Promise<ProjectRequestState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Devi accedere per inviare una richiesta." };
  }

  const nomeProgetto = String(formData.get("nome_progetto") ?? "").trim();
  const obiettivi = String(formData.get("obiettivi") ?? "").trim();
  const budgetKey = String(formData.get("budget_preferenza") ?? "");
  const infoGenerali = String(formData.get("info_generali") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim();

  if (!obiettivi || !infoGenerali) {
    return {
      error: "Descrivi almeno gli obiettivi e le informazioni generali del progetto.",
    };
  }

  const admin = createAdminClient();

  const { data: project, error: insertError } = await admin
    .from("mv_projects")
    .insert({
      title: nomeProgetto || "Nuova richiesta di progetto",
      description: infoGenerali,
      note: obiettivi,
      budget_range: BUDGET_LABELS[budgetKey] ?? null,
      deadline: deadline || null,
      client_id: user.id,
      status: "in_analisi",
    })
    .select("id, title")
    .single();

  if (insertError || !project) {
    return { error: "Si è verificato un errore nell'invio. Riprova più tardi." };
  }

  // Nessun trigger SQL copre l'insert diretto su mv_projects da parte di un
  // cliente (i trigger di Fase 1 coprono mv_leads e i cambi di stato):
  // notifichiamo quindi gli admin qui, in applicazione.
  const { data: admins } = await admin
    .from("mv_profiles")
    .select("id")
    .eq("role", "admin");

  if (admins && admins.length > 0) {
    await admin.from("mv_notifications").insert(
      admins.map((a) => ({
        user_id: a.id,
        title: "Nuova richiesta di progetto",
        message: `${user.email} ha richiesto un nuovo progetto: "${project.title}".`,
        link: `/admin/progetti/${project.id}`,
      }))
    );
  }

  redirect("/dashboard");
}
