"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  UserCheck,
  UserX,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { growthStages } from "@/lib/utils/labels";
import { useSession } from "@/lib/auth/client";

// ─── Types ─────────────────────────────────────────────────────────────────────

type VerifyFilter = "all" | "verified" | "pending" | "blocked";

interface PsychologistRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  alboNumber: string;
  alboRegion: string;
  isVerified: boolean;
  isBlocked: boolean;
  rankingScore: number;
  growthStage: "seed" | "germoglio" | "crescita" | "fioritura" | "radici";
  createdAt: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PSYCHOLOGISTS: PsychologistRow[] = [
  {
    id: "pp-1",
    userId: "u-10",
    name: "Elena Ricci",
    email: "elena.ricci@example.com",
    alboNumber: "12345",
    alboRegion: "Lombardia",
    isVerified: true,
    isBlocked: false,
    rankingScore: 82.5,
    growthStage: "crescita",
    createdAt: "2025-11-10T09:00:00Z",
  },
  {
    id: "pp-2",
    userId: "u-11",
    name: "Roberto Mancini",
    email: "roberto.mancini@example.com",
    alboNumber: "67890",
    alboRegion: "Lazio",
    isVerified: false,
    isBlocked: false,
    rankingScore: 50.0,
    growthStage: "seed",
    createdAt: "2026-03-19T14:30:00Z",
  },
  {
    id: "pp-3",
    userId: "u-12",
    name: "Valentina Serra",
    email: "valentina.serra@example.com",
    alboNumber: "11223",
    alboRegion: "Toscana",
    isVerified: false,
    isBlocked: false,
    rankingScore: 50.0,
    growthStage: "seed",
    createdAt: "2026-03-18T11:15:00Z",
  },
  {
    id: "pp-4",
    userId: "u-13",
    name: "Alessandro Greco",
    email: "a.greco@example.com",
    alboNumber: "44556",
    alboRegion: "Campania",
    isVerified: true,
    isBlocked: false,
    rankingScore: 91.0,
    growthStage: "fioritura",
    createdAt: "2025-06-01T10:00:00Z",
  },
  {
    id: "pp-5",
    userId: "u-14",
    name: "Chiara Lombardi",
    email: "chiara.lombardi@example.com",
    alboNumber: "99001",
    alboRegion: "Piemonte",
    isVerified: true,
    isBlocked: true,
    rankingScore: 20.0,
    growthStage: "seed",
    createdAt: "2025-09-15T08:30:00Z",
  },
  {
    id: "pp-6",
    userId: "u-15",
    name: "Matteo Romano",
    email: "matteo.romano@example.com",
    alboNumber: "77889",
    alboRegion: "Sicilia",
    isVerified: true,
    isBlocked: false,
    rankingScore: 75.3,
    growthStage: "germoglio",
    createdAt: "2025-10-20T13:45:00Z",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ isVerified, isBlocked }: { isVerified: boolean; isBlocked: boolean }) {
  if (isBlocked) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-semibold bg-red-100 text-red-700">
        <XCircle size={11} /> Bloccato
      </span>
    );
  }
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-semibold bg-primary-100 text-primary-700">
        <CheckCircle2 size={11} /> Verificato
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-semibold bg-accent-100 text-accent-700">
      <UserX size={11} /> In attesa
    </span>
  );
}

