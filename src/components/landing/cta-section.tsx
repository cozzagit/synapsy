"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Heart } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-bg px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-8 shadow-xl sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div className="relative text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Heart className="h-7 w-7 text-white" />
            </div>

            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Il primo passo è il più importante
            </h2>

            <p className="mx-auto mt-4 max-w-xl font-accent text-lg italic text-white/80">
              “Porta persone, il sistema le trasforma nei pazienti giusti.”
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/questionnaire"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary-700 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl active:scale-[0.98]"
              >
                Inizia il questionario
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/60">
              Gratuito e anonimo. Nessun impegno richiesto.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
