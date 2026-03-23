"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Clock,
  ChevronRight,
  History,
  Users,
  CheckCircle2,
  PhoneCall,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { UserCaseStatus, type CaseStatus } from "@/components/dashboard/user-case-status";
import { MatchCard, type MatchedPsychologist } from "@/components/dashboard/match-card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurrentCase {
  id: string;
  status: CaseStatus;
  primaryProblem: string;
  createdAt: string;
  matchedPsychologist?: MatchedPsychologist;
}

interface HistoryEntry {
  id: string;
  primaryProblem: string;
  status: "completed" | "expired" | "cancelled";
  createdAt: string;
  outcome?: string;
}

interface DashboardData {
  currentCase: CurrentCase | null;
  matches: MatchedPsychologist[];
  history?: HistoryEntry[];
  userName?: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-bg-subtle rounded-xl ${className ?? ""}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-7 w-40" />
      </div>
      {/* Status strip */}
      <SkeletonBlock className="h-14 w-full rounded-2xl" />
      {/* Tabs */}
      <SkeletonBlock className="h-11 w-full rounded-xl" />
      {/* Card */}
      <SkeletonBlock className="h-48 w-full rounded-2xl" />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div>
        <h2 className="font-heading font-semibold text-text text-base">{title}</h2>
        {subtitle && (
          <p className="text-xs font-body text-text-secondary">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ─── Empty case CTA ───────────────────────────────────────────────────────────

function NoCaseCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center space-y-5"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-secondary-100 flex items-center justify-center">
        <Sparkles size={28} className="text-secondary-600" />
      </div>
      <div className="space-y-2">
        <h3 className="font-heading font-bold text-text text-lg">
          Inizia il tuo percorso
        </h3>
        <p className="text-sm font-body text-text-secondary max-w-xs mx-auto leading-relaxed">
          Rispondi a poche domande e troveremo il professionista più adatto a te
          in pochi minuti.
        </p>
      </div>
      <Link
        href="/questionnaire"
        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-body font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Inizia il questionario
        <ChevronRight size={15} />
      </Link>
    </motion.div>
  );
}

// ─── Pending / Matching state ─────────────────────────────────────────────────

function WaitingState({ status }: { status: "pending" | "matching" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-primary-200 shadow-sm p-8 text-center space-y-5"
    >
      <div className="relative w-16 h-16 mx-auto">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary-200"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
          <Clock size={24} className="text-primary-600" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-heading font-bold text-text text-lg">
          {status === "pending"
            ? "Questionario ricevuto"
            : "Stiamo cercando il professionista giusto"}
        </h3>
        <p className="text-sm font-body text-text-secondary max-w-sm mx-auto leading-relaxed">
          {status === "pending"
            ? "Il tuo profilo è in elaborazione. Ti notificheremo non appena il matching sarà avviato."
            : "Stiamo analizzando le tue esigenze e confrontando i professionisti disponibili. Di solito ci vogliono pochi minuti."}
        </p>
      </div>
      {/* Animated dots */}
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Matched state card ───────────────────────────────────────────────────────

function MatchedStatusCard({
  caseData,
  onScheduleCall,
  onOpenQuestionnaire,
}: {
  caseData: CurrentCase;
  onScheduleCall: (matchSelectionId: string) => void;
  onOpenQuestionnaire: (matchSelectionId: string) => void;
}) {
  const psych = caseData.matchedPsychologist;

  if (!psych) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 text-center">
        <p className="text-sm font-body text-text-secondary">
          Nessun professionista abbinato al momento.
        </p>
      </div>
    );
  }

  const statusMessages: Partial<Record<typeof psych.status, { title: string; body: string; icon: React.ReactNode; color: string }>> = {
    selected: {
      title: "Professionista abbinato!",
      body: "Hai un match. Programma ora la call conoscitiva gratuita.",
      icon: <CheckCircle2 size={20} className="text-primary-600" />,
      color: "border-primary-200 bg-primary-50",
    },
    call_scheduled: {
      title: "Call in programma",
      body: "La tua call conoscitiva è confermata. Controlla il tuo calendario.",
      icon: <PhoneCall size={20} className="text-secondary-600" />,
      color: "border-secondary-200 bg-secondary-50",
    },
    call_completed: {
      title: "Call completata",
      body: "Come è andata? Condividi il tuo feedback per procedere.",
      icon: <AlertCircleIcon size={20} className="text-accent-600" />,
      color: "border-accent-200 bg-accent-50",
    },
    continued: {
      title: "Percorso avviato",
      body: "Fantastico! Hai iniziato il percorso con il tuo psicologo.",
      icon: <CheckCircle2 size={20} className="text-primary-600" />,
      color: "border-primary-200 bg-primary-50",
    },
  };

  const config = statusMessages[psych.status];

  return (
    <div className="space-y-4">
      {config && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={[
            "rounded-2xl border p-4 flex items-start gap-3",
            config.color,
          ].join(" ")}
        >
          <span className="shrink-0 mt-0.5">{config.icon}</span>
          <div>
            <p className="font-body font-semibold text-text text-sm">
              {config.title}
            </p>
            <p className="font-body text-text-secondary text-xs mt-0.5">
              {config.body}
            </p>
          </div>
        </motion.div>
      )}

      <MatchCard
        psychologist={psych}
        onScheduleCall={onScheduleCall}
        onOpenQuestionnaire={onOpenQuestionnaire}
      />
    </div>
  );
}

