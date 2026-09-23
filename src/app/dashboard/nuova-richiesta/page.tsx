"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  submitProjectRequest,
  type ProjectRequestState,
} from "@/app/actions/projects";

const initialState: ProjectRequestState = {};

const BUDGET_OPTIONS = [
  { value: "quantifico", label: "Quantifico la disponibilità" },
  { value: "necessita", label: "Preferisco stabilire in base alla necessità" },
  { value: "proporzionale", label: "Budget proporzionale a margine e volumi" },
  { value: "non_so", label: "Non ne ho idea" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Invio in corso…" : "Invia richiesta"}
    </button>
  );
}

export default function NuovaRichiestaPage() {
  const [state, formAction] = useFormState(submitProjectRequest, initialState);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold">
        Nuova richiesta di progetto
      </h1>
      <p className="mb-8 text-sm text-neutral-500">
        Raccontaci la tua nuova idea: la prenderemo in carico e la troverai
        tra i tuoi progetti con stato &quot;In analisi&quot;.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Denominazione progetto" name="nome_progetto" />
        <TextArea label="Obiettivi *" name="obiettivi" required />

        <div>
          <span className="mb-2 block text-sm font-medium">Budget</span>
          <div className="flex flex-col gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="budget_preferenza"
                  value={opt.value}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <TextArea label="Info generali *" name="info_generali" required />
        <Field label="Deadline" name="deadline" type="date" />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <SubmitButton />
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={4}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
