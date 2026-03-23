"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export type StatCardVariant = "primary" | "secondary" | "accent" | "neutral";
export type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: StatCardTrend;
  trendLabel?: string;
  icon: React.ReactNode;
  variant?: StatCardVariant;
  suffix?: string;
  prefix?: string;
  /** Optional mini visualization rendered below the value */
  extra?: React.ReactNode;
}

const variantStyles: Record<StatCardVariant, { icon: string; badge: string }> = {
  primary: {
    icon: "bg-primary-100 text-primary-600",
    badge: "bg-primary-50 text-primary-700",
  },
  secondary: {
    icon: "bg-secondary-100 text-secondary-600",
    badge: "bg-secondary-50 text-secondary-700",
  },
  accent: {
    icon: "bg-accent-100 text-accent-600",
    badge: "bg-accent-50 text-accent-700",
  },
  neutral: {
    icon: "bg-bg-subtle text-text-secondary",
    badge: "bg-bg-subtle text-text-secondary",
  },
};

const trendConfig: Record<StatCardTrend, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  up: { icon: TrendingUp, color: "text-primary-600" },
  down: { icon: TrendingDown, color: "text-error" },
  neutral: { icon: Minus, color: "text-text-tertiary" },
};

export function StatCard({
  label,
  value,
  trend = "neutral",
  trendLabel,
  icon,
  variant = "primary",
  suffix,
  prefix,
  extra,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const TrendIcon = trendConfig[trend].icon;
  const trendColor = trendConfig[trend].color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-surface rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between">
        <p className="text-sm font-body text-text-secondary leading-snug">{label}</p>
        <span className={cn("p-2 rounded-xl shrink-0", styles.icon)}>{icon}</span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1">
        {prefix && <span className="text-sm font-body text-text-secondary mb-0.5">{prefix}</span>}
        <span className="text-3xl font-heading font-bold text-text tracking-tight leading-none">
          {value}
        </span>
        {suffix && <span className="text-sm font-body text-text-secondary mb-0.5">{suffix}</span>}
      </div>

      {/* Extra slot */}
      {extra && <div>{extra}</div>}

      {/* Trend */}
      {trendLabel && (
        <div className={cn("flex items-center gap-1.5 text-xs font-body font-medium", trendColor)}>
          <TrendIcon size={13} />
          <span>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
}
