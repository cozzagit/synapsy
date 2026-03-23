"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Wind,
  CloudRain,
  Zap,
  Battery,
  Users,
  Home,
  Heart,
  Shield,
  Star,
  Apple,
  Link,
  Moon,
  Flame,
  AlertTriangle,
  RefreshCw,
  Smile,
  Fingerprint,
  Briefcase,
  BookOpen,
  Baby,
  AlertCircle,
  Compass,
  Activity,
  MoreHorizontal,
  Monitor,
  MapPin,
  Shuffle,
  User,
  Brain,
  Layers,
  GitBranch,
  Sprout,
  Eye,
  Flower2,
  HelpCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Circle,
  Scale,
  TrendingDown,
  type LucideProps,
} from "lucide-react";
import type { Question, QuestionOption } from "@/lib/questionnaire/questions";

// ---------------------------------------------------------------------------
// Icon map — matches icon names stored in question options
// ---------------------------------------------------------------------------

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Wind,
  CloudRain,
  Zap,
  Battery,
  Users,
  Home,
  Heart,
  Shield,
  Star,
  Apple,
  Link,
  Moon,
  Flame,
  AlertTriangle,
  RefreshCw,
  Smile,
  Fingerprint,
  Briefcase,
  BookOpen,
  Baby,
  AlertCircle,
  Compass,
  Activity,
  MoreHorizontal,
  Monitor,
  MapPin,
  Shuffle,
  User,
  Brain,
  Layers,
  GitBranch,
  Sprout,
  Eye,
  Flower2,
  HelpCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Circle,
  Scale,
  TrendingDown,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComp = ICON_MAP[name];
  if (!IconComp) return null;
  return <IconComp className={className} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------

