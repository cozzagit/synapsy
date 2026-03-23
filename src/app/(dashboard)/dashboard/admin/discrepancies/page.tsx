"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, XCircle, Clock, Filter } from "lucide-react";

type Severity = "minor" | "major" | "critical";
type Resolution = "pending" | "resolved_user" | "resolved_psychologist" | "penalty_applied" | "dismissed";

interface MockDiscrepancy {
  id: string;
  matchSelectionId: string;
  type: string;
  severity: Severity;
  userResponse: string;
  psychologistResponse: string;
  resolution: Resolution;
  createdAt: string;
}

const mockDiscrepancies: MockDiscrepancy[] = [
  { id: "1", matchSelectionId: "ms-001", type: "continuity", severity: "major", userResponse: "Continuerà", psychologistResponse: "Non continuerà", resolution: "pending", createdAt: "2026-03-20" },
  { id: "2", matchSelectionId: "ms-002", type: "call_happened", severity: "critical", userResponse: "Call avvenuta", psychologistResponse: "Call non avvenuta", resolution: "pending", createdAt: "2026-03-19" },
  { id: "3", matchSelectionId: "ms-003", type: "other", severity: "minor", userResponse: "45 minuti", psychologistResponse: "20 minuti", resolution: "dismissed", createdAt: "2026-03-15" },
];

const severityConfig: Record<Severity, { label: string; color: string; icon: typeof AlertTriangle }> = {
  critical: { label: "Critica", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  major: { label: "Grave", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle },
  minor: { label: "Lieve", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
};

const resolutionLabels: Record<Resolution, string> = {
  pending: "In attesa",
  resolved_user: "Risolto (utente)",
  resolved_psychologist: "Risolto (psicologo)",
  penalty_applied: "Penalità applicata",
  dismissed: "Archiviata",
};

export default function AdminDiscrepanciesPage() {
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [discrepancies] = useState(mockDiscrepancies);

  const filtered = filter === "all" ? discrepancies : discrepancies.filter((d) => d.severity === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Gestione Discrepanze</h1>
        <p className="mt-1 text-text-secondary">Revisione e risoluzione delle discrepanze post-call</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-tertiary" />
        {(["all", "critical", "major", "minor"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? "bg-primary-500 text-white" : "bg-bg-subtle text-text-secondary hover:bg-border"
            }`}
          >
            {f === "all" ? "Tutte" : severityConfig[f].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-subtle">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Gravità</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-text-secondary md:table-cell">Risposta Utente</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-text-secondary md:table-cell">Risposta Psicologo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Stato</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const sev = severityConfig[d.severity];
              const SevIcon = sev.icon;
              return (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-text">{d.type === "continuity" ? "Continuità" : d.type === "call_happened" ? "Call avvenuta" : "Durata"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sev.color}`}>
                      <SevIcon className="h-3 w-3" />
                      {sev.label}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-text-secondary md:table-cell">{d.userResponse}</td>
                  <td className="hidden px-4 py-3 text-sm text-text-secondary md:table-cell">{d.psychologistResponse}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${d.resolution === "pending" ? "text-amber-600" : "text-text-tertiary"}`}>
                      {resolutionLabels[d.resolution]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.resolution === "pending" && (
                      <div className="flex gap-1">
                        <button className="rounded-lg bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600">
                          <CheckCircle className="h-3 w-3" />
                        </button>
                        <button className="rounded-lg bg-bg-subtle px-3 py-1 text-xs font-medium text-text-secondary hover:bg-border">
                          <XCircle className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-text-tertiary">Nessuna discrepanza trovata</div>
        )}
      </div>
    </div>
  );
}
