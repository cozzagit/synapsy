"use client";

import { motion } from "motion/react";
import { Check, Clock, UserCheck, PhoneCall, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseStatus =
  | "pending"
  | "matching"
  | "matched"
  | "in_call"
  | "completed"
  | "expired"
  | "cancelled";

export interface CaseStatusStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  statuses: CaseStatus[];
}

interface UserCaseStatusProps {
  currentStatus: CaseStatus;
  className?: string;
}

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS: CaseStatusStep[] = [
  {
    id: "questionnaire",
    label: "Questionario",
    description: "Hai descritto le tue esigenze",
    icon: <Sparkles size={14} />,
    statuses: ["pending", "matching", "matched", "in_call", "completed"],
  },
  {
    id: "matching",
    label: "Matching",
    description: "Stiamo trovando il professionista giusto",
    icon: <Clock size={14} />,
    statuses: ["matching", "matched", "in_call", "completed"],
  },
  {
    id: "matched",
    label: "Abbinato",
    description: "Hai selezionato uno psicologo",
    icon: <UserCheck size={14} />,
    statuses: ["matched", "in_call", "completed"],
  },
  {
    id: "in_call",
    label: "Call",
    description: "Call conoscitiva in programma",
    icon: <PhoneCall size={14} />,
    statuses: ["in_call", "completed"],
  },
  {
    id: "completed",
    label: "Completato",
    description: "Percorso avviato",
    icon: <Check size={14} />,
    statuses: ["completed"],
  },
];

// ─── Step state derivation ────────────────────────────────────────────────────

type StepState = "done" | "active" | "upcoming";

function getStepState(step: CaseStatusStep, currentStatus: CaseStatus): StepState {
  if (step.statuses.includes(currentStatus)) {
    const stepIndex = STEPS.findIndex((s) => s.id === step.id);
    const activeStepIndex = STEPS.findIndex((s) => {
      // The active step is the last step whose statuses include currentStatus
      const nextStep = STEPS[STEPS.indexOf(s) + 1];
      return (
        s.statuses.includes(currentStatus) &&
        (!nextStep || !nextStep.statuses.includes(currentStatus))
      );
    });
    if (stepIndex < activeStepIndex) return "done";
    if (stepIndex === activeStepIndex) return "active";
  }
  return "upcoming";
}

// ─── Connector line ───────────────────────────────────────────────────────────

function StepConnector({ done }: { done: boolean }) {
  return (
    <div className="flex-1 h-0.5 mx-1 relative overflow-hidden rounded-full bg-border">
      {done && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 bg-primary-500 origin-left rounded-full"
        />
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserCaseStatus({ currentStatus, className = "" }: UserCaseStatusProps) {
  const isTerminal = currentStatus === "expired" || currentStatus === "cancelled";

  if (isTerminal) {
    return (
      <div className={`bg-surface rounded-2xl border border-border p-5 ${className}`}>
        <p className="text-sm font-body text-text-secondary text-center py-2">
          {currentStatus === "expired"
            ? "Il caso è scaduto senza essere completato."
            : "Il caso è stato annullato."}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-2xl border border-border p-5 space-y-5 ${className}`}>
      <h3 className="text-sm font-body font-semibold text-text-secondary uppercase tracking-wide">
        Il tuo percorso
      </h3>

      {/* Step row */}
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const state = getStepState(step, currentStatus);
          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              {/* Step bubble */}
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  initial={false}
                  animate={
                    state === "active"
                      ? { scale: [1, 1.08, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    state === "active"
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative",
                    state === "done"
                      ? "bg-primary-500 text-white"
                      : state === "active"
                      ? "bg-primary-100 text-primary-700 ring-2 ring-primary-400 ring-offset-1"
                      : "bg-bg-subtle text-text-secondary",
                  ].join(" ")}
                >
                  {state === "active" && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-primary-400 opacity-30"
                      animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {step.icon}
                </motion.div>

                {/* Label */}
                <span
                  className={[
                    "text-xs font-body mt-1.5 whitespace-nowrap",
                    state === "done"
                      ? "text-primary-600 font-semibold"
                      : state === "active"
                      ? "text-text font-semibold"
                      : "text-text-secondary",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 flex items-center h-8 -mt-5 px-1">
                  <StepConnector done={state === "done"} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step description */}
      {STEPS.map((step) => {
        const state = getStepState(step, currentStatus);
        if (state !== "active") return null;
        return (
          <motion.p
            key={step.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-body text-text-secondary bg-primary-50 border border-primary-100 rounded-xl px-4 py-2.5 text-center"
          >
            {step.description}
          </motion.p>
        );
      })}
    </div>
  );
}
