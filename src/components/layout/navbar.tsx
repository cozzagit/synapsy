"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Brain } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold text-text">
            Synapsy
          </span>
        </Link>

        {/* Desktop Nav — SOLO per utenti/pazienti */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#come-funziona"
            className="text-sm text-text-secondary transition-colors hover:text-primary-600"
          >
            Come funziona
          </Link>
          <Link
            href="#perche-synapsy"
            className="text-sm text-text-secondary transition-colors hover:text-primary-600"
          >
            Perché Synapsy
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-text transition-colors hover:text-primary-600"
          >
            Accedi
          </Link>
          <Link
            href="/questionnaire"
            className="inline-flex h-10 items-center rounded-xl bg-primary-500 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-[0.98]"
          >
            Trova il tuo psicologo
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-subtle md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="border-t border-border bg-bg px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="#come-funziona"
              className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-subtle"
              onClick={() => setIsOpen(false)}
            >
              Come funziona
            </Link>
            <Link
              href="#perche-synapsy"
              className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-subtle"
              onClick={() => setIsOpen(false)}
            >
              Perché Synapsy
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-bg-subtle"
              onClick={() => setIsOpen(false)}
            >
              Accedi
            </Link>
            <Link
              href="/questionnaire"
              className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-medium text-white shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Trova il tuo psicologo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
