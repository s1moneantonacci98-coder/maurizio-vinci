"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { register, type RegisterState } from "./actions";

const initialState: RegisterState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? "Registrazione in corso…" : "Crea account"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, initialState);

  if (state?.success) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Controlla la tua email</h1>
        <p className="text-sm text-neutral-500">
          Ti abbiamo inviato un&apos;email di conferma per attivare
          l&apos;account. Una volta confermato potrai accedere al portale.
        </p>
        <Link href="/login" className="mt-6 text-sm font-medium underline">
          Torna al login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-1 text-2xl font-semibold">Crea il tuo account</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Portale clienti Studio Maurizio Vinci
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="nome">
              Nome *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="cognome">
              Cognome *
            </label>
            <input
              id="cognome"
              name="cognome"
              type="text"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="company_name">
            Azienda
          </label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="phone">
            Telefono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          Accedi
        </Link>
      </p>
    </main>
  );
}
