import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  in_analisi: "In analisi",
  strategia: "Strategia pronta",
  in_corso: "In corso",
  completato: "Completato",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("mv_projects")
    .select("id, title, description, status, deadline, created_at")
    .eq("client_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">I tuoi progetti</h1>
        <Link
          href="/dashboard/nuova-richiesta"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nuova richiesta
        </Link>
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-neutral-500">
          Non hai ancora progetti attivi. Usa &quot;Nuova richiesta&quot; per
          proporre la tua prossima idea, oppure verrai avvisato qui non
          appena Maurizio ne avvierà uno per te.
        </p>
      )}

      <div className="grid gap-4">
        {projects?.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/progetti/${p.id}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{p.title}</h2>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {STATUS_LABELS[p.status] ?? p.status}
              </span>
            </div>
            {p.description && (
              <p className="mt-2 text-sm text-neutral-600">{p.description}</p>
            )}
            {p.deadline && (
              <p className="mt-2 text-xs text-neutral-400">
                Scadenza: {new Date(p.deadline).toLocaleDateString("it-IT")}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
