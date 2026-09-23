"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#servizi", label: "Servizi" },
  { href: "/richiedi-idea-progetto", label: "Richiedi Progetto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              Studio Maurizio Vinci
            </span>
            <span className="text-xs font-medium text-slate-500">
              Portale Clienti
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Accedi
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Registrati
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Accedi
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
            >
              Registrati
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
