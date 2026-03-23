"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Brain, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Synapsy] Unhandled error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-subtle flex flex-col items-center justify-center px-4 py-16">
      {/* Decorative background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent-100 opacity-40 blur-3xl" />
        <div className="absolute -right-24 -top-16 h-[400px] w-[400px] rounded-full bg-primary-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-secondary-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <div className="mb-10">
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
            aria-label="Torna alla homepage di Synapsy"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-md transition-all group-hover:bg-primary-600 group-hover:shadow-lg">
              <Brain className="h-6 w-6" />
            </div>
            <span className="font-heading text-2xl font-bold text-text">Synapsy</span>
          </Link>
        </div>

        {/* Illustration circle */}
        <div
          aria-hidden="true"
          className="mb-8 h-32 w-32 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #e8c4a0 0%, #c8bfea 55%, #a8c5b5 100%)",
            boxShadow: "0 8px 32px 0 rgba(212,149,106,0.18)",
          }}
        >
          <RefreshCw className="h-10 w-10 text-white opacity-80" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl mb-4">
          Qualcosa è andato storto
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          Si è verificato un errore imprevisto. Prova a ricaricare la pagina —
          di solito questo risolve il problema.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Riprova
          </button>
          <Link
            href="/"
            className="text-sm text-text-secondary transition-colors hover:text-primary-600 hover:underline"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
