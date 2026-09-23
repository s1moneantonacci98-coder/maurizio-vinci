"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UploadDocumentState {
  error?: string;
  success?: boolean;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Carica un documento su un progetto (deliverable di Maurizio o file del
 * cliente). Il projectId viene "legato" (bind) dal Server Component
 * chiamante prima di passare l'azione al form client, quindi non arriva mai
 * dal form stesso. L'autorizzazione reale resta comunque garantita dalla RLS
 * su mv_documents e storage.objects (solo admin o cliente proprietario del
 * progetto possono scrivere in quel path).
 */
export async function uploadProjectDocument(
  projectId: string,
  _prevState: UploadDocumentState,
  formData: FormData
): Promise<UploadDocumentState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Seleziona un file da caricare." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { error: "Il file supera il limite di 10 MB." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Devi essere autenticato per caricare un file." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const path = `projects/${projectId}/${Date.now()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("mv-storage")
    .upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return {
      error:
        "Caricamento non riuscito. Verifica di avere accesso a questo progetto.",
    };
  }

  // L'insert triggera mv_documents_notify (SQL), che notifica in automatico
  // l'admin (se carica il cliente) o il cliente (se carica l'admin).
  const { error: insertError } = await supabase.from("mv_documents").insert({
    project_id: projectId,
    uploaded_by: user.id,
    file_name: file.name,
    file_path: path,
    file_size: file.size,
  });

  if (insertError) {
    return {
      error: "File caricato ma non registrato. Contatta l'assistenza.",
    };
  }

  revalidatePath(`/dashboard/progetti/${projectId}`);
  revalidatePath(`/admin/progetti/${projectId}`);

  return { success: true };
}

export interface UpdateStatusState {
  error?: string;
}

const VALID_STATUSES = ["in_analisi", "strategia", "in_corso", "completato"];

/**
 * Aggiorna lo stato di un progetto. Consentito solo all'admin (RLS su
 * mv_projects). Il trigger SQL mv_projects_notify_status_change notifica in
 * automatico il cliente in-app quando lo stato cambia.
 */
export async function updateProjectStatus(
  projectId: string,
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  const status = String(formData.get("status") ?? "");

  if (!VALID_STATUSES.includes(status)) {
    return { error: "Stato non valido." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mv_projects")
    .update({ status })
    .eq("id", projectId);

  if (error) {
    return { error: "Impossibile aggiornare lo stato (permessi insufficienti?)." };
  }

  revalidatePath(`/admin/progetti/${projectId}`);
  revalidatePath("/admin/progetti");
  revalidatePath(`/dashboard/progetti/${projectId}`);
  revalidatePath("/dashboard");

  return {};
}
