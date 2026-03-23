"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  FolderOpen,
  Euro,
  AlertTriangle,
  ChevronRight,
  Clock,
  ShieldAlert,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AdminStats {
  totalUsers: number;
  totalPsychologists: number;
  totalCases: number;
  totalRevenueCents: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  createdAt: string;
}

interface PendingVerification {
  id: string;
  name: string;
  email: string;
  alboNumber: string;
  alboRegion: string;
  createdAt: string;
}

interface ActiveDiscrepancy {
  id: string;
  matchSelectionId: string;
  type: "call_happened" | "continuity" | "other";
  severity: "minor" | "major" | "critical";
  resolution: "pending" | "resolved_user" | "resolved_psychologist" | "penalty_applied" | "dismissed";
  createdAt: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_STATS: AdminStats = {
  totalUsers: 247,
  totalPsychologists: 34,
  totalCases: 189,
  totalRevenueCents: 1450000,
};

const MOCK_RECENT_USERS: RecentUser[] = [
  { id: "u-1", name: "Marco Rossi", email: "marco.rossi@example.com", role: "user", createdAt: "2026-03-22T14:30:00Z" },
  { id: "u-2", name: "Giulia Ferretti", email: "giulia.ferretti@example.com", role: "psychologist", createdAt: "2026-03-22T11:00:00Z" },
  { id: "u-3", name: "Andrea Conti", email: "andrea.conti@example.com", role: "user", createdAt: "2026-03-21T17:45:00Z" },
  { id: "u-4", name: "Sara Bianchi", email: "sara.bianchi@example.com", role: "user", createdAt: "2026-03-21T09:20:00Z" },
  { id: "u-5", name: "Luca Moretti", email: "luca.moretti@example.com", role: "psychologist", createdAt: "2026-03-20T16:10:00Z" },
];

const MOCK_PENDING_VERIFICATIONS: PendingVerification[] = [
  { id: "pp-1", name: "Dr. Elena Ricci", email: "elena.ricci@example.com", alboNumber: "12345", alboRegion: "Lombardia", createdAt: "2026-03-20T09:00:00Z" },
  { id: "pp-2", name: "Dr. Roberto Mancini", email: "roberto.mancini@example.com", alboNumber: "67890", alboRegion: "Lazio", createdAt: "2026-03-19T14:30:00Z" },
  { id: "pp-3", name: "Dr. Valentina Serra", email: "valentina.serra@example.com", alboNumber: "11223", alboRegion: "Toscana", createdAt: "2026-03-18T11:15:00Z" },
];

const MOCK_DISCREPANCIES: ActiveDiscrepancy[] = [
  { id: "d-1", matchSelectionId: "ms-123", type: "call_happened", severity: "critical", resolution: "pending", createdAt: "2026-03-22T10:00:00Z" },
  { id: "d-2", matchSelectionId: "ms-456", type: "continuity", severity: "major", resolution: "pending", createdAt: "2026-03-21T15:30:00Z" },
  { id: "d-3", matchSelectionId: "ms-789", type: "other", severity: "minor", resolution: "pending", createdAt: "2026-03-20T08:45:00Z" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Oggi";
  if (days === 1) return "Ieri";
  return `${days} giorni fa`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-heading font-bold text-text">{value}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: RecentUser["role"] }) {
  const map = {
    user: { label: "Utente", bg: "bg-bg-subtle", text: "text-text-secondary" },
    psychologist: { label: "Psicologo", bg: "bg-secondary-100", text: "text-secondary-700" },
    admin: { label: "Admin", bg: "bg-accent-100", text: "text-accent-700" },
  };
  const s = map[role];
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-body font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: ActiveDiscrepancy["severity"] }) {
  const map = {
    minor: { label: "Lieve", bg: "bg-secondary-100", text: "text-secondary-700" },
    major: { label: "Grave", bg: "bg-accent-100", text: "text-accent-700" },
    critical: { label: "Critica", bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[severity];
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-body font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function DiscrepancyTypeLabel({ type }: { type: ActiveDiscrepancy["type"] }) {
  const map: Record<string, string> = {
    call_happened: "Chiamata avvenuta",
    continuity: "Continuità",
    other: "Altro",
  };
  return <span className="text-sm font-body text-text-secondary">{map[type] ?? type}</span>;
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [session] = useState<{ role: string }>({ role: "admin" }); // replaced by real auth in production

  if (session.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShieldAlert size={48} className="text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-text mb-2">Accesso negato</h2>
          <p className="text-sm font-body text-text-secondary">
            Non hai i permessi per accedere a questa sezione.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wider mb-1">
          Pannello di controllo
        </p>
        <h1 className="text-2xl font-heading font-bold text-text">Amministrazione</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Panoramica della piattaforma Synapsy
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Utenti totali"
          value={MOCK_STATS.totalUsers}
          icon={<Users size={20} />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
        />
        <StatCard
          label="Psicologi"
          value={MOCK_STATS.totalPsychologists}
          icon={<UserCheck size={20} />}
          iconBg="bg-secondary-100"
          iconColor="text-secondary-700"
        />
        <StatCard
          label="Casi totali"
          value={MOCK_STATS.totalCases}
          icon={<FolderOpen size={20} />}
          iconBg="bg-accent-100"
          iconColor="text-accent-700"
        />
        <StatCard
          label="Fatturato totale"
          value={formatCurrency(MOCK_STATS.totalRevenueCents)}
          icon={<Euro size={20} />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent signups */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-heading font-semibold text-text">Iscrizioni recenti</h2>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-1 text-xs font-body font-medium text-primary-600 hover:text-primary-700"
            >
              Vedi tutti <ChevronRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {MOCK_RECENT_USERS.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-bg-subtle transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-heading font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg, #5B8A72, #7A6EA0)" }}
                  >
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-text truncate">{user.name}</p>
                    <p className="text-xs font-body text-text-secondary truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <RoleBadge role={user.role} />
                  <div className="flex items-center gap-1 text-xs font-body text-text-secondary">
                    <Clock size={11} />
                    {formatRelative(user.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending verifications */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-semibold text-text">Verifiche in attesa</h2>
              {MOCK_PENDING_VERIFICATIONS.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-100 text-accent-700 text-xs font-body font-bold">
                  {MOCK_PENDING_VERIFICATIONS.length}
                </span>
              )}
            </div>
            <Link
              href="/dashboard/admin/psychologists?filter=pending"
              className="flex items-center gap-1 text-xs font-body font-medium text-primary-600 hover:text-primary-700"
            >
              Gestisci <ChevronRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {MOCK_PENDING_VERIFICATIONS.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-bg-subtle transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
                    <UserCheck size={18} className="text-secondary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-text truncate">{p.name}</p>
                    <p className="text-xs font-body text-text-secondary">
                      Albo {p.alboNumber} — {p.alboRegion}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 ml-2">
                  <span className="text-xs font-body text-text-secondary">{formatDate(p.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active discrepancies */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-heading font-semibold text-text">Discrepanze attive</h2>
            {MOCK_DISCREPANCIES.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-body font-bold">
                {MOCK_DISCREPANCIES.length}
              </span>
            )}
          </div>
          <Link
            href="/dashboard/admin/discrepancies"
            className="flex items-center gap-1 text-xs font-body font-medium text-primary-600 hover:text-primary-700"
          >
            Vedi tutte <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {MOCK_DISCREPANCIES.map((d) => (
            <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-2 hover:bg-bg-subtle transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <DiscrepancyTypeLabel type={d.type} />
                    <SeverityBadge severity={d.severity} />
                  </div>
                  <p className="text-xs font-body text-text-secondary">
                    Match {d.matchSelectionId} — {formatDate(d.createdAt)}
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/admin/discrepancies`}
                className="shrink-0 text-xs font-body font-semibold text-primary-600 hover:text-primary-700 hover:underline underline-offset-2"
              >
                Gestisci →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
