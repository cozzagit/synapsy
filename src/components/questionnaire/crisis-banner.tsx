"use client";

import { motion } from "motion/react";
import { Heart, Phone } from "lucide-react";

export function CrisisBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full rounded-2xl bg-primary-50 border border-primary-200 p-4 sm:p-5"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-5 w-5 text-primary-600" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-primary-700 leading-relaxed">
            Se stai attraversando un momento di crisi, non sei solo/a.{" "}
            <span className="font-normal text-primary-600">
              Ci sono persone pronte ad ascoltarti adesso.
            </span>
          </p>

          {/* Helplines */}
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="tel:0223272327"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-100 hover:bg-primary-200 transition-colors px-3 py-2 text-sm text-primary-700 font-medium"
              aria-label="Chiama Telefono Amico al numero 02 2327 2327"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Telefono Amico</span>
              <span className="font-normal text-primary-600">02 2327 2327</span>
            </a>
            <a
              href="tel:19696"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-100 hover:bg-primary-200 transition-colors px-3 py-2 text-sm text-primary-700 font-medium"
              aria-label="Chiama Telefono Azzurro al numero 19696"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Telefono Azzurro</span>
              <span className="font-normal text-primary-600">19696</span>
            </a>
          </div>

          <p className="text-xs text-primary-500">
            Continuare il questionario ti aiuterà a trovare un professionista qualificato
            il prima possibile.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
