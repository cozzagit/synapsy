"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  currentIndex: number; // 0-based
  total: number;
  sectionName: string;
}

export function ProgressBar({ currentIndex, total, sectionName }: ProgressBarProps) {
  const percentage = Math.round(((currentIndex) / total) * 100);

  return (
    <div className="w-full space-y-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Domanda ${currentIndex + 1} di ${total}`}>
      {/* Section label */}
      <div className="flex items-center justify-between">
        <motion.span
          key={sectionName}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-xs font-medium text-text-tertiary uppercase tracking-widest"
        >
          {sectionName}
        </motion.span>
        <span className="text-xs text-text-tertiary">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Organic flowing progress track */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary-400) 0%, var(--color-primary-300) 60%, var(--color-secondary-300) 100%)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        />
        {/* Soft glow dot at the end */}
        {percentage > 0 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary-400 shadow-sm"
            style={{ boxShadow: "0 0 6px 2px var(--color-primary-300)" }}
            animate={{ left: `calc(${percentage}% - 6px)` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          />
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-text-tertiary">
        Domanda{" "}
        <span className="font-medium text-text-secondary">{currentIndex + 1}</span>{" "}
        di circa{" "}
        <span className="font-medium text-text-secondary">{total}</span>
      </p>
    </div>
  );
}