// ─── History section ──────────────────────────────────────────────────────────

function HistorySection({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm font-body text-text-secondary text-center py-6">
        Nessun caso precedente.
      </p>
    );
  }

  const statusLabels: Record<HistoryEntry["status"], string> = {
    completed: "Completato",
    expired: "Scaduto",
    cancelled: "Annullato",
  };

  const statusColors: Record<HistoryEntry["status"], string> = {
    completed: "bg-primary-100 text-primary-700 border-primary-200",
    expired: "bg-bg-subtle text-text-secondary border-border",
    cancelled: "bg-accent-100 text-accent-700 border-accent-200",
  };

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          className="bg-surface rounded-2xl border border-border p-4 flex items-start gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center shrink-0">
            <History size={14} className="text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body font-semibold text-text text-sm">
              {entry.primaryProblem}
            </p>
            {entry.outcome && (
              <p className="text-xs font-body text-text-secondary mt-0.5">
                {entry.outcome}
              </p>
            )}
            <p className="text-xs font-body text-text-secondary mt-1">
              {new Date(entry.createdAt).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <span
            className={[
              "text-xs font-body font-semibold px-2.5 py-1 rounded-full border shrink-0",
              statusColors[entry.status],
            ].join(" ")}
          >
            {statusLabels[entry.status]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

type ActiveTab = "current" | "matches" | "history";

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: "current", label: "Stato attuale", icon: <Sparkles size={14} /> },
  { id: "matches", label: "I miei match", icon: <Users size={14} /> },
  { id: "history", label: "Storico", icon: <History size={14} /> },
];

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("current");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleNotice, setScheduleNotice] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setError(null);
        const res = await fetch("/api/dashboard/user");
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const json = await res.json();
        setDashboardData(json);
      } catch {
        setError("Non è stato possibile caricare la dashboard. Riprova tra poco.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const currentCase = dashboardData?.currentCase ?? null;
  const matches = dashboardData?.matches ?? [];
  const history = dashboardData?.history ?? [];
  const userName = dashboardData?.userName ?? "";

  // TODO: replace with real scheduling flow when /scheduling is implemented
  function handleScheduleCall(_matchSelectionId: string) {
    setScheduleNotice(true);
  }

  function handleOpenQuestionnaire(matchSelectionId: string) {
    router.push(`/verification/${matchSelectionId}?type=user`);
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        {loading ? (
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-7 w-44" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <p className="text-sm font-body text-text-secondary">
              {userName ? "Bentornata," : "Bentornato,"}
            </p>
            <h1 className="text-2xl font-heading font-bold text-text">
              {userName || "il tuo percorso"}
            </h1>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 bg-accent-50 border border-accent-200 rounded-2xl p-5">
            <AlertCircleIcon size={18} className="text-accent-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-body font-semibold text-accent-800">Errore nel caricamento</p>
              <p className="text-sm font-body text-accent-700 mt-0.5">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-xs font-body font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
              >
                Ricarica la pagina
              </button>
            </div>
          </div>
        )}

        {/* Schedule notice banner */}
        {scheduleNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-2xl p-5"
          >
            <PhoneCall size={18} className="text-primary-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-body font-semibold text-primary-800">
                Funzione in arrivo
              </p>
              <p className="text-sm font-body text-primary-700 mt-0.5">
                La programmazione della call sarà disponibile a breve.
              </p>
            </div>
            <button
              onClick={() => setScheduleNotice(false)}
              className="text-primary-400 hover:text-primary-600 transition-colors"
              aria-label="Chiudi"
            >
              <AlertCircleIcon size={16} />
            </button>
          </motion.div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : !error && (
          <>
            {/* Case status strip */}
            {currentCase && (
              <UserCaseStatus currentStatus={currentCase.status} />
            )}

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex gap-1 bg-bg-subtle p-1 rounded-xl border border-border"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-body font-semibold transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-surface text-text shadow-sm border border-border"
                      : "text-text-secondary hover:text-text",
                  ].join(" ")}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "current" && (
                <motion.div
                  key="current"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <SectionHeader
                    icon={<Sparkles size={16} />}
                    title="Caso attuale"
                    subtitle={currentCase ? currentCase.primaryProblem : undefined}
                  />

                  {!currentCase ? (
                    <NoCaseCTA />
                  ) : currentCase.status === "pending" ||
                    currentCase.status === "matching" ? (
                    <WaitingState status={currentCase.status} />
                  ) : currentCase.status === "matched" ||
                    currentCase.status === "in_call" ? (
                    <MatchedStatusCard
                      caseData={currentCase}
                      onScheduleCall={handleScheduleCall}
                      onOpenQuestionnaire={handleOpenQuestionnaire}
                    />
                  ) : currentCase.status === "completed" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center space-y-3"
                    >
                      <CheckCircle2 size={32} className="text-primary-500 mx-auto" />
                      <h3 className="font-heading font-bold text-text">
                        Percorso completato
                      </h3>
                      <p className="text-sm font-body text-text-secondary">
                        Hai completato il tuo percorso conoscitivo con successo.
                        Puoi iniziarne uno nuovo quando vuoi.
                      </p>
                      <Link
                        href="/questionnaire"
                        className="inline-flex items-center gap-2 mt-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-body font-semibold py-2.5 px-5 rounded-xl transition-colors duration-200"
                      >
                        Inizia un nuovo percorso
                        <ChevronRight size={14} />
                      </Link>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}

              {activeTab === "matches" && (
                <motion.div
                  key="matches"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <SectionHeader
                    icon={<Users size={16} />}
                    title="I miei match"
                    subtitle={`${matches.length} professionisti abbinati`}
                  />

                  {matches.length === 0 ? (
                    <div className="bg-surface rounded-2xl border border-border p-8 text-center">
                      <p className="text-sm font-body text-text-secondary">
                        Nessun match ancora. Completa il questionario per iniziare.
                      </p>
                      <Link
                        href="/questionnaire"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-body font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2"
                      >
                        Inizia il questionario <ChevronRight size={14} />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((psych, index) => (
                        <MatchCard
                          key={psych.id}
                          psychologist={psych}
                          onScheduleCall={handleScheduleCall}
                          onOpenQuestionnaire={handleOpenQuestionnaire}
                          animationDelay={index * 0.08}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <SectionHeader
                    icon={<History size={16} />}
                    title="Storico"
                    subtitle="I tuoi casi precedenti"
                  />
                  <HistorySection entries={history} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
