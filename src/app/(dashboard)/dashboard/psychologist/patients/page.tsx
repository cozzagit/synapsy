"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { motion } from "motion/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PatientStatus = "active" | "paused" | "completed";
type ContinuityLevel = "high" | "medium" | "low";

interface Patient {
  id: string;
  anonymousCode: string;
  primaryProblem: string;
  startDate: string | Date;
  lastSessionDate: string | Date | null;
  nextSessionDate: string | Date | null;
  totalSessions: number;
  status: PatientStatus;
  continuityLevel: ContinuityLevel;
  needsQuestionnaire: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<PatientStatus, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  active: { label: "Attivo", icon: CheckCircle2, color: "text-primary-600", bg: "bg-primary-50" },
  paused: { label: "In pausa", icon: AlertCircle, color: "text-warning", bg: "bg-accent-50" },
  completed: { label: "Completato", icon: Circle, color: "text-text-tertiary", bg: "bg-bg-subtle" },
};

const continuityConfig: Record<ContinuityLevel, { label: string; bars: number; color: string }> = {
  high: { label: "Alta", bars: 3, color: "bg-primary-500" },
  medium: { label: "Media", bars: 2, color: "bg-accent-400" },
  low: { label: "Bassa", bars: 1, color: "bg-error" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function ContinuityIndicator({ level }: { level: ContinuityLevel }) {
  const cfg = continuityConfig[level];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-4 rounded-full transition-colors ${i < cfg.bars ? cfg.color : "bg-border"}`}
          />
        ))}
      </div>
      <span className="text-xs font-body text-text-tertiary">{cfg.label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function PatientCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="animate-pulse bg-bg-subtle w-10 h-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="animate-pulse bg-bg-subtle h-4 w-24 rounded" />
            <div className="animate-pulse bg-bg-subtle h-3 w-36 rounded" />
          </div>
        </div>
        <div className="animate-pulse bg-bg-subtle h-5 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="animate-pulse bg-bg-subtle h-3 w-16 rounded" />
            <div className="animate-pulse bg-bg-subtle h-4 w-12 rounded" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="animate-pulse bg-bg-subtle h-4 w-24 rounded" />
        <div className="animate-pulse bg-bg-subtle h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Patient card
// ---------------------------------------------------------------------------

function PatientCard({ patient }: { patient: Patient }) {
  const status = statusConfig[patient.status];
  const StatusIcon = status.icon;

  const startDate = patient.startDate ? new Date(patient.startDate) : null;
  const lastSessionDate = patient.lastSessionDate ? new Date(patient.lastSessionDate) : null;
  const nextSessionDate = patient.nextSessionDate ? new Date(patient.nextSessionDate) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Left: identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-heading font-bold text-secondary-700">
              {patient.anonymousCode.slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-body font-semibold text-text">{patient.anonymousCode}</p>
            <p className="text-xs font-body text-text-secondary">{patient.primaryProblem}</p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-body font-medium px-2 py-0.5 rounded-full shrink-0 ${status.bg} ${status.color}`}>
          <StatusIcon size={11} />
          {status.label}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body mb-4">
        <div>
          <p className="text-text-tertiary mb-0.5">Inizio terapia</p>
          <p className="font-medium text-text">{startDate ? formatShortDate(startDate) : "—"}</p>
        </div>
        <div>
          <p className="text-text-tertiary mb-0.5">Ultima seduta</p>
          <p className="font-medium text-text">
            {lastSessionDate ? formatShortDate(lastSessionDate) : "—"}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary mb-0.5">Sedute totali</p>
          <p className="font-medium text-text">{patient.totalSessions}</p>
        </div>
      </div>

      {/* Next session */}
      {nextSessionDate && (
        <div className="flex items-center gap-2 text-xs font-body text-secondary-700 bg-secondary-50 rounded-xl px-3 py-2 mb-4">
          <Clock size={13} />
          <span>Prossima seduta: <strong>{formatDate(nextSessionDate)}</strong></span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <ContinuityIndicator level={patient.continuityLevel} />

        <div className="flex items-center gap-2">
          {patient.needsQuestionnaire && (
            <Link
              href={`/dashboard/psychologist/patients/${patient.id}/questionnaire`}
              className="flex items-center gap-1 text-xs font-body font-medium text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <ClipboardList size={12} />
              Questionario
            </Link>
          )}
          <button className="flex items-center gap-1 text-xs font-body font-medium text-text-secondary hover:text-text px-2 py-1 rounded-lg hover:bg-bg-subtle transition-colors">
            Dettagli <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type FilterTab = "tutti" | PatientStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "tutti", label: "Tutti" },
  { key: "active", label: "Attivi" },
  { key: "paused", label: "In pausa" },
  { key: "completed", label: "Completati" },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("tutti");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPatients() {
    try {
      setError(null);
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const json = await res.json();
      const raw: Patient[] = Array.isArray(json) ? json : json.data ?? [];
      setPatients(raw);
    } catch {
      setError("Non è stato possibile caricare i pazienti. Riprova tra poco.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    activeTab === "tutti"
      ? patients
      : patients.filter((p) => p.status === activeTab);

  const countFor = (tab: FilterTab) =>
    tab === "tutti" ? patients.length : patients.filter((p) => p.status === tab).length;

  const activeCount = patients.filter((p) => p.status === "active").length;
  const pausedCount = patients.filter((p) => p.status === "paused").length;
  const completedCount = patients.filter((p) => p.status === "completed").length;

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">I miei pazienti</h1>
        {loading ? (
          <div className="animate-pulse bg-bg-subtle h-4 w-48 rounded mt-2" />
        ) : (
          <p className="text-sm font-body text-text-secondary mt-1">
            {activeCount} pazient{activeCount === 1 ? "e" : "i"} attiv{activeCount === 1 ? "o" : "i"} in questo momento
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-6">
          <AlertCircle size={18} className="text-accent-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-body font-semibold text-accent-800">Errore nel caricamento</p>
            <p className="text-sm font-body text-accent-700 mt-0.5">{error}</p>
            <button
              onClick={fetchPatients}
              className="mt-2 text-xs font-body font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
            >
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-bg-subtle rounded-2xl h-20" />
          ))}
        </div>
      ) : !error && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Attivi", value: activeCount, color: "text-primary-600", bg: "bg-primary-50" },
            { label: "In pausa", value: pausedCount, color: "text-warning", bg: "bg-accent-50" },
            { label: "Completati", value: completedCount, color: "text-text-secondary", bg: "bg-bg-subtle" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.bg} text-center`}>
              <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-body text-text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && !error && (
        <div className="flex gap-1 p-1 bg-bg-subtle rounded-xl mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs font-bold rounded-full px-1.5 py-0.5 leading-none ${
                  activeTab === tab.key
                    ? "bg-primary-100 text-primary-700"
                    : "bg-border text-text-tertiary"
                }`}
              >
                {countFor(tab.key)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          <PatientCardSkeleton />
          <PatientCardSkeleton />
          <PatientCardSkeleton />
        </div>
      )}

      {/* Patients list */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-subtle flex items-center justify-center mb-4">
              <Users size={28} className="text-text-tertiary" />
            </div>
            <p className="text-base font-body font-medium text-text-secondary">
              {activeTab === "tutti"
                ? "Nessun paziente ancora. I tuoi pazienti appariranno qui non appena avvii un percorso!"
                : "Nessun paziente in questa categoria"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
