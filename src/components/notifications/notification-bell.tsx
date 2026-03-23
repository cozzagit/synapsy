"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bell,
  Briefcase,
  CheckCircle,
  Clock,
  CreditCard,
  Star,
  Award,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Info,
  X,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ─────────────────────────────────────────────────────────────────

type NotificationType =
  | "new_case"
  | "candidacy_accepted"
  | "match_found"
  | "call_reminder"
  | "post_call_questionnaire"
  | "payment_due"
  | "payment_received"
  | "credit_earned"
  | "badge_awarded"
  | "penalty_applied"
  | "ranking_updated"
  | "welcome"
  | "system";

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── Icon map ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; color: string }
> = {
  new_case: {
    icon: <Briefcase className="h-4 w-4" />,
    bg: "bg-secondary-100",
    color: "text-secondary-600",
  },
  candidacy_accepted: {
    icon: <CheckCircle className="h-4 w-4" />,
    bg: "bg-primary-100",
    color: "text-primary-600",
  },
  match_found: {
    icon: <Sparkles className="h-4 w-4" />,
    bg: "bg-primary-100",
    color: "text-primary-600",
  },
  call_reminder: {
    icon: <Clock className="h-4 w-4" />,
    bg: "bg-accent-100",
    color: "text-accent-600",
  },
  post_call_questionnaire: {
    icon: <CheckCheck className="h-4 w-4" />,
    bg: "bg-secondary-100",
    color: "text-secondary-600",
  },
  payment_due: {
    icon: <CreditCard className="h-4 w-4" />,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  payment_received: {
    icon: <CreditCard className="h-4 w-4" />,
    bg: "bg-primary-100",
    color: "text-primary-600",
  },
  credit_earned: {
    icon: <Star className="h-4 w-4" />,
    bg: "bg-primary-100",
    color: "text-primary-600",
  },
  badge_awarded: {
    icon: <Award className="h-4 w-4" />,
    bg: "bg-secondary-100",
    color: "text-secondary-600",
  },
  penalty_applied: {
    icon: <AlertTriangle className="h-4 w-4" />,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  ranking_updated: {
    icon: <TrendingUp className="h-4 w-4" />,
    bg: "bg-accent-100",
    color: "text-accent-600",
  },
  welcome: {
    icon: <Sparkles className="h-4 w-4" />,
    bg: "bg-primary-100",
    color: "text-primary-600",
  },
  system: {
    icon: <Info className="h-4 w-4" />,
    bg: "bg-border",
    color: "text-text-secondary",
  },
};

// ─── Time ago helper ────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 60) return "Ora";
  if (diffSeconds < 3600) {
    const m = Math.floor(diffSeconds / 60);
    return `${m} min fa`;
  }
  if (diffSeconds < 86400) {
    const h = Math.floor(diffSeconds / 3600);
    return `${h} ${h === 1 ? "ora" : "ore"} fa`;
  }
  const d = Math.floor(diffSeconds / 86400);
  if (d === 1) return "Ieri";
  if (d < 7) return `${d} giorni fa`;
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });
}

// ─── NotificationItem ──────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;

  function handleClick() {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-bg-subtle ${
        !notification.isRead ? "bg-primary-50" : ""
      }`}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug ${
            notification.isRead
              ? "text-text-secondary font-normal"
              : "text-text font-semibold"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-text-tertiary mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-error" />
      )}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch notifications ──────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
      setUnreadCount(json.meta?.unreadCount ?? 0);
    } catch {
      // Silently fail for background polling
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchNotifications().finally(() => setIsLoading(false));
  }, [fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(fetchNotifications, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNotifications]);

  // ── Close on outside click ───────────────────────────────────────────────

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // ── Mark one as read ─────────────────────────────────────────────────────

  async function handleMarkRead(notificationId: string) {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
    } catch {
      // Re-fetch on failure to sync state
      fetchNotifications();
    }
  }

  // ── Mark all as read ─────────────────────────────────────────────────────

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      fetchNotifications();
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text"
        aria-label={`Notifiche${unreadCount > 0 ? ` — ${unreadCount} non lette` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-0.5 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
            style={{ transformOrigin: "top right" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm font-semibold text-text">
                  Notifiche
                </h2>
                {unreadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[11px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Segna tutti come letti
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-subtle"
                  aria-label="Chiudi notifiche"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[420px] overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-xl bg-border" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-3/4 animate-pulse rounded bg-border" />
                        <div className="h-3 w-full animate-pulse rounded bg-border" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-border" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-subtle">
                    <Bell className="h-6 w-6 text-text-tertiary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">
                      Nessuna notifica
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Ti avviseremo quando ci sono aggiornamenti per te.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={handleMarkRead}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border px-4 py-3 text-center">
                <a
                  href="/notifiche"
                  className="text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
                >
                  Vedi tutte le notifiche
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