function GrowthPill({ stage }: { stage: string }) {
  return (
    <span className="text-xs font-body text-text-secondary bg-bg-subtle px-2 py-0.5 rounded-md">
      {growthStages[stage] ?? stage}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "bg-primary-500" : score >= 50 ? "bg-secondary-400" : "bg-accent-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-bg-subtle rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-body font-medium text-text-secondary tabular-nums">{score.toFixed(0)}</span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminPsychologistsPage() {
  const { data: session, isPending } = useSession();
  const role = (session?.user as any)?.role;

  const [psychologists, setPsychologists] = useState<PsychologistRow[]>(MOCK_PSYCHOLOGISTS);
  const [filter, setFilter] = useState<VerifyFilter>("all");
  const [search, setSearch] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

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

  const filtered = psychologists.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.alboNumber.includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && p.isVerified && !p.isBlocked) ||
      (filter === "pending" && !p.isVerified && !p.isBlocked) ||
      (filter === "blocked" && p.isBlocked);

    return matchesSearch && matchesFilter;
  });

  async function handleToggleVerify(id: string, currentlyVerified: boolean) {
    setVerifyingId(id);
    try {
      // In production: await fetch("/api/admin/psychologists/verify", { method: "POST", body: JSON.stringify({ psychologistProfileId: id, verified: !currentlyVerified }) })
      // For now, update mock state
      setPsychologists((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isVerified: !currentlyVerified } : p,
        ),
      );
    } finally {
      setVerifyingId(null);
    }
  }

  function handleBlock(id: string) {
    setPsychologists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBlocked: true, isVerified: false } : p)),
    );
  }

  const filterOptions: { key: VerifyFilter; label: string }[] = [
    { key: "all", label: "Tutti" },
    { key: "verified", label: "Verificati" },
    { key: "pending", label: "In attesa" },
    { key: "blocked", label: "Bloccati" },
  ];

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wider mb-1">
          Amministrazione
        </p>
        <h1 className="text-2xl font-heading font-bold text-text">Gestione psicologi</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Verifica profili, gestisci blocchi e monitora i professionisti
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Cerca per nome, email, albo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-body text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-bg-subtle rounded-xl p-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors ${
                filter === opt.key
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-5 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Professionista
                </th>
                <th className="text-left px-4 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Albo
                </th>
                <th className="text-left px-4 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Stato
                </th>
                <th className="text-left px-4 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-4 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Fase
                </th>
                <th className="text-left px-4 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Iscrizione
                </th>
                <th className="text-right px-5 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm font-body text-text-secondary">
                    Nessun risultato trovato
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-heading font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, #5B8A72, #7A6EA0)" }}
                        >
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-text">{p.name}</p>
                          <p className="text-xs font-body text-text-secondary">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-body text-text">{p.alboNumber}</p>
                      <p className="text-xs font-body text-text-secondary">{p.alboRegion}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge isVerified={p.isVerified} isBlocked={p.isBlocked} />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar score={p.rankingScore} />
                    </td>
                    <td className="px-4 py-4">
                      <GrowthPill stage={p.growthStage} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-body text-text-secondary">{formatDate(p.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!p.isBlocked && (
                          <button
                            onClick={() => handleToggleVerify(p.id, p.isVerified)}
                            disabled={verifyingId === p.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-colors disabled:opacity-50 ${
                              p.isVerified
                                ? "bg-bg-subtle text-text-secondary hover:bg-border"
                                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                            }`}
                          >
                            <UserCheck size={12} />
                            {p.isVerified ? "Rimuovi verifica" : "Verifica"}
                          </button>
                        )}
                        {!p.isBlocked && (
                          <button
                            onClick={() => handleBlock(p.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <UserX size={12} />
                            Blocca
                          </button>
                        )}
                        <Link
                          href={`/p/${p.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold bg-bg-subtle text-text-secondary hover:bg-border transition-colors"
                        >
                          <ExternalLink size={12} />
                          Profilo
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm font-body text-text-secondary">
              Nessun risultato trovato
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-heading font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #5B8A72, #7A6EA0)" }}
                    >
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold text-text">{p.name}</p>
                      <p className="text-xs font-body text-text-secondary">{p.email}</p>
                    </div>
                  </div>
                  <StatusBadge isVerified={p.isVerified} isBlocked={p.isBlocked} />
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs font-body text-text-secondary">
                  <span>Albo {p.alboNumber} ({p.alboRegion})</span>
                  <GrowthPill stage={p.growthStage} />
                </div>
                <ScoreBar score={p.rankingScore} />
                <div className="flex gap-2 mt-3">
                  {!p.isBlocked && (
                    <button
                      onClick={() => handleToggleVerify(p.id, p.isVerified)}
                      className="flex-1 py-2 rounded-lg text-xs font-body font-semibold bg-primary-100 text-primary-700"
                    >
                      {p.isVerified ? "Rimuovi verifica" : "Verifica"}
                    </button>
                  )}
                  {!p.isBlocked && (
                    <button
                      onClick={() => handleBlock(p.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-body font-semibold bg-red-50 text-red-600"
                    >
                      Blocca
                    </button>
                  )}
                  <Link
                    href={`/p/${p.id}`}
                    target="_blank"
                    className="flex-1 py-2 rounded-lg text-xs font-body font-semibold bg-bg-subtle text-text-secondary text-center"
                  >
                    Profilo
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-bg-subtle">
            <p className="text-xs font-body text-text-secondary">
              {filtered.length} {filtered.length === 1 ? "professionista" : "professionisti"} trovati
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
