import { createClient } from "@/lib/supabase/server";

export interface MvDocument {
  id: string;
  project_id: string;
  uploaded_by: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
}

export interface MvDocumentWithUrl extends MvDocument {
  url: string | null;
}

/**
 * Documenti di un progetto con URL firmato per il download (il bucket
 * mv-storage e' privato: nessuna lettura pubblica). RLS garantisce che solo
 * l'admin o il cliente proprietario del progetto vedano righe reali qui.
 */
export async function getProjectDocuments(
  projectId: string
): Promise<MvDocumentWithUrl[]> {
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from("mv_documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (!documents) {
    return [];
  }

  const withUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from("mv-storage")
        .createSignedUrl(doc.file_path, 60 * 5); // valido 5 minuti

      return { ...doc, url: signed?.signedUrl ?? null };
    })
  );

  return withUrls as MvDocumentWithUrl[];
}
