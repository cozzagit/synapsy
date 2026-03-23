"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { questions, TOTAL_QUESTIONS, HIGH_INTENSITY_THRESHOLD } from "@/lib/questionnaire/questions";
import { QuestionCard, type QuestionAnswer } from "@/components/questionnaire/question-card";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { CrisisBanner } from "@/components/questionnaire/crisis-banner";
import type { QuestionnaireResponse, ProblemCategory, TherapyApproach } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Stage = "welcome" | "questions" | "submitting" | "done";

type Answers = Record<string, QuestionAnswer>;

// ---------------------------------------------------------------------------
// Page animation variants
// ---------------------------------------------------------------------------

const pageVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.97,
  }),
};

const pageTransition = {
  duration: 0.38,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

// ---------------------------------------------------------------------------
// Helper — check if an answer counts as "answered"
// ---------------------------------------------------------------------------

function isAnswered(answer: QuestionAnswer | undefined): boolean {
  if (answer === undefined || answer === null) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer.trim().length > 0;
}

// ---------------------------------------------------------------------------
// Welcome screen
// ---------------------------------------------------------------------------

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col items-center text-center py-8 sm:py-12 gap-8"
    >
      {/* Breathing animation circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer rings */}
        <motion.div
          className="absolute h-40 w-40 rounded-full"
          style={{ background: "var(--color-primary-100)", opacity: 0.5 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute h-28 w-28 rounded-full"
          style={{ background: "var(--color-primary-200)", opacity: 0.6 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          aria-hidden="true"
        />
        {/* Inner core */}
        <motion.div
          className="relative flex items-center justify-center h-16 w-16 rounded-full"
          style={{ background: "var(--color-primary-400)" }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          aria-hidden="true"
        >
          <Sparkles className="h-7 w-7 text-white" />
        </motion.div>
      </div>

      {/* Copy */}
      <div className="space-y-4 max-w-md">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
          Trova il professionista{" "}
          <span className="text-primary-500">giusto per te</span>
        </h1>
        <p className="font-body text-base text-text-secondary leading-relaxed">
          Rispondi a poche domande per aiutarci a capire le tue esigenze.{" "}
          <span className="text-text">Nessun dato personale richiesto.</span>
        </p>
        <p className="font-accent italic text-sm text-text-tertiary">
          Prenditi il tuo tempo. Non c&apos;è fretta.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-6 text-sm text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary-400" />
          <span>~{TOTAL_QUESTIONS} domande</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
          <span>~3 minuti</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-accent-400" />
          <span>Anonimo</span>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={onStart}
        className="mt-2 inline-flex items-center gap-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium px-8 py-4 text-base shadow-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        Inizia
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Submitting / searching screen
// ---------------------------------------------------------------------------

function SubmittingScreen() {
  return (
    <motion.div
      key="submitting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-16 gap-8"
    >
      {/* Pulsing search animation */}
      <div className="relative flex items-center justify-center h-28 w-28">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-primary-300"
            style={{
              width: `${(i + 1) * 40}px`,
              height: `${(i + 1) * 40}px`,
              inset: 0,
              margin: "auto",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />
        ))}
        <div
          className="relative z-10 flex items-center justify-center h-14 w-14 rounded-full"
          style={{ background: "var(--color-primary-400)" }}
        >
          <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
      </div>

      <div className="space-y-3 max-w-xs">
        <h2 className="font-heading text-xl font-bold text-text">
          Ci siamo quasi…
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Stiamo cercando i professionisti più adatti a te in base alle tue risposte.
        </p>
        <p className="font-accent italic text-sm text-text-tertiary">
          Un momento, il tuo match è in preparazione.
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Questionnaire inner — handles question navigation
// ---------------------------------------------------------------------------

interface QuestionnaireInnerProps {
  referralId: string | null;
}

function QuestionnaireInner({ referralId }: QuestionnaireInnerProps) {
  const [stage, setStage] = useState<Stage>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [showCrisis, setShowCrisis] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canProceed = isAnswered(currentAnswer);
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  // Check if crisis banner should appear whenever intensity answer changes
  useEffect(() => {
    const intensityAnswer = answers["intensity"];
    if (typeof intensityAnswer === "string") {
      setShowCrisis(parseInt(intensityAnswer, 10) >= HIGH_INTENSITY_THRESHOLD);
    } else {
      setShowCrisis(false);
    }
  }, [answers]);

  const handleAnswer = useCallback(
    (answer: QuestionAnswer) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    },
    [currentQuestion]
  );

  function goNext() {
    if (!canProceed) return;
    if (isLastQuestion) {
      handleSubmit();
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => i + 1);
  }

  function goBack() {
    if (currentIndex === 0) {
      setStage("welcome");
      return;
    }
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }

  /**
   * Map the flat question-id → value answers to the QuestionnaireResponse
   * shape expected by /api/questionnaire/submit.
   */
  function buildApiPayload(raw: Answers): QuestionnaireResponse {
    // problem category mapping: our option values → ProblemCategory enum
    const problemMap: Record<string, ProblemCategory> = {
      ansia: "anxiety",
      depressione: "depression",
      stress: "stress",
      burnout: "burnout",
      relazionali: "relationship",
      famiglia: "family",
      lutto: "grief",
      trauma: "trauma",
      autostima: "self_esteem",
      alimentari: "eating_disorders",
      dipendenze: "addiction",
      sonno: "sleep",
      rabbia: "anger",
      fobie: "phobias",
      doc: "ocd",
      sessualita: "sexuality",
      identita: "identity",
      lavoro: "work_issues",
      scolastiche: "academic_issues",
      genitorialita: "parenting",
      ansia_sociale: "social_anxiety",
      panico: "panic_attacks",
      transizione: "life_transitions",
      malattia: "chronic_illness",
      altro: "other",
    };

    // approach mapping
    const approachMap: Record<string, TherapyApproach> = {
      cbt: "cbt",
      psicodinamico: "psychodynamic",
      sistemico: "systemic",
      umanistico: "humanistic",
      emdr: "emdr",
      mindfulness: "mindfulness",
    };

    const primaryProblems = (
      Array.isArray(raw.primary_problem) ? raw.primary_problem : []
    )
      .map((v) => problemMap[v])
      .filter((v): v is ProblemCategory => !!v);

    const rawApproaches = (
      Array.isArray(raw.approach) ? raw.approach : []
    ).filter((v) => v !== "nessuna");

    const preferredApproaches = rawApproaches
      .map((v) => approachMap[v])
      .filter((v): v is TherapyApproach => !!v);

    const intensityRaw = parseInt(
      typeof raw.intensity === "string" ? raw.intensity : "1",
      10
    );
    const intensity = (
      intensityRaw >= 1 && intensityRaw <= 5 ? intensityRaw : 1
    ) as 1 | 2 | 3 | 4 | 5;

    const modalityRaw = typeof raw.modality === "string" ? raw.modality : "nessuna";
    const preferredModality =
      modalityRaw === "online"
        ? "online"
        : modalityRaw === "studio"
        ? "in_person"
        : "both";

    const genderRaw = typeof raw.gender_preference === "string" ? raw.gender_preference : "nessuna";
    const preferredGender =
      genderRaw === "uomo"
        ? "male"
        : genderRaw === "donna"
        ? "female"
        : "no_preference";

    const urgencyRaw = typeof raw.urgency === "string" ? raw.urgency : "esplorando";
    const urgency =
      urgencyRaw === "immediato"
        ? "immediate"
        : urgencyRaw === "settimana"
        ? "this_week"
        : urgencyRaw === "mese"
        ? "this_month"
        : "exploring";

    const ageRaw = typeof raw.age_range === "string" ? raw.age_range : "";
    const ageRange =
      ageRaw === "18-25"
        ? "18_25"
        : ageRaw === "26-35"
        ? "26_35"
        : ageRaw === "36-45"
        ? "36_45"
        : ageRaw === "46-55"
        ? "46_55"
        : ageRaw === "56+"
        ? "56_plus"
        : "no_preference";

    const previousTherapy =
      typeof raw.previous_therapy === "string"
        ? raw.previous_therapy === "si"
        : false;

    return {
      primaryProblems,
      context: Array.isArray(raw.context) ? raw.context : [],
      intensity,
      preferredModality,
      preferredGender,
      preferredApproaches,
      urgency,
      ageRange,
      previousTherapy,
      additionalPreferences: {},
    };
  }

  async function handleSubmit() {
    setStage("submitting");
    let caseId: string | undefined;
    try {
      const payload = buildApiPayload(answers);
      const res = await fetch("/api/questionnaire/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: payload,
          referralId: referralId ?? undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        caseId = json?.data?.caseId;
      }
    } catch {
      // Silently continue — the matching page will handle errors
    }
    // Navigate to matching results after a brief animated delay
    setTimeout(() => {
      if (caseId) {
        window.location.href = `/matching/${caseId}`;
      } else {
        window.location.href = "/";
      }
    }, 2400);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* ── Welcome ── */}
      {stage === "welcome" && (
        <WelcomeScreen key="welcome" onStart={() => setStage("questions")} />
      )}

      {/* ── Questions ── */}
      {stage === "questions" && currentQuestion && (
        <motion.div
          key="questions-wrapper"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="py-4 sm:py-8 space-y-6"
        >
          {/* Progress */}
          <ProgressBar
            currentIndex={currentIndex}
            total={TOTAL_QUESTIONS}
            sectionName={currentQuestion.section}
          />

          {/* Crisis banner */}
          <AnimatePresence>
            {showCrisis && <CrisisBanner key="crisis" />}
          </AnimatePresence>

          {/* Question header */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`header-${currentQuestion.id}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="space-y-1.5"
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-text leading-tight tracking-tight">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-sm text-text-secondary">
                  {currentQuestion.subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Question body */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`body-${currentQuestion.id}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <QuestionCard
                question={currentQuestion}
                answer={currentAnswer ?? null}
                onAnswer={handleAnswer}
                direction={direction}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text hover:bg-bg-subtle transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Torna alla domanda precedente"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Indietro
            </button>

            <motion.button
              whileTap={canProceed ? { scale: 0.97 } : undefined}
              whileHover={canProceed ? { scale: 1.02 } : undefined}
              onClick={goNext}
              disabled={!canProceed}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                canProceed
                  ? "bg-primary-500 hover:bg-primary-600 text-white shadow-sm"
                  : "bg-border text-text-tertiary cursor-not-allowed",
              ].join(" ")}
              aria-disabled={!canProceed}
              aria-label={isLastQuestion ? "Trova il tuo match" : "Vai alla domanda successiva"}
            >
              {isLastQuestion ? (
                <>
                  Trova il tuo match
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </div>

          {/* Supportive microcopy */}
          <p className="text-center text-xs text-text-tertiary font-accent italic">
            {currentIndex < 3
              ? "Prenditi il tuo tempo. Non c'è fretta."
              : currentIndex < 6
              ? "Stai andando alla grande."
              : "Quasi fatto. Grazie per la tua fiducia."}
          </p>
        </motion.div>
      )}

      {/* ── Submitting ── */}
      {stage === "submitting" && <SubmittingScreen key="submitting" />}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Page — wraps inner in Suspense for useSearchParams
// ---------------------------------------------------------------------------

function QuestionnairePageContent() {
  const searchParams = useSearchParams();
  const referralId = searchParams.get("ref");
  return <QuestionnaireInner referralId={referralId} />;
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={null}>
      <QuestionnairePageContent />
    </Suspense>
  );
}
