"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Clock,
  ChevronRight,
  History,
  Users,
  CheckCircle2,
  PhoneCall,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { UserCaseStatus, type CaseStatus } from "@/components/dashboard/user-case-status";
import { MatchCard, type MatchedPsychologist } from "@/components/dashboard/match-card";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface MockCase {
  id: string;
  status: CaseStatus;
  primaryProblem: string;
  createdAt: string;
  matchedPsychologist?: MatchedPsychologist;
}

interface MockHistoryEntry {
  id: string;
  primaryProblem: string;
  status: "completed" | "expired" | "cancelled";
  createdAt: string;
  outcome?: string;
}

const MOCK_USER_NAME = "Sofia";

const MOCK_CURRENT_CASE: MockCase = {
  id: "case-001",
  status: "in_call",
  primaryProblem: "Ansia e stress lavorativo",
  createdAt: "2026-03-10T10:00:00Z",
  matchedPsychologist: {
    id: "psych-001",
    matchSelectionId: "match-001",
    name: "Dr.ssa Martina Ferretti",
    specializations: ["Ansia", "Stress da lavoro", "Disturbi del sonno"],
    approach: "Cognitivo-comportamentale (CBT)",
    averageRating: 4.8,
    continuityRate: 0.87,
    modality: "online",
    callScheduledAt: "2026-03-25T15:00:00Z",
    status: "call_scheduled",
  },
};

const MOCK_MATCHES: MatchedPsychologist[] = [
  {
    id: "psych-001",
    matchSelectionId: "match-001",
    name: "Dr.ssa Martina Ferretti",
    specializations: ["Ansia", "Stress da lavoro", "Disturbi del sonno"],
    approach: "Cognitivo-comportamentale (CBT)",
    averageRating: 4.8,
    continuityRate: 0.87,
    modality: "online",
    callScheduledAt: "2026-03-25T15:00:00Z",
    status: "call_scheduled",
  },
  {
    id: "psych-002",
    matchSelectionId: "match-002",
    name: "Dr. Luca Antonelli",
    specializations: ["Ansia", "Relazioni", "Autostima"],
    approach: "Psicodinamico",
    averageRating: 4.5,
    continuityRate: 0.79,
    modality: "both",
    status: "selected",
  },
  {
    id: "psych-003",
    matchSelectionId: "match-003",
    name: "Dr.ssa Elena Russo",
    specializations: ["Stress", "Burnout"],
    approach: "ACT — Acceptance & Commitment Therapy",
    averageRating: 4.6,
    continuityRate: 0.82,
    modality: "online",
    status: "call_completed",
  },
];

const MOCK_HISTORY: MockHistoryEntry[] = [
  {
    id: "case-history-001",
    primaryProblem: "Difficoltà relazionali",
    status: "completed",
    createdAt: "2025-09-15T08:00:00Z",
    outcome: "Percorso avviato con Dr. Marco Bianchi",
  },
  {
    id: "case-history-002",
    primaryProblem: "Umore basso",
    status: "expired",
    createdAt: "2025-06-01T08:00:00Z",
    outcome: "Nessun professionista selezionato entro i termini",
  },
];

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

function NoCaseCTA({ onStart }: { onStart: () => void }) {
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
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-body font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Inizia il questionario
        <ChevronRight size={15} />
      </button>
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
  caseData: MockCase;
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
      icon: <AlertCircle size={20} className="text-accent-600" />,
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

function HistorySection({ entries }: { entries: MockHistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm font-body text-text-secondary text-center py-6">
        Nessun caso precedente.
      </p>
    );
  }

  const statusLabels: Record<MockHistoryEntry["status"], string> = {
    completed: "Completato",
    expired: "Scaduto",
    cancelled: "Annullato",
  };

  const statusColors: Record<MockHistoryEntry["status"], string> = {
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

  // In production, fetch from API. Using mock data for now.
  const currentCase: MockCase | null = MOCK_CURRENT_CASE;
  const matches: MatchedPsychologist[] = MOCK_MATCHES;
  const history: MockHistoryEntry[] = MOCK_HISTORY;

  function handleScheduleCall(matchSelectionId: string) {
    // In production: open a scheduling modal or navigate to scheduling page
    alert(`Apertura schedulazione per match: ${matchSelectionId}`);
  }

  function handleOpenQuestionnaire(matchSelectionId: string) {
    router.push(`/verification/${matchSelectionId}?type=user&respondentId=mock-user-id`);
  }

  function handleStartQuestionnaire() {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <p className="text-sm font-body text-text-secondary">
            Bentornata,
          </p>
          <h1 className="text-2xl font-heading font-bold text-text">
            {MOCK_USER_NAME}
          </h1>
        </motion.div>

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
                subtitle={
                  currentCase ? currentCase.primaryProblem : undefined
                }
              />

              {!currentCase ? (
                <NoCaseCTA onStart={handleStartQuestionnaire} />
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
                  <button
                    onClick={handleStartQuestionnaire}
                    className="inline-flex items-center gap-2 mt-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-body font-semibold py-2.5 px-5 rounded-xl transition-colors duration-200"
                  >
                    Inizia un nuovo percorso
                    <ChevronRight size={14} />
                  </button>
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
      </div>
    </div>
  );
}
