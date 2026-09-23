"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { UpdateStatusState } from "@/app/actions/documents";

const initialState: UpdateStatusState = {};

const STATUS_OPTIONS = [
  { value: "in_analisi", label: "In analisi" },
  { value: "strategia", label: "Strategia pronta" },
  { value: "in_corso", label: "In corso" },
  { value: "completato", label: "Completato" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Aggiornamento…" : "Aggiorna stato"}
    </button>
  );
}

/**
 * Cambia lo stato di un progetto (solo admin). Il projectId e' "bind"-ato
 * dal Server Component chiamante; il cliente viene notificato in automatico
 * dal trigger SQL mv_projects_notify_status_change.
 */
export function ProjectStatusForm({
  action,
  currentStatus,
}: {
  action: (
    prevState: UpdateStatusState,
    formData: FormData
  ) => Promise<UpdateStatusState>;
  currentStatus: string;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="status">
          Stato progetto
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
