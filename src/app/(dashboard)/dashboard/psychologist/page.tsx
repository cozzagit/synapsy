"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Euro,
  Coins,
  Heart,
  Sprout,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { motion } from "motion/react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CaseCard, type CaseCardData } from "@/components/dashboard/case-card";
import { ActivityTimeline, type ActivityEvent } from "@/components/dashboard/activity-timeline";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface GrowthStageData {
  name: string;
  description: string;
  progressPercent: number;
  nextStage: string;
  metrics: Array<{ label: string; value: string }>;
}

const MOCK_GROWTH: GrowthStageData = {
  name: "Esploratore",
  description: "Stai costruendo la tua reputazione sulla piattaforma",
  progressPercent: 62,
  nextStage: "In Crescita",
  metrics: [
    { label: "Pazienti acquisiti", value: "4" },
    { label: "Tasso di continuità", value: "75%" },
    { label: "Valutazione media", value: "4.8 ★" },
    { label: "Candidature accettate", value: "6" },
  ],
};

const MOCK_INCOMING_CASES: CaseCardData[] = [
  {
    id: "case-1",
    anonymousDescription:
      "Persona adulta, 28 anni, segnala difficoltà nella gestione dell'ansia in contesti lavorativi e sociali. Riferisce episodi di attacchi di panico nelle ultime 3 settimane.",
    primaryProblem: "Ansia e attacchi di panico",
    intensity: 4,
    modality: "online",
    compatibilityScore: 91,
    postedAt: new Date(Date.now() - 1000 * 60 * 45),
    keyAttributes: ["Lavoro", "Relazioni sociali", "Urgenza moderata"],
    status: "pending",
  },
  {
    id: "case-2",
    anonymousDescription:
      "Persona di 35 anni che attraversa un periodo di bassa autostima e difficoltà nelle relazioni intime. Ha già avuto esperienze di terapia in passato.",
    primaryProblem: "Autostima e relazioni",
    intensity: 3,
    modality: "ibrido",
    compatibilityScore: 84,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    keyAttributes: ["Esperienza terapeutica", "Relazioni", "Adulto"],
    status: "pending",
  },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "act-1",
    type: "new_match",
    title: "Nuovo match confermato",
    description: "Il paziente M.R. ha accettato la tua candidatura",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: "act-2",
    type: "payment",
    title: "Pagamento ricevuto",
    description: "Quota di continuità — €120,00",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "act-3",
    type: "badge_earned",
    title: "Badge ottenuto: Ascoltatore Empatico",
    description: "Hai completato 5 sessioni con valutazione 5 stelle",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "act-4",
    type: "case_accepted",
    title: "Candidatura inviata",
    description: "Caso: Ansia lavorativa — in attesa di risposta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "act-5",
    type: "rating_received",
    title: "Nuova valutazione ricevuta",
    description: "5 stelle — «Professionale e molto empatica»",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

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
          <span>Esploratore</span>
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
  const [cases, setCases] = useState<CaseCardData[]>(MOCK_INCOMING_CASES);

  function handleAccept(id: string) {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "accepted" as const } : c))
    );
  }

  function handleReject(id: string) {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c))
    );
  }

  const pendingCases = cases.filter((c) => c.status === "pending");

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text">Buongiorno, Marta 👋</h1>
        <p className="text-sm font-body text-text-secondary mt-1">
          Ecco un riepilogo della tua attività su Synapsy
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pazienti acquisiti"
          value={4}
          trend="up"
          trendLabel="+2 rispetto al mese scorso"
          icon={<Users size={18} />}
          variant="primary"
        />
        <StatCard
          label="Fatturato generato"
          value="480"
          prefix="€"
          trend="up"
          trendLabel="+€120 rispetto al mese scorso"
          icon={<Euro size={18} />}
          variant="secondary"
        />
        <StatCard
          label="Crediti disponibili"
          value={3}
          trend="neutral"
          trendLabel="1 in scadenza tra 14 giorni"
          icon={<Coins size={18} />}
          variant="accent"
        />
        <StatCard
          label="Tasso di continuità"
          value=""
          icon={<Heart size={18} />}
          variant="primary"
          extra={<ContinuityArc percent={75} />}
          trend="up"
          trendLabel="In crescita"
        />
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
                {pendingCases.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-100 text-accent-700 text-xs font-body font-bold">
                    {pendingCases.length}
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

            {pendingCases.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface rounded-2xl border border-border p-10 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-bg-subtle flex items-center justify-center mb-3">
                  <Inbox size={26} className="text-text-tertiary" />
                </div>
                <p className="text-sm font-body font-medium text-text-secondary">
                  Nessun caso in arrivo al momento
                </p>
                <p className="text-xs font-body text-text-tertiary mt-1">
                  Ti notificheremo non appena un nuovo caso compatibile sarà disponibile
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingCases.map((c) => (
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
            <ActivityTimeline events={MOCK_ACTIVITY} maxItems={5} showViewAll />
          </section>
        </div>

        {/* Right column: growth garden */}
        <div className="flex flex-col gap-6">
          <GrowthGarden data={MOCK_GROWTH} />

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
