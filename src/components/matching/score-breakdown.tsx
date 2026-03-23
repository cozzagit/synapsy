"use client";

import { motion } from "motion/react";
import type { ScoreBreakdown } from "@/lib/matching";

interface ScoreBreakdownViewProps {
  breakdown: ScoreBreakdown;
}

const dimensions = [
  { key: "problemAreaOverlap", label: "Specializzazione", color: "bg-primary-400" },
  { key: "approachCompatibility", label: "Approccio terapeutico", color: "bg-secondary-400" },
  { key: "availabilityAlignment", label: "Disponibilità", color: "bg-accent-400" },
  { key: "rankingBonus", label: "Reputazione", color: "bg-primary-300" },
  { key: "responseTimeBonus", label: "Reattività", color: "bg-secondary-300" },
] as const;

export function ScoreBreakdownView({ breakdown }: ScoreBreakdownViewProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-heading text-sm font-semibold text-text">
        Dettaglio compatibilità
      </h4>
      {dimensions.map((dim, index) => {
        const value = breakdown[dim.key as keyof ScoreBreakdown] as number;
        const percentage = Math.round(value * 100);

        return (
          <div key={dim.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{dim.label}</span>
              <span className="text-xs font-medium text-text">{percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-subtle">
              <motion.div
                className={`h-full rounded-full ${dim.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
