"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Award,
  BarChart3,
  ArrowRight,
  Coins,
  Share2,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Pazienti compatibili",
    description:
      "Ricevi solo casi in linea con le tue specializzazioni e il tuo approccio terapeutico.",
  },
  {
    icon: TrendingUp,
    title: "Crescita meritocratica",
    description:
      "Il tuo ranking migliora con la qualità del tuo lavoro, non con il budget marketing.",
  },
  {
    icon: Share2,
    title: "Rete collaborativa",
    description:
      "Porta pazienti alla rete e guadagna crediti quando vengono assegnati ad altri colleghi.",
  },
  {
    icon: Award,
    title: "Badge di qualità",
    description:
      "Conquista badge basati su continuità terapeutica, affidabilità e contributo alla rete.",
  },
  {
    icon: BarChart3,
    title: "Dashboard ROI",
    description:
      "Monitora pazienti acquisiti, fatturato, costi e margine netto in tempo reale.",
  },
  {
    icon: Coins,
    title: "Costi trasparenti",
    description:
      "Solo 10€ per selezione e 60€ per continuità confermata. Nessun abbonamento.",
  },
];

export function ForPsychologistsSection() {
  return (
    <section
      id="per-psicologi"
      className="bg-bg px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-2 text-sm font-medium text-secondary-700">
            <Award className="h-4 w-4" />
            Per professionisti
          </div>
          <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            Fai crescere la tua pratica con il merito
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Niente più marketing individuale. Ricevi pazienti compatibili,
            costruisci la tua reputazione, fai parte di una rete che premia la
            qualità.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-2xl bg-surface p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 transition-colors group-hover:bg-secondary-100">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/register/psychologist"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-secondary-500 px-8 text-base font-semibold text-white shadow-md transition-all hover:bg-secondary-600 hover:shadow-lg active:scale-[0.98]"
          >
            Unisciti alla rete
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
