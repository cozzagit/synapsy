"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Video,
  MapPin,
  Monitor,
  Handshake,
  Leaf,
  Star,
} from "lucide-react";
import { CompatibilityArc } from "./compatibility-arc";
import { ScoreBreakdownView } from "./score-breakdown";
import type { ScoreBreakdown } from "@/lib/matching";

interface PsychologistCardProps {
  name: string;
  shortBio: string;
  treatedAreas: string[];
  therapeuticApproaches: string[];
  modality: string;
  score: number;
  breakdown: ScoreBreakdown;
  continuityRate: number;
  growthStage: string;
  isReferral: boolean;
  explanations: string[];
  onSelect: () => void;
  index: number;
}

const areaLabels: Record<string, string> = {
  anxiety: "Ansia",
  depression: "Depressione",
  stress: "Stress",
  burnout: "Burnout",
  relationship: "Relazioni",
  family: "Famiglia",
  grief: "Lutto",
  trauma: "Trauma",
  self_esteem: "Autostima",
  eating_disorders: "Disturbi alimentari",
  addiction: "Dipendenze",
  sleep: "Sonno",
  anger: "Rabbia",
  phobias: "Fobie",
  ocd: "DOC",
  sexuality: "Sessualit\u00e0",
  identity: "Identit\u00e0",
  work_issues: "Lavoro",
  academic_issues: "Studio",
  parenting: "Genitorialit\u00e0",
  social_anxiety: "Ansia sociale",
  panic_attacks: "Attacchi di panico",
  life_transitions: "Transizioni",
  chronic_illness: "Malattia cronica",
};

const approachLabels: Record<string, string> = {
  cbt: "Cognitivo-Comportamentale",
  psychodynamic: "Psicodinamico",
  systemic: "Sistemico",
  humanistic: "Umanistico",
  gestalt: "Gestalt",
  emdr: "EMDR",
  act: "ACT",
  dbt: "DBT",
  mindfulness: "Mindfulness",
  psychoanalytic: "Psicoanalitico",
  integrative: "Integrativo",
  solution_focused: "Breve strategico",
  narrative: "Narrativo",
  art_therapy: "Arteterapia",
};

const modalityIcons: Record<string, typeof Monitor> = {
  online: Monitor,
  in_person: MapPin,
  both: Video,
};

const stageIcons: Record<string, typeof Leaf> = {
  seed: Leaf,
  germoglio: Leaf,
  crescita: Star,
  fioritura: Star,
  radici: Award,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PsychologistCard({
  name,
  shortBio,
  treatedAreas,
  therapeuticApproaches,
  modality,
  score,
  breakdown,
  continuityRate,
  growthStage,
  isReferral,
  explanations,
  onSelect,
  index,
}: PsychologistCardProps) {
  const [expanded, setExpanded] = useState(false);

  const ModalityIcon = modalityIcons[modality] ?? Monitor;
  const StageIcon = stageIcons[growthStage] ?? Leaf;
  const modalityLabel =
    modality === "online"
      ? "Online"
      : modality === "in_person"
        ? "In studio"
        : "Online e in studio";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`group relative overflow-hidden rounded-2xl bg-surface shadow-sm transition-all hover:shadow-md ${
        isReferral ? "ring-2 ring-accent-300" : ""
      }`}
    >
      {/* Referral badge */}
      {isReferral && (
        <div className="flex items-center gap-1.5 bg-accent-50 px-4 py-2 text-xs font-medium text-accent-700">
          <Handshake className="h-3.5 w-3.5" />
          Ti ha indirizzato qui
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 text-lg font-bold text-white shadow-sm">
            {getInitials(name)}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-text">
              {name}
            </h3>
            {shortBio && (
              <p className="mt-0.5 text-sm text-text-secondary line-clamp-2">
                {shortBio}
              </p>
            )}
          </div>

          {/* Score */}
          <CompatibilityArc score={score} size={72} />
        </div>

        {/* Badges row */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            <ModalityIcon className="h-3 w-3" />
            {modalityLabel}
          </span>
          {continuityRate > 0.7 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              <Award className="h-3 w-3" />
              Alta continuit&agrave;
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-700">
            <StageIcon className="h-3 w-3" />
            {growthStage.charAt(0).toUpperCase() + growthStage.slice(1)}
          </span>
          {continuityRate > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bg-subtle px-3 py-1 text-xs font-medium text-text-secondary">
              <Clock className="h-3 w-3" />
              {Math.round(continuityRate * 100)}% continuit&agrave;
            </span>
          )}
        </div>

        {/* Relevant specializations */}
        {treatedAreas.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium text-text-tertiary">
              Specializzazioni rilevanti per te
            </p>
            <div className="flex flex-wrap gap-1.5">
              {treatedAreas.slice(0, 4).map((area) => (
                <span
                  key={area}
                  className="rounded-lg bg-bg-subtle px-2.5 py-1 text-xs text-text-secondary"
                >
                  {areaLabels[area] ?? area}
                </span>
              ))}
              {treatedAreas.length > 4 && (
                <span className="rounded-lg bg-bg-subtle px-2.5 py-1 text-xs text-text-tertiary">
                  +{treatedAreas.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Explanations */}
        {explanations.length > 0 && (
          <div className="mt-3 space-y-1">
            {explanations.slice(0, 2).map((exp) => (
              <p key={exp} className="text-xs text-primary-600">
                &#x2713; {exp}
              </p>
            ))}
          </div>
        )}

        {/* Expand/collapse for details */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-primary-600"
        >
          {expanded ? "Meno dettagli" : "Pi\u00f9 dettagli"}
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                {/* Approaches */}
                {therapeuticApproaches.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-text-tertiary">
                      Approcci terapeutici
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {therapeuticApproaches.map((approach) => (
                        <span
                          key={approach}
                          className="rounded-lg bg-secondary-50 px-2.5 py-1 text-xs text-secondary-700"
                        >
                          {approachLabels[approach] ?? approach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Score breakdown */}
                <ScoreBreakdownView breakdown={breakdown} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <button
          type="button"
          onClick={onSelect}
          className="mt-5 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-[0.98]"
        >
          Scegli questo professionista
        </button>
      </div>
    </motion.div>
  );
}
