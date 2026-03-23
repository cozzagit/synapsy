"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-subtle flex flex-col items-center justify-center px-4 py-16">
      {/* Decorative background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary-100 opacity-60 blur-3xl" />
        <div className="absolute -right-24 -top-16 h-[400px] w-[400px] rounded-full bg-secondary-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-accent-100 opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10"
        >
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
        </motion.div>

        {/* Soft gradient illustration circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden="true"
          className="mb-8 h-40 w-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #a8c5b5 0%, #c8bfea 45%, #e8c4a0 80%, transparent 100%)",
            boxShadow: "0 8px 32px 0 rgba(91,138,114,0.18), 0 2px 8px 0 rgba(139,126,200,0.12)",
          }}
        />

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3">
            404
          </p>
          <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl mb-4">
            Pagina non trovata
          </h1>
          <p className="text-text-secondary leading-relaxed mb-8">
            La pagina che cerchi non esiste o è stata spostata.
            <br />
            Può capitare — non ti preoccupare.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Torna alla home
            </Link>
            <a
              href="mailto:support@synapsy.it"
              className="text-sm text-text-secondary transition-colors hover:text-primary-600 hover:underline"
            >
              Hai bisogno di aiuto? Contattaci
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
