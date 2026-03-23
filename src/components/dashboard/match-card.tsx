"use client";

import { motion } from "motion/react";
import { Star, CheckCircle, Clock, PhoneCall, ArrowRight, XCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchStatus =
  | "selected"
  | "call_scheduled"
  | "call_completed"
  | "continued"
  | "not_continued"
  | "disputed";

export interface MatchedPsychologist {
  id: string;
  matchSelectionId: string;
  name: string;
  specializations: string[];
  approach: string;
  averageRating?: number;
  continuityRate?: number;
  modality: "online" | "in_person" | "both";
  callScheduledAt?: string | null;
  status: MatchStatus;
}

interface MatchCardProps {
  psychologist: MatchedPsychologist;
  onScheduleCall?: (matchSelectionId: string) => void;
  onOpenQuestionnaire?: (matchSelectionId: string) => void;
  animationDelay?: number;
}

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  MatchStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  selected: {
    label: "Abbinato",
    color: "bg-secondary-100 text-secondary-700 border-secondary-200",
    icon: <CheckCircle size={11} />,
  },
  call_scheduled: {
    label: "Call programmata",
    color: "bg-primary-100 text-primary-700 border-primary-200",
    icon: <Clock size={11} />,
  },
  call_completed: {
    label: "Call completata",
    color: "bg-primary-100 text-primary-700 border-primary-200",
    icon: <PhoneCall size={11} />,
  },
  continued: {
    label: "Percorso avviato",
    color: "bg-primary-100 text-primary-700 border-primary-200",
    icon: <CheckCircle size={11} />,
  },
  not_continued: {
    label: "Non continuato",
    color: "bg-bg-subtle text-text-secondary border-border",
    icon: <XCircle size={11} />,
  },
  disputed: {
    label: "In verifica",
    color: "bg-accent-100 text-accent-700 border-accent-200",
    icon: <Clock size={11} />,
  },
};

const MODALITY_LABELS: Record<MatchedPsychologist["modality"], string> = {
  online: "Online",
  in_person: "In presenza",
  both: "Online & In presenza",
};

// ─── Avatar placeholder ───────────────────────────────────────────────────────

function PsychologistAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-700 font-heading font-bold text-base flex items-center justify-center shrink-0 select-none">
      {initials}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MatchCard({
  psychologist,
  onScheduleCall,
  onOpenQuestionnaire,
  animationDelay = 0,
}: MatchCardProps) {
  const statusConfig = STATUS_CONFIG[psychologist.status];
  const isActive =
    psychologist.status === "selected" || psychologist.status === "call_scheduled";
  const needsQuestionnaire = psychologist.status === "call_completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={[
        "bg-surface rounded-2xl border shadow-sm transition-shadow duration-200",
        isActive ? "border-primary-200 hover:shadow-md" : "border-border",
      ].join(" ")}
    >
      <div className="p-5 space-y-4">
        {/* Top row: avatar + name + badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <PsychologistAvatar name={psychologist.name} />
            <div className="min-w-0">
              <p className="font-heading font-semibold text-text text-base leading-snug">
                {psychologist.name}
              </p>
              <p className="text-xs font-body text-text-secondary mt-0.5">
                {MODALITY_LABELS[psychologist.modality]}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={[
              "flex items-center gap-1 text-xs font-body font-semibold px-2.5 py-1 rounded-full border shrink-0",
              statusConfig.color,
            ].join(" ")}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        {/* Specializations */}
        {psychologist.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {psychologist.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="text-xs font-body text-secondary-700 bg-secondary-50 border border-secondary-100 px-2.5 py-0.5 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Approach + metrics row */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-text-secondary font-body text-xs truncate">
            {psychologist.approach}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {psychologist.averageRating !== undefined && (
              <span className="flex items-center gap-1 text-xs font-body text-text-secondary">
                <Star size={12} className="text-accent-500 fill-accent-500" />
                {psychologist.averageRating.toFixed(1)}
              </span>
            )}
            {psychologist.continuityRate !== undefined && (
              <span className="text-xs font-body text-text-secondary">
                {Math.round(psychologist.continuityRate * 100)}% continuità
              </span>
            )}
          </div>
        </div>

        {/* Call scheduled info */}
        {psychologist.status === "call_scheduled" &&
          psychologist.callScheduledAt && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Clock size={13} className="text-primary-600 shrink-0" />
              <p className="text-xs font-body text-primary-700">
                Call programmata per{" "}
                <span className="font-semibold">
                  {new Date(psychologist.callScheduledAt).toLocaleDateString(
                    "it-IT",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </p>
            </div>
          )}

        {/* CTAs */}
        {psychologist.status === "selected" && onScheduleCall && (
          <button
            onClick={() => onScheduleCall(psychologist.matchSelectionId)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-600 text-white text-sm font-body font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-sm"
          >
            Programma la call
            <ArrowRight size={14} />
          </button>
        )}

        {needsQuestionnaire && onOpenQuestionnaire && (
          <button
            onClick={() => onOpenQuestionnaire(psychologist.matchSelectionId)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary-600 text-white text-sm font-body font-semibold hover:bg-secondary-700 transition-colors duration-200 shadow-sm"
          >
            Compila il feedback post-call
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
