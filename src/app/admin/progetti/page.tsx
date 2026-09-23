import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  in_analisi: "In analisi",
  strategia: "Strategia pronta",
  in_corso: "In corso",
  completato: "Completato",
};

interface ProjectRow {
  id: string;
  title: string;
  status: string;
  deadline: string | null;
  mv_profiles: { full_name: string | null; company_name: string | null } | null;
}

export default async function AdminProgettiPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("mv_projects")
    .select(
      "id, title, status, deadline, mv_profiles(full_name, company_name)"
    )
    .order("created_at", { ascending: false })
    .returns<ProjectRow[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Progetti</h1>
      <div className="grid gap-4">
        {projects?.map((p) => (
          <Link
            key={p.id}
            href={`/admin/progetti/${p.id}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{p.title}</h2>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                {STATUS_LABELS[p.status] ?? p.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Cliente:{" "}
              {p.mv_profiles?.company_name ?? p.mv_profiles?.full_name ?? "—"}
            </p>
          </Link>
        ))}
        {(!projects || projects.length === 0) && (
          <p className="text-neutral-400">Nessun progetto creato.</p>
        )}
      </div>
    </div>
  );
}
