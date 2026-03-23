"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";

export type CaseStatus = "pending" | "accepted" | "rejected" | "completed";
export type CaseModality = "online" | "presenziale" | "ibrido";

export interface CaseCardData {
  id: string;
  anonymousDescription: string;
  primaryProblem: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  modality: CaseModality;
  compatibilityScore: number; // 0-100
  postedAt: Date;
  keyAttributes: string[];
  status: CaseStatus;
}

interface CaseCardProps {
  case_: CaseCardData;
  onAccept?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
  showActions?: boolean;
}

const intensityLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Molto lieve", color: "text-primary-500" },
  2: { label: "Lieve", color: "text-primary-600" },
  3: { label: "Moderato", color: "text-warning" },
  4: { label: "Intenso", color: "text-accent-600" },
  5: { label: "Molto intenso", color: "text-error" },
};

const modalityConfig: Record<CaseModality, { label: string; bg: string; text: string }> = {
  online: { label: "Online", bg: "bg-secondary-100", text: "text-secondary-700" },
  presenziale: { label: "In presenza", bg: "bg-primary-100", text: "text-primary-700" },
  ibrido: { label: "Ibrido", bg: "bg-accent-100", text: "text-accent-700" },
};

const statusConfig: Record<CaseStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "In attesa", bg: "bg-bg-subtle", text: "text-text-secondary" },
  accepted: { label: "Accettato", bg: "bg-primary-50", text: "text-primary-700" },
  rejected: { label: "Rifiutato", bg: "bg-accent-50", text: "text-accent-700" },
  completed: { label: "Completato", bg: "bg-secondary-50", text: "text-secondary-700" },
};

function CompatibilityArc({ score }: { score: number }) {
  const radius = 20;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference * (1 - score / 100);
  const color =
    score >= 80 ? "#5B8A72" : score >= 60 ? "#D4956A" : "#C4645A";

  return (
    <div className="flex flex-col items-center">
      <svg width="56" height="32" viewBox="0 0 56 32">
        {/* Background arc */}
        <path
          d="M 6 28 A 22 22 0 0 1 50 28"
          fill="none"
          stroke="#E8E5DF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 6 28 A 22 22 0 0 1 50 28"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="text-xs font-heading font-bold text-text -mt-1">{score}%</span>
    </div>
  );
}

function IntensityDots({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  const cfg = intensityLabels[level];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i < level ? cn(cfg.color, "bg-current") : "bg-border"
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-body", cfg.color)}>{cfg.label}</span>
    </div>
  );
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}g fa`;
  if (hours > 0) return `${hours}h fa`;
  return `${minutes}m fa`;
}

export function CaseCard({ case_: c, onAccept, onReject, showActions = true }: CaseCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const modality = modalityConfig[c.modality];
  const status = statusConfig[c.status];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn("text-xs font-body font-medium px-2.5 py-0.5 rounded-full", modality.bg, modality.text)}>
                {modality.label}
              </span>
              {c.status !== "pending" && (
                <span className={cn("text-xs font-body font-medium px-2.5 py-0.5 rounded-full", status.bg, status.text)}>
                  {status.label}
                </span>
              )}
              <span className="text-xs font-body text-text-tertiary flex items-center gap-1">
                <Clock size={11} />
                {timeAgo(c.postedAt)}
              </span>
            </div>
            <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wide mb-1">
              {c.primaryProblem}
            </p>
            <p className="text-sm font-body text-text-secondary leading-relaxed line-clamp-3">
              {c.anonymousDescription}
            </p>
          </div>
          <CompatibilityArc score={c.compatibilityScore} />
        </div>

        {/* Attributes */}
        {c.keyAttributes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {c.keyAttributes.map((attr) => (
              <span
                key={attr}
                className="text-xs font-body text-text-tertiary bg-bg-subtle px-2 py-0.5 rounded-full border border-border"
              >
                {attr}
              </span>
            ))}
          </div>
        )}

        {/* Intensity */}
        <IntensityDots level={c.intensity} />

        {/* Actions */}
        {showActions && c.status === "pending" && (
          <div className="flex gap-2 pt-1 border-t border-border">
            <button
              onClick={() => onAccept?.(c.id)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-primary-500 text-white text-sm font-body font-medium hover:bg-primary-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              <CheckCircle size={15} />
              Candidati
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-border text-text-secondary text-sm font-body font-medium hover:bg-bg-subtle hover:text-text active:scale-[0.98] transition-all duration-150"
            >
              <XCircle size={15} />
              Rifiuta
            </button>
          </div>
        )}

        {/* Compatibility label */}
        <div className="flex items-center gap-1.5 text-xs font-body text-text-tertiary">
          <Zap size={11} className="text-accent-400" />
          Compatibilità calcolata su approcci, specializzazioni e disponibilità
        </div>
      </motion.div>

      {/* Reject modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl p-6 shadow-lg border border-border w-full max-w-md"
            >
              <h3 className="text-base font-heading font-semibold text-text mb-1">
                Rifiuta caso
              </h3>
              <p className="text-sm font-body text-text-secondary mb-4">
                Vuoi indicare un motivo? (opzionale)
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Es. Non è nella mia area di specializzazione..."
                rows={3}
                className="w-full rounded-xl border border-border bg-bg-subtle px-3 py-2 text-sm font-body text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 h-10 rounded-xl border border-border text-sm font-body font-medium text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    onReject?.(c.id, rejectReason || undefined);
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="flex-1 h-10 rounded-xl bg-accent-500 text-white text-sm font-body font-medium hover:bg-accent-600 transition-colors"
                >
                  Conferma rifiuto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
