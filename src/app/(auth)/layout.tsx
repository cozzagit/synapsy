"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { motion } from "motion/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-subtle">
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Sage green blob — top left */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary-100 opacity-60 blur-3xl" />
        {/* Lavender blob — top right */}
        <div className="absolute -right-24 -top-16 h-[400px] w-[400px] rounded-full bg-secondary-100 opacity-50 blur-3xl" />
        {/* Terracotta blob — bottom center */}
        <div className="absolute -bottom-24 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-accent-100 opacity-40 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
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
            <span className="font-heading text-2xl font-bold text-text">
              Synapsy
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl bg-surface p-8 shadow-lg sm:p-10">
            {children}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-text-tertiary"
        >
          Hai bisogno di aiuto?{" "}
          <a
            href="mailto:support@synapsy.it"
            className="text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            Contattaci
          </a>
        </motion.p>
      </div>
    </div>
  );
}
