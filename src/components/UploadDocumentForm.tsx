"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { UploadDocumentState } from "@/app/actions/documents";

const initialState: UploadDocumentState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Caricamento…" : "Carica file"}
    </button>
  );
}

/**
 * Form di upload riutilizzabile sia per il cliente (dashboard) sia per
 * l'admin (deliverable). `action` e' l'azione server con il projectId gia'
 * "bind"-ato dal Server Component chiamante.
 */
export function UploadDocumentForm({
  action,
}: {
  action: (
    prevState: UploadDocumentState,
    formData: FormData
  ) => Promise<UploadDocumentState>;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium" htmlFor="file">
            Nuovo file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="w-full text-sm"
          />
        </div>
        <SubmitButton />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">File caricato con successo.</p>
      )}
    </form>
  );
}
