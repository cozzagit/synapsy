"use client";

import { motion } from "motion/react";

interface CompatibilityArcProps {
  score: number; // 0 to 1
  size?: number;
  showLabel?: boolean;
}

export function CompatibilityArc({
  score,
  size = 80,
  showLabel = true,
}: CompatibilityArcProps) {
  const percentage = Math.round(score * 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - score);

  // Color based on score
  const getColor = () => {
    if (score >= 0.8) return "var(--color-primary-500)";
    if (score >= 0.6) return "var(--color-secondary-500)";
    return "var(--color-accent-500)";
  };

  const getLabel = () => {
    if (score >= 0.85) return "Eccellente";
    if (score >= 0.7) return "Alta";
    if (score >= 0.55) return "Buona";
    return "Discreta";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </svg>
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="font-heading text-lg font-bold text-text"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary">
          {getLabel()}
        </span>
      )}
    </div>
  );
}
