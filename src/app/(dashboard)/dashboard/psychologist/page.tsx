"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Euro,
  Coins,
  Heart,
  Sprout,
  ArrowRight,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CaseCard, type CaseCardData } from "@/components/dashboard/case-card";
import { ActivityTimeline, type ActivityEvent } from "@/components/dashboard/activity-timeline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardStats {
  totalPatients: number;
  revenue: number;
  availableCredits: number;
  continuityRate: number;
  revenueTrend?: string;
  patientsTrend?: string;
}

interface GrowthStageData {
  name: string;
  description: string;
  progressPercent: number;
  nextStage: string;
  metrics: Array<{ label: string; value: string }>;
}

interface PsychologistProfile {
  firstName: string;
  lastName: string;
  growthStage?: GrowthStageData;
}

interface DashboardData {
  stats: DashboardStats;
  pendingCases: CaseCardData[];
  profile: PsychologistProfile;
  recentActivity?: ActivityEvent[];
}

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-bg-subtle rounded-xl ${className ?? ""}`} />;
}

function StatCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-9 w-9 rounded-xl" />
      </div>
      <SkeletonBlock className="h-9 w-16" />
      <SkeletonBlock className="h-3 w-32" />
    </div>
  );
}

function CaseCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <SkeletonBlock className="h-5 w-16 rounded-full" />
            <SkeletonBlock className="h-5 w-20 rounded-full" />
          </div>
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
        <SkeletonBlock className="h-14 w-14 rounded-full shrink-0" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Growth garden visualization
// ---------------------------------------------------------------------------

function GrowthGarden({ data }: { data: GrowthStageData }) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wider mb-1">
            Il tuo giardino della crescita
          </p>
          <h3 className="text-lg font-heading font-bold text-text">{data.name}</h3>
          <p className="text-sm font-body text-text-secondary mt-1">{data.description}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
          <Sprout size={24} className="text-primary-600" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs font-body text-text-tertiary mb-1.5">
          <span>{data.name}</span>
          <span>{data.nextStage}</span>
        </div>
        <div className="h-2.5 bg-bg-subtle rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          />
        </div>
        <p className="text-xs font-body text-text-tertiary mt-1">
          {data.progressPercent}% verso &quot;{data.nextStage}&quot;
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.metrics.map((m) => (
          <div key={m.label} className="bg-bg-subtle rounded-xl p-3">
            <p className="text-xs font-body text-text-tertiary mb-0.5">{m.label}</p>
            <p className="text-lg font-heading font-bold text-text">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthGardenSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="h-3 w-48" />
        </div>
        <SkeletonBlock className="h-12 w-12 rounded-2xl shrink-0" />
      </div>
      <SkeletonBlock className="h-2.5 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Continuity arc (mini)
// ---------------------------------------------------------------------------

function ContinuityArc({ percent }: { percent: number }) {
  const r = 18;
  const circ = Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <div className="flex items-center gap-2">
      <svg width="44" height="26" viewBox="0 0 44 26">
        <path d="M 4 22 A 18 18 0 0 1 40 22" fill="none" stroke="#E8E5DF" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M 4 22 A 18 18 0 0 1 40 22"
          fill="none"
          stroke="#5B8A72"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-2xl font-heading font-bold text-text">{percent}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PsychologistDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [pendingCases, setPendingCases] = useState<CaseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard/psychologist");
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const json = await res.json();
        setData(json);
        setPendingCases(
          (json.pendingCases ?? []).map((c: CaseCardData & { postedAt: string | Date }) => ({
            ...c,
            postedAt: new Date(c.postedAt),
          }))
        );
      } catch {
        setError("Non è stato possibile caricare la dashboard. Riprova tra poco.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  async function handleAccept(id: string) {
    try {
      await fetch("/api/candidacy/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidacyId: id, action: "accept" }),
      });
      setPendingCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "accepted" as const } : c))
      );
    } catch {
      setPendingCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "accepted" as const } : c))
      );
    }
  }

  async function handleReject(id: string) {
    try {
      await fetch("/api/candidacy/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidacyId: id, action: "reject" }),
      });
      setPendingCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c))
      );
    } catch {
      setPendingCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c))
      );
    }
  }

  const visiblePendingCases = pendingCases.filter((c) => c.status === "pending");

  const stats = data?.stats;
  const profile = data?.profile;
  const growthStage = profile?.growthStage;
  const recentActivity = data?.recentActivity ?? [];

  const firstName = profile?.firstName ?? "";
  const greeting = firstName ? `Buongiorno, ${firstName} 👋` : "Buongiorno 👋";

  if (error) {
    return (
      <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-start gap-3 bg-accent-50 border border-accent-200 rounded-2xl p-6">
          <AlertCircle size={20} className="text-accent-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-body font-semibold text-accent-800">Errore nel caricamento</p>
            <p className="text-sm font-body text-accent-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-body font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        {loading ? (
          <>
            <SkeletonBlock className="h-7 w-56 mb-2" />
            <SkeletonBlock className="h-4 w-72" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-heading font-bold text-text">{greeting}</h1>
            <p className="text-sm font-body text-text-secondary mt-1">
              Ecco un riepilogo della tua attività su Synapsy
            </p>
          </>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Pazienti acquisiti"
              value={stats?.totalPatients ?? 0}
              trend={stats?.patientsTrend === "up" ? "up" : stats?.patientsTrend === "down" ? "down" : "neutral"}
              trendLabel={stats?.patientsTrend === "up" ? "In crescita" : undefined}
              icon={<Users size={18} />}
              variant="primary"
            />
            <StatCard
              label="Fatturato generato"
              value={stats?.revenue ?? 0}
              prefix="€"
              trend={stats?.revenueTrend === "up" ? "up" : stats?.revenueTrend === "down" ? "down" : "neutral"}
              trendLabel={stats?.revenueTrend === "up" ? "In crescita" : undefined}
              icon={<Euro size={18} />}
              variant="secondary"
            />
            <StatCard
              label="Crediti disponibili"
              value={stats?.availableCredits ?? 0}
              trend="neutral"
              icon={<Coins size={18} />}
              variant="accent"
            />
            <StatCard
              label="Tasso di continuità"
              value=""
              icon={<Heart size={18} />}
              variant="primary"
              extra={<ContinuityArc percent={Math.round((stats?.continuityRate ?? 0) * 100)} />}
              trend="neutral"
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: cases + activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Incoming cases */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-heading font-semibold text-text">
                Casi in arrivo
                {!loading && visiblePendingCases.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-100 text-accent-700 text-xs font-body font-bold">
                    {visiblePendingCases.length}
                  </span>
                )}
              </h2>
              <Link
                href="/dashboard/psychologist/cases"
                className="flex items-center gap-1 text-xs font-body font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-2 transition-colors"
              >
                Vedi tutti <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                <CaseCardSkeleton />
                <CaseCardSkeleton />
              </div>
            ) : visiblePendingCases.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface rounded-2xl border border-border p-10 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-bg-subtle flex items-center justify-center mb-3">
                  <Inbox size={26} className="text-text-tertiary" />
                </div>
                <p className="text-sm font-body font-medium text-text-secondary">
                  Nessun caso in arrivo. I tuoi pazienti arriveranno presto!
                </p>
                <p className="text-xs font-body text-text-tertiary mt-1">
                  Ti notificheremo non appena un nuovo caso compatibile sarà disponibile
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {visiblePendingCases.map((c) => (
                  <CaseCard
                    key={c.id}
                    case_={c}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Activity timeline */}
          <section className="bg-surface rounded-2xl border border-border shadow-sm p-5">
            <h2 className="text-base font-heading font-semibold text-text mb-4">
              Attività recente
            </h2>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <SkeletonBlock className="h-8 w-8 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <SkeletonBlock className="h-4 w-40" />
                      <SkeletonBlock className="h-3 w-56" />
                      <SkeletonBlock className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ActivityTimeline
                events={recentActivity.map((e: ActivityEvent & { timestamp: string | Date }) => ({
                  ...e,
                  timestamp: new Date(e.timestamp),
                }))}
                maxItems={5}
                showViewAll
              />
            )}
          </section>
        </div>

        {/* Right column: growth garden + quick actions */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <GrowthGardenSkeleton />
          ) : growthStage ? (
            <GrowthGarden data={growthStage} />
          ) : (
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
                <Sprout size={24} className="text-primary-600" />
              </div>
              <p className="text-sm font-body text-text-secondary">
                Il tuo giardino della crescita è in costruzione
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-5">
            <h2 className="text-sm font-heading font-semibold text-text mb-3">
              Azioni rapide
            </h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/dashboard/psychologist/profile", label: "Aggiorna il tuo profilo" },
                { href: "/dashboard/psychologist/credits", label: "Gestisci i crediti" },
                { href: "/dashboard/psychologist/cases", label: "Esplora i casi disponibili" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-bg-subtle text-sm font-body text-text-secondary hover:text-text transition-colors group"
                >
                  <span>{action.label}</span>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-secondary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
