import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectDocuments } from "@/lib/documents";
import {
  uploadProjectDocument,
  updateProjectStatus,
} from "@/app/actions/documents";
import { UploadDocumentForm } from "@/components/UploadDocumentForm";
import { ProjectStatusForm } from "@/components/ProjectStatusForm";

interface ProjectWithClient {
  id: string;
  title: string;
  description: string | null;
  status: string;
  budget_range: string | null;
  deadline: string | null;
  note: string | null;
  mv_profiles: {
    full_name: string | null;
    company_name: string | null;
    email: string;
    phone: string | null;
  } | null;
}

export default async function AdminProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("mv_projects")
    .select(
      "id, title, description, status, budget_range, deadline, note, mv_profiles(full_name, company_name, email, phone)"
    )
    .eq("id", id)
    .single<ProjectWithClient>();

  if (!project) {
    notFound();
  }

  const documents = await getProjectDocuments(id);
  const uploadAction = uploadProjectDocument.bind(null, id);
  const statusAction = updateProjectStatus.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-semibold">{project.title}</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Cliente:{" "}
        {project.mv_profiles?.company_name ??
          project.mv_profiles?.full_name ??
          "—"}
        {project.mv_profiles?.email ? ` · ${project.mv_profiles.email}` : ""}
      </p>

      <div className="mb-8">
        <ProjectStatusForm action={statusAction} currentStatus={project.status} />
      </div>

      {project.description && (
        <p className="mb-4 text-sm text-neutral-600">{project.description}</p>
      )}
      {project.note && (
        <p className="mb-6 text-sm text-neutral-600">
          <span className="font-medium">Obiettivi: </span>
          {project.note}
        </p>
      )}

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

      <h2 className="mb-3 text-lg font-medium">Carica un deliverable</h2>
      <UploadDocumentForm action={uploadAction} />
    </div>
  );
}
