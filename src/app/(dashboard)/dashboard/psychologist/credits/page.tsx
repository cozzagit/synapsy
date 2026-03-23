"use client";

import { useState } from "react";
import { Coins, Info, Clock, CheckCircle2, XCircle, Zap } from "lucide-react";
import { motion } from "motion/react";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type CreditStatus = "available" | "used" | "expired";
type CreditOrigin = "selection_fee" | "bonus" | "referral" | "milestone";

interface CreditRecord {
  id: string;
  earnedAt: Date;
  expiresAt: Date | null;
  origin: CreditOrigin;
  originLabel: string;
  status: CreditStatus;
  usedFor: string | null;
  usedAt: Date | null;
  amount: number; // number of credits (usually 1)
}

const MOCK_CREDITS: CreditRecord[] = [
  {
    id: "cr-1",
    earnedAt: new Date("2025-02-10"),
    expiresAt: new Date("2025-05-10"),
    origin: "selection_fee",
    originLabel: "Pagamento selezione",
    status: "available",
    usedFor: null,
    usedAt: null,
    amount: 1,
  },
  {
    id: "cr-2",
    earnedAt: new Date("2025-01-25"),
    expiresAt: new Date("2025-04-25"),
    origin: "selection_fee",
    originLabel: "Pagamento selezione",
    status: "available",
    usedFor: null,
    usedAt: null,
    amount: 1,
  },
  {
    id: "cr-3",
    earnedAt: new Date("2025-03-01"),
    expiresAt: new Date("2025-06-01"),
    origin: "milestone",
    originLabel: "Badge: Ascoltatore Empatico",
    status: "available",
    usedFor: null,
    usedAt: null,
    amount: 1,
  },
  {
    id: "cr-4",
    earnedAt: new Date("2024-12-15"),
    expiresAt: null,
    origin: "referral",
    originLabel: "Referral — Dott. Bianchi",
    status: "used",
    usedFor: "Candidatura caso MR-2025-01",
    usedAt: new Date("2025-01-10"),
    amount: 1,
  },
  {
    id: "cr-5",
    earnedAt: new Date("2024-11-01"),
    expiresAt: new Date("2025-02-01"),
    origin: "bonus",
    originLabel: "Bonus benvenuto",
    status: "expired",
    usedFor: null,
    usedAt: null,
    amount: 1,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<CreditStatus, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  available: { label: "Disponibile", icon: CheckCircle2, color: "text-primary-600", bg: "bg-primary-50" },
  used: { label: "Utilizzato", icon: Zap, color: "text-secondary-600", bg: "bg-secondary-50" },
  expired: { label: "Scaduto", icon: XCircle, color: "text-text-tertiary", bg: "bg-bg-subtle" },
};

const originConfig: Record<CreditOrigin, { color: string; bg: string }> = {
  selection_fee: { color: "text-primary-700", bg: "bg-primary-100" },
  bonus: { color: "text-accent-700", bg: "bg-accent-100" },
  referral: { color: "text-secondary-700", bg: "bg-secondary-100" },
  milestone: { color: "text-accent-600", bg: "bg-accent-50" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// How credits work
// ---------------------------------------------------------------------------

function HowCreditsWork() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-secondary-50 border border-secondary-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <Info size={18} className="text-secondary-600 shrink-0" />
        <span className="text-sm font-body font-semibold text-secondary-800 flex-1">
          Come funzionano i crediti?
        </span>
        <span className="text-secondary-500 text-lg leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-5"
        >
          <div className="flex flex-col gap-4 text-sm font-body text-secondary-800">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Come si guadagnano",
                  items: [
                    "Ogni volta che paghi la quota di selezione (€5) per candidarti a un caso, ricevi 1 credito",
                    "Badge di eccellenza sblocca crediti bonus",
                    "Referral di colleghi generano crediti extra",
                  ],
                },
                {
                  title: "Come si usano",
                  items: [
                    "1 credito = 1 candidatura gratuita a un caso",
                    "I crediti si scalano automaticamente prima della quota in denaro",
                    "Puoi candidarti senza crediti, pagando solo la quota standard",
                  ],
                },
                {
                  title: "Scadenza",
                  items: [
                    "I crediti da selezione scadono dopo 90 giorni",
                    "I crediti da bonus e referral non scadono",
                    "Ricevi una notifica 14 giorni prima della scadenza",
                  ],
                },
                {
                  title: "Priorità di utilizzo",
                  items: [
                    "Prima si usano i crediti in scadenza più vicina",
                    "Poi quelli più vecchi",
                    "Mai usati automaticamente senza conferma",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="bg-surface rounded-xl p-3">
                  <p className="font-semibold text-secondary-900 mb-2">{section.title}</p>
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-secondary-700">
                        <span className="mt-1 w-1 h-1 rounded-full bg-secondary-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CreditsPage() {
  const available = MOCK_CREDITS.filter((c) => c.status === "available");
  const soonExpiring = available.filter(
    (c) => c.expiresAt && daysUntil(c.expiresAt) <= 14
  );

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Crediti</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Usa i crediti per candidarti ai casi senza spesa aggiuntiva
        </p>
      </div>

      {/* Big count card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 text-white shadow-md relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-12 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-end justify-between">
          <div>
            <p className="text-primary-100 text-sm font-body mb-2">Crediti disponibili</p>
            <div className="flex items-end gap-3">
              <span className="text-7xl font-heading font-bold leading-none">
                {available.length}
              </span>
              <div className="mb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Coins size={16} className="text-primary-200" />
                  <span className="text-primary-100 text-sm font-body">
                    {available.length === 1 ? "credito" : "crediti"}
                  </span>
                </div>
                {soonExpiring.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                    <Clock size={11} />
                    {soonExpiring.length} in scadenza presto
                  </span>
                )}
              </div>
            </div>
          </div>
          <Coins size={56} className="text-white/20" />
        </div>
      </motion.div>

      {/* Expiring warning */}
      {soonExpiring.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 mb-6"
        >
          <Clock size={16} className="text-accent-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-body font-semibold text-accent-800">
              {soonExpiring.length} credito{soonExpiring.length > 1 ? "i" : ""} in scadenza entro 14 giorni
            </p>
            <p className="text-xs font-body text-accent-700 mt-0.5">
              Usali per candidarti a nuovi casi prima che scadano.
            </p>
          </div>
        </motion.div>
      )}

      {/* How credits work */}
      <div className="mb-6">
        <HowCreditsWork />
      </div>

      {/* Credits history */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-heading font-semibold text-text">Storico crediti</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                {["Data", "Origine", "Stato", "Usato per"].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_CREDITS.map((credit, index) => {
                const status = statusConfig[credit.status];
                const StatusIcon = status.icon;
                const orig = originConfig[credit.origin];

                return (
                  <motion.tr
                    key={credit.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors"
                  >
                    <td className="px-5 py-4 text-text-secondary whitespace-nowrap">
                      <div>{formatDate(credit.earnedAt)}</div>
                      {credit.expiresAt && credit.status === "available" && (
                        <div className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          Scade {formatDate(credit.expiresAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${orig.bg} ${orig.color}`}>
                        {credit.originLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-secondary text-xs">
                      {credit.usedFor ?? (credit.status === "available" ? "—" : "Non utilizzato")}
                      {credit.usedAt && (
                        <div className="text-text-tertiary mt-0.5">{formatDate(credit.usedAt)}</div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
