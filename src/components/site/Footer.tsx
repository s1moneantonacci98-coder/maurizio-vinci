import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Studio Maurizio Vinci
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Consulenza integrata di marketing tecnologico per PMI: dalla
              strategia all&apos;esecuzione, con un project manager dedicato
              fino al raggiungimento del risultato.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contatti</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>Via Alcide De Gasperi, 12/A — 70010 Cellamare (Bari)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <a href="tel:+393927782125" className="hover:text-slate-900">
                  +39 392 778 21 25
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <a
                  href="mailto:info@mauriziovinci.it"
                  className="hover:text-slate-900"
                >
                  info@mauriziovinci.it
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Portale</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-500">
              <li>
                <Link
                  href="/richiedi-idea-progetto"
                  className="hover:text-slate-900"
                >
                  Richiedi un&apos;idea di progetto
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900">
                  Accedi
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900">
                  Registrati
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Studio Maurizio Vinci. Tutti i
            diritti riservati.
          </p>
          <Link
            href="/privacy-policy"
            className="text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
