"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ChevronDown,
  Filter,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth/client";

// ─── Types ─────────────────────────────────────────────────────────────────────

type DiscrepancyType = "call_happened" | "continuity" | "other";
type DiscrepancySeverity = "minor" | "major" | "critical";
type DiscrepancyResolution =
  | "pending"
  | "resolved_user"
  | "resolved_psychologist"
  | "penalty_applied"
  | "dismissed";

type SeverityFilter = "all" | DiscrepancySeverity;
type ResolutionFilter = "all" | "pending" | "resolved";

interface DiscrepancyRow {
  id: string;
  matchSelectionId: string;
  type: DiscrepancyType;
  severity: DiscrepancySeverity;
  userResponse: Record<string, unknown>;
  psychologistResponse: Record<string, unknown>;
  resolution: DiscrepancyResolution;
  createdAt: string;
  resolvedAt: string | null;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DISCREPANCIES: DiscrepancyRow[] = [
  {
    id: "d-1",
    matchSelectionId: "ms-123abc",
    type: "call_happened",
    severity: "critical",
    userResponse: { callHappened: false, notes: "Il terapeuta non si è presentato alla chiamata." },
    psychologistResponse: { callHappened: true, estimatedDurationMinutes: 45, notes: "La chiamata è avvenuta regolarmente." },
    resolution: "pending",
    createdAt: "2026-03-22T10:00:00Z",
    resolvedAt: null,
  },
  {
    id: "d-2",
    matchSelectionId: "ms-456def",
    type: "continuity",
    severity: "major",
    userResponse: { willContinue: false, notes: "Intenzione di interrompere il percorso." },
    psychologistResponse: { willContinue: true, notes: "Il paziente aveva confermato la continuazione." },
    resolution: "pending",
    createdAt: "2026-03-21T15:30:00Z",
    resolvedAt: null,
  },
  {
    id: "d-3",
    matchSelectionId: "ms-789ghi",
    type: "other",
    severity: "minor",
    userResponse: { notes: "Insoddisfazione per la comunicazione." },
    psychologistResponse: { notes: "Nessun problema segnalato dalla mia parte." },
    resolution: "dismissed",
    createdAt: "2026-03-20T08:45:00Z",
    resolvedAt: "2026-03-21T10:00:00Z",
  },
  {
    id: "d-4",
    matchSelectionId: "ms-321jkl",
    type: "call_happened",
    severity: "major",
    userResponse: { callHappened: true, estimatedDurationMinutes: 10 },
    psychologistResponse: { callHappened: true, estimatedDurationMinutes: 50 },
    resolution: "resolved_psychologist",
    createdAt: "2026-03-15T11:00:00Z",
    resolvedAt: "2026-03-16T14:00:00Z",
  },
  {
    id: "d-5",
    matchSelectionId: "ms-654mno",
    type: "continuity",
    severity: "critical",
    userResponse: { willContinue: false, notes: "Comportamento inappropriato." },
    psychologistResponse: { willContinue: true, notes: "Sessione terminata concordemente." },
    resolution: "penalty_applied",
    createdAt: "2026-03-10T09:00:00Z",
    resolvedAt: "2026-03-12T16:30:00Z",
  },
];

// ─── Label maps ────────────────────────────────────────────────────────────────

const typeLabels: Record<DiscrepancyType, string> = {
  call_happened: "Chiamata avvenuta",
  continuity: "Continuità",
  other: "Altro",
};

const resolutionLabels: Record<DiscrepancyResolution, string> = {
  pending: "In attesa",
  resolved_user: "Risolto (utente)",
  resolved_psychologist: "Risolto (psicologo)",
  penalty_applied: "Penalità applicata",
  dismissed: "Archiviato",
};

const resolutionSelectOptions: { value: DiscrepancyResolution; label: string }[] = [
  { value: "resolved_user", label: "Risolto (utente)" },
  { value: "resolved_psychologist", label: "Risolto (psicologo)" },
  { value: "penalty_applied", label: "Penalità applicata" },
  { value: "dismissed", label: "Archivia" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatJsonResponse(resp: Record<string, unknown>): string {
  return Object.entries(resp)
    .map(([k, v]) => `${k}: ${typeof v === "boolean" ? (v ? "Sì" : "No") : v}`)
    .join(" · ");
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: DiscrepancySeverity }) {
  const map: Record<DiscrepancySeverity, { label: string; bg: string; text: string }> = {
    minor: { label: "Lieve", bg: "bg-secondary-100", text: "text-secondary-700" },
    major: { label: "Grave", bg: "bg-accent-100", text: "text-accent-700" },
    critical: { label: "Critica", bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[severity];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-semibold ${s.bg} ${s.text}`}>
      <AlertTriangle size={10} />
      {s.label}
    </span>
  );
}

function ResolutionBadge({ resolution }: { resolution: DiscrepancyResolution }) {
  const isPending = resolution === "pending";
  const isPenalty = resolution === "penalty_applied";
  const isDismissed = resolution === "dismissed";

  const style = isPending
    ? "bg-accent-100 text-accent-700"
    : isPenalty
    ? "bg-red-100 text-red-700"
    : isDismissed
    ? "bg-bg-subtle text-text-secondary"
    : "bg-primary-100 text-primary-700";

  const Icon = isPending ? AlertTriangle : isDismissed ? XCircle : CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-semibold ${style}`}>
      <Icon size={10} />
      {resolutionLabels[resolution]}
    </span>
  );
}

function ResolveDropdown({
  id,
  onResolve,
  onDismiss,
}: {
  id: string;
  onResolve: (id: string, resolution: DiscrepancyResolution) => void;
  onDismiss: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
        >
          Risolvi <ChevronDown size={11} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-surface rounded-xl border border-border shadow-lg z-10 py-1">
            {resolutionSelectOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onResolve(id, opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-body text-text-secondary hover:bg-bg-subtle hover:text-text transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold bg-bg-subtle text-text-secondary hover:bg-border transition-colors"
      >
        <XCircle size={11} />
        Archivia
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminDiscrepanciesPage() {
  const { data: session, isPending } = useSession();
  const role = (session?.user as any)?.role;

  const [discrepancies, setDiscrepancies] = useState<DiscrepancyRow[]>(MOCK_DISCREPANCIES);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [resolutionFilter, setResolutionFilter] = useState<ResolutionFilter>("all");

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-text-secondary animate-spin" />
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShieldAlert size={48} className="text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-text mb-2">Accesso negato</h2>
          <p className="text-sm font-body text-text-secondary">
            Solo gli amministratori possono accedere a questa sezione.
          </p>
        </div>
      </div>
    );
  }

  function handleResolve(id: string, resolution: DiscrepancyResolution) {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, resolution, resolvedAt: new Date().toISOString() } : d,
      ),
    );
  }

  function handleDismiss(id: string) {
    handleResolve(id, "dismissed");
  }

  const filtered = discrepancies.filter((d) => {
    const matchesSeverity = severityFilter === "all" || d.severity === severityFilter;
    const matchesResolution =
      resolutionFilter === "all" ||
      (resolutionFilter === "pending" && d.resolution === "pending") ||
      (resolutionFilter === "resolved" && d.resolution !== "pending");
    return matchesSeverity && matchesResolution;
  });

  const pendingCount = discrepancies.filter((d) => d.resolution === "pending").length;

  const severityOptions: { key: SeverityFilter; label: string }[] = [
    { key: "all", label: "Tutte" },
    { key: "critical", label: "Critiche" },
    { key: "major", label: "Gravi" },
    { key: "minor", label: "Lievi" },
  ];

  const resolutionFilterOptions: { key: ResolutionFilter; label: string }[] = [
    { key: "all", label: "Tutti gli stati" },
    { key: "pending", label: "In attesa" },
    { key: "resolved", label: "Risolte" },
  ];

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wider mb-1">
          Amministrazione
        </p>
        <h1 className="text-2xl font-heading font-bold text-text">Gestione discrepanze</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Incongruenze tra le risposte degli utenti e degli psicologi
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Totali", count: discrepancies.length, style: "bg-bg-subtle text-text-secondary" },
          {
            label: "In attesa",
            count: pendingCount,
            style: pendingCount > 0 ? "bg-accent-100 text-accent-700" : "bg-bg-subtle text-text-secondary",
          },
          {
            label: "Critiche",
            count: discrepancies.filter((d) => d.severity === "critical").length,
            style: "bg-red-100 text-red-700",
          },
        ].map((chip) => (
          <div
            key={chip.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-semibold ${chip.style}`}
          >
            {chip.label}
            <span className="font-heading font-bold">{chip.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-secondary shrink-0" />
          <div className="flex gap-1 bg-bg-subtle rounded-xl p-1">
            {severityOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSeverityFilter(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-colors ${
                  severityFilter === opt.key
                    ? "bg-surface text-text shadow-sm"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 bg-bg-subtle rounded-xl p-1">
          {resolutionFilterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setResolutionFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-colors ${
                resolutionFilter === opt.key
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-16 text-center">
            <CheckCircle2 size={40} className="text-primary-400 mx-auto mb-3" />
            <p className="text-base font-heading font-semibold text-text mb-1">
              Nessuna discrepanza trovata
            </p>
            <p className="text-sm font-body text-text-secondary">
              Tutti i conflitti sono stati risolti.
            </p>
          </div>
        ) : (
          filtered.map((d) => {
            const isPending = d.resolution === "pending";
            const borderColor =
              d.severity === "critical"
                ? "border-red-200"
                : d.severity === "major"
                ? "border-accent-200"
                : "border-border";

            return (
              <div
                key={d.id}
                className={`bg-surface rounded-2xl border ${borderColor} shadow-sm overflow-hidden`}
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border bg-bg-subtle">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        d.severity === "critical"
                          ? "bg-red-100"
                          : d.severity === "major"
                          ? "bg-accent-100"
                          : "bg-secondary-100"
                      }`}
                    >
                      <AlertTriangle
                        size={16}
                        className={
                          d.severity === "critical"
                            ? "text-red-500"
                            : d.severity === "major"
                            ? "text-accent-500"
                            : "text-secondary-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-body font-semibold text-text">
                          {typeLabels[d.type]}
                        </p>
                        <SeverityBadge severity={d.severity} />
                        <ResolutionBadge resolution={d.resolution} />
                      </div>
                      <p className="text-xs font-body text-text-secondary mt-0.5">
                        Match #{d.matchSelectionId.slice(0, 8)} — {formatDate(d.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isPending && (
                    <ResolveDropdown
                      id={d.id}
                      onResolve={handleResolve}
                      onDismiss={handleDismiss}
                    />
                  )}
                </div>

                {/* Response comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                  <div className="px-5 py-4">
                    <p className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Risposta utente
                    </p>
                    <p className="text-sm font-body text-text leading-relaxed">
                      {formatJsonResponse(d.userResponse)}
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Risposta psicologo
                    </p>
                    <p className="text-sm font-body text-text leading-relaxed">
                      {formatJsonResponse(d.psychologistResponse)}
                    </p>
                  </div>
                </div>

                {/* Resolution footer */}
                {!isPending && d.resolvedAt && (
                  <div className="px-5 py-3 border-t border-border bg-bg-subtle">
                    <p className="text-xs font-body text-text-secondary">
                      Risolto il {formatDate(d.resolvedAt)} — {resolutionLabels[d.resolution]}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs font-body text-text-secondary mt-4">
          {filtered.length} {filtered.length === 1 ? "discrepanza" : "discrepanze"} visualizzate
        </p>
      )}
    </div>
  );
}
