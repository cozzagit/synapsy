"use client";

import { useState } from "react";
import { Search, FolderOpen, ShieldAlert, Clock } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type UserStatus = "active" | "inactive" | "suspended";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "user" | "psychologist" | "admin";
  casesCount: number;
  status: UserStatus;
  createdAt: string;
  lastActiveAt: string | null;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_USERS: UserRow[] = [
  {
    id: "u-1", name: "Marco Rossi", email: "marco.rossi@example.com",
    role: "user", casesCount: 2, status: "active",
    createdAt: "2026-03-22T14:30:00Z", lastActiveAt: "2026-03-23T08:10:00Z",
  },
  {
    id: "u-2", name: "Giulia Ferretti", email: "giulia.ferretti@example.com",
    role: "psychologist", casesCount: 0, status: "active",
    createdAt: "2026-03-22T11:00:00Z", lastActiveAt: "2026-03-22T18:30:00Z",
  },
  {
    id: "u-3", name: "Andrea Conti", email: "andrea.conti@example.com",
    role: "user", casesCount: 1, status: "active",
    createdAt: "2026-03-21T17:45:00Z", lastActiveAt: "2026-03-22T12:00:00Z",
  },
  {
    id: "u-4", name: "Sara Bianchi", email: "sara.bianchi@example.com",
    role: "user", casesCount: 3, status: "active",
    createdAt: "2026-03-21T09:20:00Z", lastActiveAt: "2026-03-21T22:00:00Z",
  },
  {
    id: "u-5", name: "Luca Moretti", email: "luca.moretti@example.com",
    role: "psychologist", casesCount: 0, status: "inactive",
    createdAt: "2026-03-20T16:10:00Z", lastActiveAt: null,
  },
  {
    id: "u-6", name: "Francesca De Luca", email: "fde.luca@example.com",
    role: "user", casesCount: 0, status: "inactive",
    createdAt: "2026-03-18T10:00:00Z", lastActiveAt: null,
  },
  {
    id: "u-7", name: "Paolo Esposito", email: "p.esposito@example.com",
    role: "user", casesCount: 4, status: "suspended",
    createdAt: "2025-12-05T08:00:00Z", lastActiveAt: "2026-02-10T14:30:00Z",
  },
  {
    id: "u-8", name: "Marta Colombo", email: "marta.colombo@example.com",
    role: "user", casesCount: 1, status: "active",
    createdAt: "2026-01-15T12:00:00Z", lastActiveAt: "2026-03-23T06:00:00Z",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function formatRelative(iso: string | null): string {
  if (!iso) return "Mai";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Meno di 1h fa";
  if (hours < 24) return `${hours}h fa`;
  if (days === 1) return "Ieri";
  if (days < 7) return `${days} giorni fa`;
  return formatDate(iso);
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRow["role"] }) {
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

function StatusDot({ status }: { status: UserStatus }) {
  const map = {
    active: { color: "bg-primary-500", label: "Attivo" },
    inactive: { color: "bg-border", label: "Inattivo" },
    suspended: { color: "bg-red-500", label: "Sospeso" },
  };
  const s = map[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${s.color}`} />
      <span className="text-xs font-body text-text-secondary">{s.label}</span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [isAdmin] = useState(true);

  if (!isAdmin) {
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

  const filtered = MOCK_USERS.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-body font-semibold text-primary-600 uppercase tracking-wider mb-1">
          Amministrazione
        </p>
        <h1 className="text-2xl font-heading font-bold text-text">Gestione utenti</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Tutti gli utenti registrati sulla piattaforma
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Totale", count: MOCK_USERS.length, color: "bg-bg-subtle text-text-secondary" },
          { label: "Attivi", count: MOCK_USERS.filter((u) => u.status === "active").length, color: "bg-primary-100 text-primary-700" },
          { label: "Inattivi", count: MOCK_USERS.filter((u) => u.status === "inactive").length, color: "bg-bg-subtle text-text-secondary" },
          { label: "Sospesi", count: MOCK_USERS.filter((u) => u.status === "suspended").length, color: "bg-red-100 text-red-700" },
        ].map((chip) => (
          <div key={chip.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body font-semibold ${chip.color}`}>
            {chip.label}
            <span className="font-heading font-bold">{chip.count}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Cerca per nome o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-body text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                {["Utente", "Ruolo", "Casi", "Stato", "Iscrizione", "Ultima attività"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-body font-semibold text-text-secondary uppercase tracking-wider first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-body text-text-secondary">
                    Nessun utente trovato
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-bg-subtle transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-heading font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, #5B8A72, #7A6EA0)" }}
                        >
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-text">{u.name}</p>
                          <p className="text-xs font-body text-text-secondary">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-body text-text-secondary">
                        <FolderOpen size={14} />
                        <span>{u.casesCount}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusDot status={u.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-body text-text-secondary">{formatDate(u.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-body text-text-secondary">
                        <Clock size={13} />
                        {formatRelative(u.lastActiveAt)}
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
              Nessun utente trovato
            </div>
          ) : (
            filtered.map((u) => (
              <div key={u.id} className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-heading font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg, #5B8A72, #7A6EA0)" }}
                  >
                    {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-semibold text-text truncate">{u.name}</p>
                    <p className="text-xs font-body text-text-secondary truncate">{u.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <RoleBadge role={u.role} />
                      <StatusDot status={u.status} />
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-1 text-xs font-body text-text-secondary mb-1">
                    <FolderOpen size={12} />
                    {u.casesCount} casi
                  </div>
                  <p className="text-xs font-body text-text-secondary">{formatDate(u.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-bg-subtle">
            <p className="text-xs font-body text-text-secondary">
              {filtered.length} {filtered.length === 1 ? "utente" : "utenti"} trovati
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
