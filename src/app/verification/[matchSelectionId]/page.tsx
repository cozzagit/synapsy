"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Phone,
  Clock,
  Star,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RespondentType = "user" | "psychologist";

interface FormState {
  callHappened: boolean | null;
  estimatedDurationMinutes: number;
  willContinue: boolean | null;
  satisfactionRating: number | null;
  notes: string;
}

// ─── Star Rating Component ─────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered ?? value ?? 0) >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="transition-transform duration-100 hover:scale-110 focus:outline-none"
            aria-label={`${star} stelle`}
          >
            <Star
              size={32}
              className={
                filled
                  ? "text-accent-500 fill-accent-500"
                  : "text-border fill-transparent"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Yes/No Button Pair ───────────────────────────────────────────────────────

function YesNoButtons({
  value,
  onChange,
  yesLabel = "Sì",
  noLabel = "No",
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="flex gap-3">
      {[true, false].map((option) => {
        const label = option ? yesLabel : noLabel;
        const selected = value === option;
        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "flex-1 py-3 px-6 rounded-xl font-body font-semibold text-sm transition-all duration-200 border",
              selected
                ? "bg-primary-600 text-white border-primary-600 shadow-md scale-[1.02]"
                : "bg-surface text-text-secondary border-border hover:border-primary-300 hover:text-primary-600",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Duration Slider ──────────────────────────────────────────────────────────

function DurationSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - 5) / (60 - 5)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-body text-text-secondary">5 min</span>
        <span className="text-lg font-heading font-bold text-primary-700">
          {value} minuti
        </span>
        <span className="text-sm font-body text-text-secondary">60 min</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-primary-500) 0%, var(--color-primary-500) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ respondentType }: { respondentType: RespondentType }) {
  const isPsychologist = respondentType === "psychologist";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center text-center gap-6 py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center"
      >
        <CheckCircle size={40} className="text-primary-600" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-text">
          Grazie per il feedback!
        </h2>
        <p className="text-text-secondary font-body max-w-sm">
          {isPsychologist
            ? "Il tuo riscontro è prezioso per mantenere alta la qualità del servizio. Lo elaboreremo a breve."
            : "La tua risposta ci aiuta a garantire un'esperienza eccellente. Stiamo elaborando il feedback."}
        </p>
      </div>
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 max-w-sm w-full text-left space-y-2">
        <p className="text-sm font-body font-semibold text-primary-700">
          Cosa succede ora?
        </p>
        <p className="text-sm font-body text-primary-600">
          {isPsychologist
            ? "Quando anche il paziente avrà risposto, analizzeremo entrambi i feedback e aggiorneremo il vostro stato."
            : "Quando anche lo psicologo avrà risposto, riceverai un aggiornamento sul vostro percorso."}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VerificationPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const matchSelectionId = params.matchSelectionId as string;
  // Allow respondentType and respondentId to be passed via query params
  // In production these would come from the auth session
  const respondentType: RespondentType =
    (searchParams.get("type") as RespondentType) ?? "user";
  const respondentId =
    searchParams.get("respondentId") ?? "00000000-0000-0000-0000-000000000000";

  const isPsychologist = respondentType === "psychologist";

  const [form, setForm] = useState<FormState>({
    callHappened: null,
    estimatedDurationMinutes: 30,
    willContinue: null,
    satisfactionRating: null,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    form.callHappened !== null &&
    form.willContinue !== null &&
    (!isPsychologist ? true : true); // both types require same minimum

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        matchSelectionId,
        respondentType,
        respondentId,
        callHappened: form.callHappened,
        estimatedDurationMinutes: form.callHappened
          ? form.estimatedDurationMinutes
          : null,
        willContinue: form.willContinue,
        satisfactionRating:
          !isPsychologist ? form.satisfactionRating : null,
        notes: form.notes.trim() || null,
      };

      const res = await fetch("/api/verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error?.message ?? "Errore durante l'invio. Riprova."
        );
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Errore imprevisto. Riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-body font-semibold px-3 py-1.5 rounded-full mb-4">
            <Phone size={13} />
            Verifica post-call
          </div>
          <h1 className="text-2xl font-heading font-bold text-text">
            {isPsychologist
              ? "Com'è andata la call?"
              : "Raccontaci com'è andata"}
          </h1>
          <p className="text-text-secondary font-body mt-2 text-sm leading-relaxed">
            {isPsychologist
              ? "Il tuo feedback è fondamentale per garantire la qualità del servizio e proteggere entrambe le parti."
              : "Prenditi un momento per condividere la tua esperienza. Le tue risposte ci aiutano a migliorare."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
              <SuccessScreen respondentType={respondentType} />
            </div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="divide-y divide-border">
                {/* Question 1: Did the call happen? */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-heading font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <p className="font-body font-semibold text-text">
                      La call è avvenuta?
                    </p>
                  </div>
                  <YesNoButtons
                    value={form.callHappened}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, callHappened: v }))
                    }
                  />
                </div>

                {/* Question 2: Duration (only if call happened) */}
                <AnimatePresence>
                  {form.callHappened === true && (
                    <motion.div
                      key="duration"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-secondary-100 text-secondary-700 text-xs font-heading font-bold flex items-center justify-center shrink-0">
                            <Clock size={13} />
                          </span>
                          <p className="font-body font-semibold text-text">
                            Quanto è durata la call?
                          </p>
                        </div>
                        <DurationSlider
                          value={form.estimatedDurationMinutes}
                          onChange={(v) =>
                            setForm((f) => ({
                              ...f,
                              estimatedDurationMinutes: v,
                            }))
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Question 3: Will continue */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-heading font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <p className="font-body font-semibold text-text">
                      {isPsychologist
                        ? "Continuerai con questo paziente?"
                        : "Continuerai con questo professionista?"}
                    </p>
                  </div>
                  <YesNoButtons
                    value={form.willContinue}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, willContinue: v }))
                    }
                    yesLabel="Sì, continuo"
                    noLabel="No, mi fermo"
                  />
                </div>

                {/* Question 4: Satisfaction (users only) */}
                {!isPsychologist && (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-accent-100 text-accent-700 text-xs font-heading font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <p className="font-body font-semibold text-text">
                        Come valuti l'esperienza?{" "}
                        <span className="text-text-secondary font-normal">
                          (opzionale)
                        </span>
                      </p>
                    </div>
                    <StarRating
                      value={form.satisfactionRating}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, satisfactionRating: v }))
                      }
                    />
                    {form.satisfactionRating !== null && (
                      <p className="text-xs font-body text-text-secondary">
                        {
                          [
                            "",
                            "Molto insoddisfatto",
                            "Insoddisfatto",
                            "Neutro",
                            "Soddisfatto",
                            "Molto soddisfatto",
                          ][form.satisfactionRating]
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* Question 5: Notes */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-bg-subtle text-text-secondary flex items-center justify-center shrink-0">
                      <MessageSquare size={13} />
                    </span>
                    <p className="font-body font-semibold text-text">
                      Note aggiuntive{" "}
                      <span className="text-text-secondary font-normal">
                        (opzionale)
                      </span>
                    </p>
                  </div>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder={
                      isPsychologist
                        ? "Condividi eventuali osservazioni sul colloquio..."
                        : "Hai qualcosa da aggiungere sulla tua esperienza?"
                    }
                    rows={3}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm font-body text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-200"
                  />
                  {form.notes.length > 800 && (
                    <p className="text-xs text-text-secondary text-right">
                      {form.notes.length}/1000
                    </p>
                  )}
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mb-4 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3"
                  >
                    <p className="text-sm font-body text-accent-700">
                      {submitError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="p-6 pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={[
                    "w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-body font-semibold text-sm transition-all duration-200",
                    canSubmit && !isSubmitting
                      ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md"
                      : "bg-bg-subtle text-text-secondary cursor-not-allowed",
                  ].join(" ")}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: "linear",
                        }}
                        className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                      />
                      Invio in corso...
                    </span>
                  ) : (
                    <>
                      Invia il feedback
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>

                {!canSubmit && (
                  <p className="text-xs text-text-secondary text-center mt-3 font-body">
                    Rispondi alle domande obbligatorie per continuare
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs font-body text-text-secondary mt-6 leading-relaxed"
        >
          Le tue risposte sono riservate e vengono usate esclusivamente per
          garantire la qualità del servizio.
        </motion.p>
      </div>
    </div>
  );
}
