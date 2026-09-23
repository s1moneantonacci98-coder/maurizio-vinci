import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 text-center">
      <h1 className="text-3xl font-bold">Studio Maurizio Vinci</h1>
      <p className="max-w-md text-neutral-500">
        Portale clienti e area di gestione progetti. Fase 2 completata:
        autenticazione, lead pubblici, portale cliente e area admin sono
        operativi.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link
          href="/richiedi-idea-progetto"
          className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-800"
        >
          Richiedi un&apos;idea di progetto
        </Link>
        <Link href="/login" className="font-medium underline">
          Accedi
        </Link>
        <Link href="/register" className="font-medium underline">
          Registrati
        </Link>
      </div>
    </main>
  );
}
