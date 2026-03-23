"use client";

import { motion } from "motion/react";
import {
  ClipboardList,
  Brain,
  UserCheck,
  Phone,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Rispondi al questionario",
    description:
      "Poche domande strutturate per capire di cosa hai bisogno. Nessun testo libero, nessun dato personale.",
    color: "bg-primary-50 text-primary-600",
    accent: "from-primary-400 to-primary-600",
  },
  {
    icon: Brain,
    title: "Il sistema trova i match",
    description:
      "L'algoritmo analizza compatibilit\u00e0, specializzazione e qualit\u00e0 per proporti i professionisti migliori.",
    color: "bg-secondary-50 text-secondary-600",
    accent: "from-secondary-400 to-secondary-600",
  },
  {
    icon: UserCheck,
    title: "Scegli il tuo psicologo",
    description:
      "Visualizza i profili compatibili con punteggio di matching, badge di qualit\u00e0 e specializzazioni.",
    color: "bg-accent-50 text-accent-600",
    accent: "from-accent-400 to-accent-600",
  },
  {
    icon: Phone,
    title: "Call conoscitiva gratuita",
    description:
      "Una prima chiamata gratuita per conoscervi. Nessun impegno, nessun costo.",
    color: "bg-primary-50 text-primary-600",
    accent: "from-primary-400 to-primary-600",
  },
  {
    icon: Sparkles,
    title: "Inizia il percorso",
    description:
      "Se c'\u00e8 feeling, continui con il tuo professionista. Il sistema impara e migliora per tutti.",
    color: "bg-secondary-50 text-secondary-600",
    accent: "from-secondary-400 to-secondary-600",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="come-funziona"
      className="bg-bg-subtle px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            Come funziona
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Un percorso semplice e sicuro verso il professionista giusto per te.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connection line (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary-200 via-secondary-200 to-accent-200 lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${
                  index > 0 ? "lg:mt-20" : ""
                }`}
              >
                {/* Step number on the line (desktop) */}
                <div className="absolute left-1/2 top-6 z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center lg:flex">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.accent} text-sm font-bold text-white shadow-md`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Content — alternates sides */}
                <div
                  className={`${
                    index % 2 === 0
                      ? "lg:col-start-1 lg:text-right"
                      : "lg:col-start-2"
                  }`}
                >
                  <div
                    className={`rounded-2xl bg-surface p-6 shadow-sm transition-shadow hover:shadow-md ${
                      index % 2 === 0 ? "lg:ml-auto lg:mr-12" : "lg:ml-12"
                    } max-w-lg`}
                  >
                    <div
                      className={`mb-4 inline-flex items-center gap-3 ${
                        index % 2 === 0 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-tertiary lg:hidden">
                        Passo {index + 1}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
