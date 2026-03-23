"use client";

import { motion } from "motion/react";
import {
  UserCheck,
  CreditCard,
  Award,
  MessageSquare,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ActivityEventType =
  | "new_match"
  | "payment"
  | "badge_earned"
  | "session_completed"
  | "rating_received"
  | "call_scheduled"
  | "case_accepted";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  timestamp: Date;
  meta?: Record<string, string | number>;
}

const eventConfig: Record<
  ActivityEventType,
  { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; text: string }
> = {
  new_match: { icon: UserCheck, bg: "bg-primary-100", text: "text-primary-600" },
  payment: { icon: CreditCard, bg: "bg-secondary-100", text: "text-secondary-600" },
  badge_earned: { icon: Award, bg: "bg-accent-100", text: "text-accent-600" },
  session_completed: { icon: MessageSquare, bg: "bg-primary-50", text: "text-primary-500" },
  rating_received: { icon: Star, bg: "bg-accent-50", text: "text-accent-500" },
  call_scheduled: { icon: Calendar, bg: "bg-secondary-50", text: "text-secondary-500" },
  case_accepted: { icon: ArrowRight, bg: "bg-primary-100", text: "text-primary-600" },
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 6) {
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  }
  if (days > 0) return `${days} giorn${days === 1 ? "o" : "i"} fa`;
  if (hours > 0) return `${hours} or${hours === 1 ? "a" : "e"} fa`;
  if (minutes > 1) return `${minutes} minuti fa`;
  return "Adesso";
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function ActivityTimeline({
  events,
  maxItems = 8,
  showViewAll = false,
  onViewAll,
}: ActivityTimelineProps) {
  const displayedEvents = events.slice(0, maxItems);

  if (displayedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center mb-3">
          <MessageSquare size={22} className="text-text-tertiary" />
        </div>
        <p className="text-sm font-body text-text-secondary">Nessuna attività recente</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-px bg-border" aria-hidden="true" />

      <div className="flex flex-col gap-1">
        {displayedEvents.map((event, index) => {
          const cfg = eventConfig[event.type];
          const Icon = cfg.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex gap-4 py-3"
            >
              {/* Icon */}
              <div className={cn("relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                <Icon size={15} className={cfg.text} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-body font-medium text-text leading-snug">
                  {event.title}
                </p>
                {event.description && (
                  <p className="text-xs font-body text-text-secondary mt-0.5 leading-snug">
                    {event.description}
                  </p>
                )}
                <p className="text-xs font-body text-text-tertiary mt-1">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showViewAll && events.length > maxItems && (
        <button
          onClick={onViewAll}
          className="mt-2 ml-12 text-xs font-body font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-2 transition-colors text-left"
        >
          Vedi tutta l&apos;attività ({events.length - maxItems} altri eventi) →
        </button>
      )}
    </div>
  );
}