const cardVariants = {
  initial: { opacity: 0, x: 24, scale: 0.97 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.045,
      duration: 0.35,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, x: -20, scale: 0.97, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Single / Preference option card
// ---------------------------------------------------------------------------

interface OptionCardProps {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  showIcon?: boolean;
}

function OptionCard({ option, isSelected, onSelect, index, showIcon = false }: OptionCardProps) {
  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={[
        "relative w-full text-left rounded-2xl border p-4 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        isSelected
          ? "bg-primary-50 border-primary-400 shadow-sm"
          : "bg-surface border-border hover:border-primary-200 hover:bg-bg-subtle",
      ].join(" ")}
      role="radio"
      aria-checked={isSelected}
    >
      <div className="flex items-center gap-3">
        {/* Optional icon */}
        {showIcon && option.icon && (
          <div
            className={[
              "shrink-0 flex items-center justify-center h-9 w-9 rounded-xl",
              isSelected ? "bg-primary-100 text-primary-600" : "bg-bg-subtle text-text-tertiary",
            ].join(" ")}
          >
            <DynamicIcon name={option.icon} className="h-4 w-4" />
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className={[
              "text-sm font-medium leading-snug",
              isSelected ? "text-primary-700" : "text-text",
            ].join(" ")}
          >
            {option.label}
          </p>
          {option.description && (
            <p className="mt-0.5 text-xs text-text-tertiary leading-relaxed">
              {option.description}
            </p>
          )}
        </div>

        {/* Check indicator */}
        <div
          className={[
            "shrink-0 flex items-center justify-center h-5 w-5 rounded-full border transition-all duration-200",
            isSelected
              ? "bg-primary-500 border-primary-500"
              : "border-border-strong bg-transparent",
          ].join(" ")}
        >
          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Multiple selection option chip (compact, grid-friendly)
// ---------------------------------------------------------------------------

interface MultipleOptionCardProps {
  option: QuestionOption;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  index: number;
}

function MultipleOptionCard({
  option,
  isSelected,
  isDisabled,
  onToggle,
  index,
}: MultipleOptionCardProps) {
  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      className={[
        "relative w-full text-left rounded-2xl border p-3.5 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        isSelected
          ? "bg-primary-50 border-primary-400 shadow-sm scale-[1.02]"
          : isDisabled
          ? "bg-surface border-border opacity-40 cursor-not-allowed"
          : "bg-surface border-border hover:border-primary-200 hover:bg-bg-subtle",
      ].join(" ")}
      role="checkbox"
      aria-checked={isSelected}
    >
      <div className="flex items-center gap-2.5">
        {/* Optional icon */}
        {option.icon && (
          <div
            className={[
              "shrink-0 flex items-center justify-center h-7 w-7 rounded-lg",
              isSelected ? "bg-primary-100 text-primary-600" : "bg-bg-subtle text-text-tertiary",
            ].join(" ")}
          >
            <DynamicIcon name={option.icon} className="h-3.5 w-3.5" />
          </div>
        )}

        {/* Label */}
        <p
          className={[
            "flex-1 text-sm font-medium leading-snug",
            isSelected ? "text-primary-700" : "text-text",
          ].join(" ")}
        >
          {option.label}
        </p>

        {/* Checkbox indicator */}
        <div
          className={[
            "shrink-0 flex items-center justify-center h-5 w-5 rounded transition-all duration-200",
            isSelected
              ? "bg-primary-500 border border-primary-500"
              : "border border-border-strong bg-transparent",
          ].join(" ")}
          style={{ borderRadius: "6px" }}
        >
          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Scale (1-5) question
// ---------------------------------------------------------------------------

interface ScaleQuestionProps {
  options: QuestionOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

function ScaleQuestion({ options, selectedValue, onSelect }: ScaleQuestionProps) {
  return (
    <div className="space-y-3">
      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex items-stretch gap-2" role="radiogroup">
        {options.map((option, i) => {
          const isSelected = selectedValue === option.value;
          return (
            <motion.button
              key={option.value}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(option.value)}
              className={[
                "flex-1 flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary-50 border-primary-400 shadow-sm"
                  : "bg-surface border-border hover:border-primary-200 hover:bg-bg-subtle",
              ].join(" ")}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.value} — ${option.label}`}
            >
              {/* Number bubble */}
              <div
                className={[
                  "flex items-center justify-center h-10 w-10 rounded-full border-2 font-heading font-bold text-base transition-all duration-200",
                  isSelected
                    ? "border-primary-400 bg-primary-500 text-white"
                    : "border-border bg-bg-subtle text-text-secondary",
                ].join(" ")}
              >
                {option.value}
              </div>
              {/* Label */}
              <span
                className={[
                  "text-xs font-medium text-center leading-tight",
                  isSelected ? "text-primary-700" : "text-text-secondary",
                ].join(" ")}
              >
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="flex sm:hidden flex-col gap-2" role="radiogroup">
        {options.map((option, i) => {
          const isSelected = selectedValue === option.value;
          return (
            <motion.button
              key={option.value}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.value)}
              className={[
                "w-full flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary-50 border-primary-400 shadow-sm"
                  : "bg-surface border-border hover:border-primary-200 hover:bg-bg-subtle",
              ].join(" ")}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.value} — ${option.label}`}
            >
              {/* Number bubble */}
              <div
                className={[
                  "shrink-0 flex items-center justify-center h-11 w-11 rounded-full border-2 font-heading font-bold text-lg transition-all duration-200",
                  isSelected
                    ? "border-primary-400 bg-primary-500 text-white"
                    : "border-border bg-bg-subtle text-text-secondary",
                ].join(" ")}
              >
                {option.value}
              </div>
              {/* Labels */}
              <div className="flex-1 text-left">
                <p
                  className={[
                    "text-sm font-medium",
                    isSelected ? "text-primary-700" : "text-text",
                  ].join(" ")}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="mt-0.5 text-xs text-text-tertiary leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
              {/* Radio indicator */}
              <div
                className={[
                  "shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                  isSelected
                    ? "border-primary-500 bg-primary-500"
                    : "border-border-strong bg-transparent",
                ].join(" ")}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main QuestionCard component
// ---------------------------------------------------------------------------

export type QuestionAnswer = string | string[];

interface QuestionCardProps {
  question: Question;
  answer: QuestionAnswer | null;
  onAnswer: (answer: QuestionAnswer) => void;
  direction?: 1 | -1; // 1 = forward, -1 = backward
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const selectedValues: string[] = answer
    ? Array.isArray(answer)
      ? answer
      : [answer]
    : [];

  // Single selection handler
  function handleSingleSelect(value: string) {
    onAnswer(value);
  }

  // Multiple selection toggle
  function handleMultipleToggle(value: string) {
    const max = question.maxSelections ?? Infinity;
    if (selectedValues.includes(value)) {
      onAnswer(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < max) {
      onAnswer([...selectedValues, value]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Adaptive hint */}
      {question.adaptiveHint && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-text-tertiary font-accent italic"
        >
          {question.adaptiveHint}
        </motion.p>
      )}

      {/* Single & Preference: vertical list */}
      {(question.type === "single" || question.type === "preference") && (
        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-label={question.title}
        >
          {question.options.map((option, i) => (
            <OptionCard
              key={option.value}
              option={option}
              isSelected={selectedValues.includes(option.value)}
              onSelect={() => handleSingleSelect(option.value)}
              index={i}
              showIcon={!!option.icon}
            />
          ))}
        </div>
      )}

      {/* Multiple: 2-column grid on desktop */}
      {question.type === "multiple" && (
        <>
          {question.maxSelections && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-text-tertiary"
            >
              {selectedValues.length} / {question.maxSelections} selezionat
              {selectedValues.length === 1 ? "o" : "i"}
            </motion.p>
          )}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            role="group"
            aria-label={question.title}
          >
            {question.options.map((option, i) => (
              <MultipleOptionCard
                key={option.value}
                option={option}
                isSelected={selectedValues.includes(option.value)}
                isDisabled={
                  !selectedValues.includes(option.value) &&
                  selectedValues.length >= (question.maxSelections ?? Infinity)
                }
                onToggle={() => handleMultipleToggle(option.value)}
                index={i}
              />
            ))}
          </div>
        </>
      )}

      {/* Scale */}
      {question.type === "scale" && (
        <ScaleQuestion
          options={question.options}
          selectedValue={selectedValues[0] ?? null}
          onSelect={(value) => onAnswer(value)}
        />
      )}
    </div>
  );
}
