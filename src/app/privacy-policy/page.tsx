import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Studio Maurizio Vinci",
  description:
    "Informativa sul trattamento dei dati personali del portale clienti di Studio Maurizio Vinci, ai sensi del Regolamento UE 2016/679 (GDPR).",
};

const SECTIONS = [
  {
    n: "1",
    title: "Titolare del trattamento",
    body: (
      <>
        <p>
          Il Titolare del trattamento dei dati personali raccolti tramite
          questo portale è <strong>Studio Maurizio Vinci</strong>, con sede in
          Via Alcide De Gasperi, 12/A — 70010 Cellamare (Bari).
        </p>
        <p>
          Per qualsiasi informazione relativa al trattamento dei dati
          personali è possibile contattare il Titolare all&apos;indirizzo
          email{" "}
          <a
            href="mailto:info@mauriziovinci.it"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            info@mauriziovinci.it
          </a>{" "}
          o al numero{" "}
          <a
            href="tel:+393927782125"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            +39 392 778 21 25
          </a>
          .
        </p>
      </>
    ),
  },
  {
    n: "2",
    title: "Dati raccolti",
    body: (
      <>
        <p>
          Attraverso la registrazione e l&apos;utilizzo del portale clienti,
          Studio Maurizio Vinci raccoglie e tratta le seguenti categorie di
          dati personali:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Dati anagrafici e di contatto:</strong> nome, cognome,
            ragione sociale/azienda, indirizzo email e numero di telefono
            forniti in fase di registrazione o di richiesta di un progetto.
          </li>
          <li>
            <strong>Credenziali di accesso:</strong> email e password
            (quest&apos;ultima conservata in forma cifrata) utilizzate per
            autenticarsi all&apos;area riservata del portale.
          </li>
          <li>
            <strong>File e documenti:</strong> allegati, brief, preventivi e
            qualsiasi altro documento caricato dal cliente o dallo studio in
            relazione ai progetti seguiti.
          </li>
          <li>
            <strong>Dati di navigazione:</strong> informazioni tecniche
            raccolte automaticamente durante l&apos;utilizzo del portale
            (es. indirizzo IP, orari di accesso), nella misura strettamente
            necessaria al funzionamento del servizio.
          </li>
        </ul>
      </>
    ),
  },
  {
    n: "3",
    title: "Finalità del trattamento",
    body: (
      <>
        <p>I dati raccolti sono trattati per le seguenti finalità:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Gestione operativa delle richieste di progetto inviate tramite il
            portale, inclusa la valutazione di fattibilità e sostenibilità.
          </li>
          <li>
            Predisposizione di preventivi e proposte commerciali relative ai
            progetti richiesti.
          </li>
          <li>
            Erogazione dei servizi dell&apos;area riservata clienti:
            creazione e gestione dell&apos;account, monitoraggio
            dell&apos;avanzamento dei progetti, caricamento e consultazione
            di documenti e comunicazione di notifiche relative allo stato dei
            lavori.
          </li>
          <li>
            Adempimento di obblighi contrattuali, contabili e fiscali
            derivanti dall&apos;erogazione dei servizi di consulenza.
          </li>
        </ul>
        <p>
          Il conferimento dei dati è necessario per l&apos;erogazione dei
          servizi richiesti: il mancato conferimento comporta
          l&apos;impossibilità di accedere al portale o di dar seguito alla
          richiesta di progetto.
        </p>
      </>
    ),
  },
  {
    n: "4",
    title: "Conservazione e sicurezza dei dati",
    body: (
      <>
        <p>
          I dati personali e i documenti caricati sul portale sono
          conservati su infrastruttura <strong>Supabase</strong>, che
          fornisce database, autenticazione e storage con misure di
          sicurezza tecniche e organizzative adeguate, tra cui:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            cifratura dei dati in transito (TLS) e a riposo sui server
            dell&apos;infrastruttura;
          </li>
          <li>
            politiche di accesso granulari (Row Level Security) che
            garantiscono che ogni cliente possa consultare esclusivamente i
            propri dati e documenti;
          </li>
          <li>
            accesso all&apos;area amministrativa riservato esclusivamente al
            personale autorizzato dello Studio.
          </li>
        </ul>
        <p>
          I dati sono conservati per il tempo necessario al perseguimento
          delle finalità sopra indicate e, in ogni caso, per il periodo
          previsto dagli obblighi di legge applicabili in materia fiscale e
          contrattuale.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Diritti dell'interessato",
    body: (
      <>
        <p>
          In qualità di interessato, ai sensi degli articoli 15-22 del
          Regolamento UE 2016/679 (GDPR), hai il diritto di richiedere in
          qualsiasi momento:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>l&apos;accesso</strong> ai tuoi dati personali e alle
            informazioni relative al trattamento;
          </li>
          <li>
            <strong>la rettifica</strong> dei dati inesatti o incompleti;
          </li>
          <li>
            <strong>la cancellazione</strong> dei dati, quando non sia
            necessaria la loro ulteriore conservazione per obblighi di legge
            o per l&apos;esecuzione di un contratto in corso;
          </li>
          <li>
            la limitazione o l&apos;opposizione al trattamento e, ove
            applicabile, la portabilità dei dati.
          </li>
        </ul>
        <p>
          Per esercitare i propri diritti è possibile scrivere in qualsiasi
          momento a{" "}
          <a
            href="mailto:info@mauriziovinci.it"
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            info@mauriziovinci.it
          </a>
          . Resta inoltre fermo il diritto di proporre reclamo
          all&apos;Autorità Garante per la protezione dei dati personali
          qualora si ritenga che il trattamento violi la normativa vigente.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-slate-200 bg-slate-50/60">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              Conforme al Regolamento UE 2016/679 (GDPR)
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              Informativa sul trattamento dei dati personali raccolti
              attraverso il portale clienti di Studio Maurizio Vinci.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Ultimo aggiornamento:{" "}
              {new Date().toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="space-y-14">
            {SECTIONS.map((section) => (
              <div key={section.n}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                    {section.n}
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-4 space-y-3 pl-11 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  {section.body}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
