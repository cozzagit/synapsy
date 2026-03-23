"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Brain,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  BarChart3,
  Share2,
  Coins,
  Shield,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Pazienti compatibili",
    description:
      "Ricevi solo casi in linea con le tue specializzazioni e il tuo approccio terapeutico. Niente più pazienti fuori target.",
  },
  {
    icon: TrendingUp,
    title: "Crescita meritocratica",
    description:
      "Il tuo ranking migliora con la qualità del tuo lavoro, non con il budget marketing. La qualità viene premiata.",
  },
  {
    icon: Share2,
    title: "Rete collaborativa",
    description:
      "Porta pazienti alla rete e guadagna crediti quando vengono assegnati ad altri colleghi. Tutti vincono.",
  },
  {
    icon: Award,
    title: "Badge di qualità",
    description:
      "Conquista badge basati su continuità terapeutica, affidabilità e contributo alla rete. Visibili ai pazienti.",
  },
  {
    icon: BarChart3,
    title: "Dashboard ROI",
    description:
      "Monitora pazienti acquisiti, fatturato, costi e margine netto in tempo reale nella tua dashboard dedicata.",
  },
  {
    icon: Coins,
    title: "Costi trasparenti",
    description:
      "Solo 10€ per selezione e 60€ per continuità confermata. Nessun abbonamento, nessun costo fisso.",
  },
];

const steps = [
  {
    number: "01",
    title: "Registrati e completa il profilo",
    description:
      "Inserisci le tue specializzazioni, approccio terapeutico, disponibilità e una breve bio. Verifica le credenziali dell'Albo.",
  },
  {
    number: "02",
    title: "Ricevi casi compatibili",
    description:
      "Il sistema ti invia automaticamente casi anonimi compatibili con il tuo profilo. Vedi attributi chiave e score di compatibilità.",
  },
  {
    number: "03",
    title: "Candidati ai casi",
    description:
      "Decidi quali casi accettare. Il paziente vede il tuo profilo e sceglie tra i professionisti candidati.",
  },
  {
    number: "04",
    title: "Call conoscitiva gratuita",
    description:
      "Una prima chiamata per conoscervi. Se il paziente decide di continuare, inizi il percorso terapeutico.",
  },
];

export default function ProfessionistiPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar professionisti */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-500 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-bold text-text">
              Synapsy
            </span>
            <span className="rounded-lg bg-secondary-50 px-2 py-0.5 text-xs font-medium text-secondary-700">
              Pro
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-text transition-colors hover:text-secondary-600 sm:block"
            >
              Accedi
            </Link>
            <Link
              href="/register/psychologist"
              className="inline-flex h-10 items-center rounded-xl bg-secondary-500 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-secondary-600 hover:shadow-md active:scale-[0.98]"
            >
              Registrati
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-100 opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary-100 opacity-25 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-2 text-sm font-medium text-secondary-700">
                <Shield className="h-4 w-4" />
                Area riservata ai professionisti
              </div>

              <h1 className="font-heading text-4xl font-extrabold leading-tight text-text sm:text-5xl lg:text-6xl">
                Fai crescere la tua pratica{" "}
                <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                  con il merito
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                Niente più marketing individuale. Ricevi pazienti
                compatibili con le tue specializzazioni, costruisci la tua
                reputazione e fai parte di una rete che premia la qualità.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/register/psychologist"
                  className="group inline-flex h-12 items-center gap-2 rounded-xl bg-secondary-500 px-8 text-base font-semibold text-white shadow-md transition-all hover:bg-secondary-600 hover:shadow-lg active:scale-[0.98]"
                >
                  Unisciti alla rete
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#come-funziona-pro"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-base font-semibold text-text shadow-sm transition-all hover:bg-surface-hover active:scale-[0.98]"
                >
                  Come funziona
                </Link>
              </div>
            </motion.div>

            {/* Trust numbers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8"
            >
              {[
                { value: "0€", label: "Costo fisso mensile" },
                { value: "10€", label: "Fee per selezione" },
                { value: "100%", label: "Meritocratico" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading text-2xl font-bold text-secondary-600">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-text-tertiary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="come-funziona-pro"
          className="bg-bg-subtle px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center font-heading text-3xl font-bold text-text"
            >
              Come funziona per te
            </motion.h2>

            <div className="mt-12 space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 rounded-2xl bg-surface p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-400 to-primary-400 font-heading text-lg font-bold text-white">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-text">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits grid */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center font-heading text-3xl font-bold text-text"
            >
              Vantaggi della rete
            </motion.h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl bg-surface p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 transition-colors group-hover:bg-secondary-100">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-text">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {b.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth path */}
        <section className="bg-bg-subtle px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-text">
                Il tuo percorso di crescita
              </h2>
              <p className="mt-4 text-text-secondary">
                Più aiuti, più cresci. Il sistema premia la qualità nel tempo.
              </p>
            </motion.div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {[
                { name: "Seme", months: "0-3 mesi", color: "bg-primary-100 text-primary-700 border-primary-200" },
                { name: "Germoglio", months: "3-6 mesi", color: "bg-primary-200 text-primary-800 border-primary-300" },
                { name: "Crescita", months: "6-12 mesi", color: "bg-secondary-100 text-secondary-700 border-secondary-200" },
                { name: "Fioritura", months: "12-24 mesi", color: "bg-secondary-200 text-secondary-800 border-secondary-300" },
                { name: "Radici", months: "24+ mesi", color: "bg-accent-100 text-accent-700 border-accent-200" },
              ].map((stage, i) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`rounded-2xl border px-5 py-3 text-center ${stage.color}`}
                  >
                    <div className="font-heading text-sm font-bold">
                      {stage.name}
                    </div>
                    <div className="mt-0.5 text-xs opacity-75">
                      {stage.months}
                    </div>
                  </div>
                  {i < 4 && (
                    <ArrowRight className="my-1 h-4 w-4 rotate-90 text-text-tertiary sm:hidden" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-sm text-text-tertiary">
              Avanzamento basato su <strong>tempo + qualità</strong>. Ogni
              stadio sblocca benefici aggiuntivi.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-500 via-secondary-600 to-primary-600 p-8 text-center shadow-xl sm:p-12">
              <Heart className="mx-auto h-10 w-10 text-white/80" />
              <h2 className="mt-4 font-heading text-3xl font-bold text-white">
                Unisciti alla rete Synapsy
              </h2>
              <p className="mx-auto mt-3 max-w-lg font-accent text-lg italic text-white/80">
                “Porta persone, il sistema le trasforma nei pazienti giusti.”
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/register/psychologist"
                  className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-secondary-700 shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  Registrati ora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Nessun abbonamento
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> Attivo in 24h
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Dati protetti
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-border bg-bg-subtle py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Link href="/" className="text-sm text-text-secondary hover:text-primary-600">
            &larr; Torna al sito per i pazienti
          </Link>
          <p className="mt-3 text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Synapsy. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
