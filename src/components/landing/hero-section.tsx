"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Shield, Users, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-100 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-secondary-100 opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-accent-100 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Shield className="h-4 w-4" />
              Matching meritocratico e sicuro
            </div>

            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Trova lo psicologo{" "}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                giusto per te
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              Non scegli tra centinaia di profili. Il nostro sistema intelligente
              analizza le tue esigenze e ti propone i professionisti{" "}
              <strong className="text-text">più compatibili</strong> con il
              tuo percorso.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/questionnaire"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg active:scale-[0.98]"
              >
                Trova il tuo psicologo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#come-funziona"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-base font-semibold text-text shadow-sm transition-all hover:bg-surface-hover hover:shadow-md active:scale-[0.98]"
              >
                Come funziona
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  Professionisti verificati
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  Matching personalizzato
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  Qualità meritocratica
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Central orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-48 w-48 rounded-full bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200 blur-xl"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 shadow-xl" />
              </div>

              {/* Orbiting elements */}
              {[
                { label: "Ansia", pos: "top-8 left-8", color: "bg-primary-100 text-primary-700" },
                { label: "CBT", pos: "top-12 right-4", color: "bg-secondary-100 text-secondary-700" },
                { label: "Online", pos: "bottom-16 left-4", color: "bg-accent-100 text-accent-700" },
                { label: "Relazioni", pos: "bottom-8 right-8", color: "bg-primary-100 text-primary-700" },
                { label: "Gestalt", pos: "top-1/2 -left-2", color: "bg-secondary-100 text-secondary-700" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  className={`absolute ${item.pos} rounded-2xl ${item.color} px-4 py-2 text-sm font-medium shadow-md`}
                >
                  {item.label}
                </motion.div>
              ))}

              {/* Connection lines (SVG) */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 400"
                fill="none"
              >
                <motion.circle
                  cx="200"
                  cy="200"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                  className="text-border-strong"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2, delay: 0.8 }}
                />
                <motion.circle
                  cx="200"
                  cy="200"
                  r="160"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 12"
                  className="text-border"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2.5, delay: 1 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
