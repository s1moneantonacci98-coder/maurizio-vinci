import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectDocuments } from "@/lib/documents";
import { uploadProjectDocument } from "@/app/actions/documents";
import { UploadDocumentForm } from "@/components/UploadDocumentForm";

const STATUS_LABELS: Record<string, string> = {
  in_analisi: "In analisi",
  strategia: "Strategia pronta",
  in_corso: "In corso",
  completato: "Completato",
};

export default async function ClientProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();

  // RLS (client_id = auth.uid() or admin) garantisce che un cliente non
  // possa mai vedere il progetto di un altro: se la riga non appartiene a
  // questo utente, la select non restituisce nulla.
  const { data: project } = await supabase
    .from("mv_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const documents = await getProjectDocuments(id);
  const uploadAction = uploadProjectDocument.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
          {STATUS_LABELS[project.status] ?? project.status}
        </span>
      </div>

      {project.description && (
        <p className="mb-6 text-sm text-neutral-600">{project.description}</p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
        {project.budget_range && (
          <div>
            <div className="text-neutral-400">Budget</div>
            <div>{project.budget_range}</div>
          </div>
        )}
        {project.deadline && (
          <div>
            <div className="text-neutral-400">Scadenza</div>
            <div>
              {new Date(project.deadline).toLocaleDateString("it-IT")}
            </div>
          </div>
        )}
      </div>

      <h2 className="mb-3 text-lg font-medium">Documenti</h2>
      <ul className="mb-6 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <span>{doc.file_name}</span>
            {doc.url ? (
              <a
                href={doc.url}
                className="font-medium text-blue-600 hover:underline"
              >
                Scarica
              </a>
            ) : (
              <span className="text-neutral-400">Non disponibile</span>
            )}
          </li>
        ))}
        {documents.length === 0 && (
          <li className="px-4 py-6 text-center text-neutral-400">
            Nessun documento ancora caricato.
          </li>
        )}
      </ul>

      <h2 className="mb-3 text-lg font-medium">Carica un file</h2>
      <UploadDocumentForm action={uploadAction} />
    </div>
  );
}
