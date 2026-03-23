"use client";

import { useState, useEffect } from "react";
import { Inbox, SlidersHorizontal, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseCard, type CaseCardData, type CaseStatus } from "@/components/dashboard/case-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterTab = "tutti" | CaseStatus;

interface TabConfig {
  key: FilterTab;
  label: string;
  statuses: CaseStatus[];
}

const TABS: TabConfig[] = [
  { key: "tutti", label: "Tutti", statuses: ["pending", "accepted", "rejected", "completed"] },
  { key: "pending", label: "In attesa", statuses: ["pending"] },
  { key: "accepted", label: "Accettati", statuses: ["accepted"] },
  { key: "completed", label: "Completati", statuses: ["completed"] },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function CaseCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="animate-pulse bg-bg-subtle h-5 w-16 rounded-full" />
            <div className="animate-pulse bg-bg-subtle h-5 w-20 rounded-full" />
          </div>
          <div className="animate-pulse bg-bg-subtle h-3 w-40 rounded" />
          <div className="animate-pulse bg-bg-subtle h-12 w-full rounded-xl" />
        </div>
        <div className="animate-pulse bg-bg-subtle h-14 w-14 rounded-full shrink-0" />
      </div>
      <div className="flex gap-2">
        <div className="animate-pulse bg-bg-subtle h-5 w-16 rounded-full" />
        <div className="animate-pulse bg-bg-subtle h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-2 pt-1 border-t border-border">
        <div className="animate-pulse bg-bg-subtle h-9 flex-1 rounded-xl" />
        <div className="animate-pulse bg-bg-subtle h-9 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CasesPage() {
  const [cases, setCases] = useState<CaseCardData[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("tutti");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCases() {
    try {
      setError(null);
      const res = await fetch("/api/cases/incoming");
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const json = await res.json();
      const raw: Array<CaseCardData & { postedAt: string | Date }> = Array.isArray(json)
        ? json
        : json.data ?? [];
      setCases(
        raw.map((c) => ({
          ...c,
          postedAt: new Date(c.postedAt),
        }))
      );
    } catch {
      setError("Non è stato possibile caricare i casi. Riprova tra poco.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAccept(id: string) {
    try {
      await fetch("/api/candidacy/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidacyId: id, action: "accept" }),
      });
    } catch {
      // optimistic update proceeds regardless
    }
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "accepted" as const } : c))
    );
  }

  async function handleReject(id: string) {
    try {
      await fetch("/api/candidacy/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidacyId: id, action: "reject" }),
      });
    } catch {
      // optimistic update proceeds regardless
    }
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c))
    );
  }

  const activeStatuses =
    TABS.find((t) => t.key === activeTab)?.statuses ?? ["pending", "accepted", "rejected", "completed"];
  const filteredCases = cases.filter((c) => activeStatuses.includes(c.status));

  const countFor = (tab: TabConfig) =>
    tab.key === "tutti"
      ? cases.length
      : cases.filter((c) => tab.statuses.includes(c.status)).length;

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text">Casi in arrivo</h1>
          <p className="text-sm font-body text-text-secondary mt-1">
            Esplora i casi compatibili con il tuo profilo e candidati
          </p>
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border text-sm font-body text-text-secondary hover:bg-bg-subtle transition-colors">
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filtri</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-6">
          <AlertCircle size={18} className="text-accent-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-body font-semibold text-accent-800">Errore nel caricamento</p>
            <p className="text-sm font-body text-accent-700 mt-0.5">{error}</p>
            <button
              onClick={fetchCases}
              className="mt-2 text-xs font-body font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
            >
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {!loading && !error && (
        <div className="flex gap-1 p-1 bg-bg-subtle rounded-xl mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors duration-150 flex items-center gap-1.5
                ${activeTab === tab.key
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
                }
              `}
            >
              {tab.label}
              {countFor(tab) > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 leading-none font-bold ${
                    activeTab === tab.key
                      ? "bg-primary-100 text-primary-700"
                      : "bg-border text-text-tertiary"
                  }`}
                >
                  {countFor(tab)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          <CaseCardSkeleton />
          <CaseCardSkeleton />
          <CaseCardSkeleton />
        </div>
      )}

      {/* Case list */}
      {!loading && !error && (
        <AnimatePresence mode="popLayout">
          {filteredCases.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-bg-subtle flex items-center justify-center mb-4">
                <Inbox size={28} className="text-text-tertiary" />
              </div>
              <p className="text-base font-body font-medium text-text-secondary">
                {activeTab === "tutti"
                  ? "Nessun caso in arrivo. I tuoi pazienti arriveranno presto!"
                  : "Nessun caso in questa categoria"}
              </p>
              <p className="text-sm font-body text-text-tertiary mt-1">
                Ti notificheremo quando nuovi casi compatibili saranno disponibili
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredCases.map((c) => (
                <CaseCard
                  key={c.id}
                  case_={c}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  showActions={c.status === "pending"}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
