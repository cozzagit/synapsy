import Link from "next/link";
import { Brain, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold text-text">
                Synapsy
              </span>
            </Link>
            <p className="mt-3 font-accent text-sm italic text-text-secondary">
              La connessione giusta, al momento giusto.
            </p>
          </div>

          {/* Per gli utenti */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-text">
              Per te
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#come-funziona"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Come funziona
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Trova il tuo psicologo
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Domande frequenti
                </Link>
              </li>
            </ul>
          </div>

          {/* Per professionisti */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-text">
              Per professionisti
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/professionisti"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Area professionisti
                </Link>
              </li>
              <li>
                <Link
                  href="#come-funziona-psicologi"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Entra nella rete
                </Link>
              </li>
            </ul>
          </div>

          {/* Legale */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-text">
              Informazioni
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Termini di servizio
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="text-sm text-text-secondary transition-colors hover:text-primary-600"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Synapsy. Tutti i diritti
            riservati.
          </p>
          <p className="flex items-center gap-1 text-xs text-text-tertiary">
            Fatto con <Heart className="h-3 w-3 text-error" /> per il benessere
            mentale
          </p>
        </div>

        {/* Crisis Banner */}
        <div className="mt-6 rounded-xl bg-primary-50 p-4 text-center">
          <p className="text-xs text-primary-700">
            Se stai attraversando un momento di crisi, chiama il{" "}
            <strong>Telefono Amico: 02 2327 2327</strong> oppure il{" "}
            <strong>Telefono Azzurro: 19696</strong>. Non sei solo/a.
          </p>
        </div>
      </div>
    </footer>
  );
}
