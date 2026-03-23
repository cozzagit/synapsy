"use client";

import { motion } from "motion/react";
import { ShieldCheck, Clock, Eye, Heart, Lock, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Professionisti verificati",
    description:
      "Ogni psicologo \u00e8 iscritto all'Albo e verificato dal nostro team. Nessun profilo non qualificato.",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: Sparkles,
    title: "Matching intelligente",
    description:
      "Non scegli da una lista infinita. Il sistema analizza le tue esigenze e ti propone i professionisti pi\u00f9 adatti.",
    color: "bg-secondary-50 text-secondary-600",
  },
  {
    icon: Lock,
    title: "Totale anonimato",
    description:
      "I tuoi dati restano anonimi fino a quando non scegli tu di contattare un professionista. Nessuna pressione.",
    color: "bg-accent-50 text-accent-600",
  },
  {
    icon: Clock,
    title: "Call gratuita",
    description:
      "La prima chiamata conoscitiva \u00e8 sempre gratuita. Conosci il professionista senza impegno.",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: Eye,
    title: "Qualit\u00e0 trasparente",
    description:
      "Ogni professionista ha un punteggio di qualit\u00e0 basato sulla continuit\u00e0 reale dei suoi pazienti.",
    color: "bg-secondary-50 text-secondary-600",
  },
  {
    icon: Heart,
    title: "Nessun costo per te",
    description:
      "Il servizio di matching \u00e8 completamente gratuito per chi cerca supporto. Sempre.",
    color: "bg-accent-50 text-accent-600",
  },
];

export function WhySynapsySection() {
  return (
    <section
      id="perche-synapsy"
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
          <h2 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            Perch\u00e9 scegliere Synapsy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Crediamo che trovare il professionista giusto non debba essere
            complicato, costoso o stressante.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-2xl bg-surface p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${reason.color} transition-colors group-hover:scale-110`}
              >
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
