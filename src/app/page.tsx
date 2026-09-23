import Link from "next/link";
import { ArrowRight, FileSearch, FolderLock, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FeatureCard from "@/components/site/FeatureCard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.slate.100),_transparent_60%)]"
            aria-hidden
          />
          <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              Marketing tecnologico per PMI
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Consulenza integrata che porta il tuo business{" "}
              <span className="bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                oltre il mercato
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Il portale clienti di Studio Maurizio Vinci: monitora
              l&apos;avanzamento dei tuoi progetti in tempo reale, carica
              documenti in sicurezza e ricevi preventivi, tutto in un unico
              spazio riservato.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/richiedi-idea-progetto"
                className="group inline-flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
              >
                Richiedi un&apos;idea di progetto
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Accedi al portale
              </Link>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section id="servizi" className="border-t border-slate-200 bg-slate-50/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Come funziona il portale
              </h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Tre passaggi per iniziare a collaborare con lo studio, dalla
                prima idea fino alla consegna del progetto.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={FileSearch}
                title="Invio brief & valutazione fattibilità"
                description="Racconta la tua idea o il tuo progetto: lo studio ne valuta gratuitamente sostenibilità e fattibilità e ti risponde con una proposta chiara."
              />
              <FeatureCard
                icon={LayoutDashboard}
                title="Area riservata clienti"
                description="Segui lo stato di avanzamento dei tuoi progetti in tempo reale, dalla fase di analisi fino alla consegna, senza dover scrivere email di aggiornamento."
              />
              <FeatureCard
                icon={FolderLock}
                title="Gestione documentale sicura"
                description="Carica e consulta documenti, preventivi e deliverable in uno spazio riservato e protetto, sempre accessibile dal tuo account."
              />
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-900 px-8 py-10 text-center shadow-sm sm:flex-row sm:text-left">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Hai già un&apos;idea di progetto?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Compila il brief: valutazione gratuita, nessun impegno.
              </p>
            </div>
            <Link
              href="/richiedi-idea-progetto"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Richiedi un&apos;idea di progetto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
