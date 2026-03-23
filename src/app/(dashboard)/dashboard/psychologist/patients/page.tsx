"use client";

import { useState } from "react";
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
// Types & mock data
// ---------------------------------------------------------------------------

type PatientStatus = "active" | "paused" | "completed";
type ContinuityLevel = "high" | "medium" | "low";

interface Patient {
  id: string;
  anonymousCode: string;
  primaryProblem: string;
  startDate: Date;
  lastSessionDate: Date | null;
  nextSessionDate: Date | null;
  totalSessions: number;
  status: PatientStatus;
  continuityLevel: ContinuityLevel;
  needsQuestionnaire: boolean;
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p-1",
    anonymousCode: "MR-2024-01",
    primaryProblem: "Ansia generalizzata",
    startDate: new Date("2024-10-01"),
    lastSessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    nextSessionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    totalSessions: 8,
    status: "active",
    continuityLevel: "high",
    needsQuestionnaire: true,
  },
  {
    id: "p-2",
    anonymousCode: "FS-2024-02",
    primaryProblem: "Depressione lieve",
    startDate: new Date("2024-11-15"),
    lastSessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    nextSessionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    totalSessions: 4,
    status: "active",
    continuityLevel: "medium",
    needsQuestionnaire: false,
  },
  {
    id: "p-3",
    anonymousCode: "AG-2024-03",
    primaryProblem: "Disturbo relazionale",
    startDate: new Date("2024-08-20"),
    lastSessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    nextSessionDate: null,
    totalSessions: 12,
    status: "paused",
    continuityLevel: "low",
    needsQuestionnaire: false,
  },
  {
    id: "p-4",
    anonymousCode: "LB-2024-04",
    primaryProblem: "Crisi di identità",
    startDate: new Date("2024-06-01"),
    lastSessionDate: new Date("2024-12-15"),
    nextSessionDate: null,
    totalSessions: 20,
    status: "completed",
    continuityLevel: "high",
    needsQuestionnaire: false,
  },
];

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
// Patient card
// ---------------------------------------------------------------------------

function PatientCard({ patient }: { patient: Patient }) {
  const status = statusConfig[patient.status];
  const StatusIcon = status.icon;

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
          <p className="font-medium text-text">{formatShortDate(patient.startDate)}</p>
        </div>
        <div>
          <p className="text-text-tertiary mb-0.5">Ultima seduta</p>
          <p className="font-medium text-text">
            {patient.lastSessionDate ? formatShortDate(patient.lastSessionDate) : "—"}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary mb-0.5">Sedute totali</p>
          <p className="font-medium text-text">{patient.totalSessions}</p>
        </div>
      </div>

      {/* Next session */}
      {patient.nextSessionDate && (
        <div className="flex items-center gap-2 text-xs font-body text-secondary-700 bg-secondary-50 rounded-xl px-3 py-2 mb-4">
          <Clock size={13} />
          <span>Prossima seduta: <strong>{formatDate(patient.nextSessionDate)}</strong></span>
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
  const [activeTab, setActiveTab] = useState<FilterTab>("tutti");

  const filtered =
    activeTab === "tutti"
      ? MOCK_PATIENTS
      : MOCK_PATIENTS.filter((p) => p.status === activeTab);

  const countFor = (tab: FilterTab) =>
    tab === "tutti" ? MOCK_PATIENTS.length : MOCK_PATIENTS.filter((p) => p.status === tab).length;

  const activeCount = MOCK_PATIENTS.filter((p) => p.status === "active").length;

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">I miei pazienti</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          {activeCount} pazient{activeCount === 1 ? "e" : "i"} attiv{activeCount === 1 ? "o" : "i"} in questo momento
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Attivi", value: MOCK_PATIENTS.filter((p) => p.status === "active").length, color: "text-primary-600", bg: "bg-primary-50" },
          { label: "In pausa", value: MOCK_PATIENTS.filter((p) => p.status === "paused").length, color: "text-warning", bg: "bg-accent-50" },
          { label: "Completati", value: MOCK_PATIENTS.filter((p) => p.status === "completed").length, color: "text-text-secondary", bg: "bg-bg-subtle" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.bg} text-center`}>
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-body text-text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
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

      {/* Patients list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-subtle flex items-center justify-center mb-4">
            <Users size={28} className="text-text-tertiary" />
          </div>
          <p className="text-base font-body font-medium text-text-secondary">
            Nessun paziente in questa categoria
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
