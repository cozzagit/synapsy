"use client";

import { useState } from "react";
import { Inbox, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CaseCard, type CaseCardData, type CaseStatus } from "@/components/dashboard/case-card";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CASES: CaseCardData[] = [
  {
    id: "c-1",
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
    id: "c-2",
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
  {
    id: "c-3",
    anonymousDescription:
      "Adolescente 17 anni accompagnato dai genitori. Mostra segni di ritiro sociale e calo del rendimento scolastico negli ultimi 2 mesi.",
    primaryProblem: "Disagio adolescenziale",
    intensity: 3,
    modality: "presenziale",
    compatibilityScore: 78,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    keyAttributes: ["Adolescente", "Famiglia", "Scuola"],
    status: "accepted",
  },
  {
    id: "c-4",
    anonymousDescription:
      "Adulto 42 anni in fase post-separazione coniugale. Riporta difficoltà nel gestire le emozioni e nell'affrontare il cambiamento.",
    primaryProblem: "Separazione e lutto relazionale",
    intensity: 4,
    modality: "online",
    compatibilityScore: 88,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    keyAttributes: ["Coppia", "Adulto", "Cambiamento"],
    status: "accepted",
  },
  {
    id: "c-5",
    anonymousDescription:
      "Giovane adulta 24 anni, segnala stati depressivi ciclici. Ha già una diagnosi di disturbo dell'umore in anamnesi.",
    primaryProblem: "Disturbo dell'umore",
    intensity: 5,
    modality: "online",
    compatibilityScore: 67,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    keyAttributes: ["Depressione", "Diagnosi pregressa", "Giovane adulta"],
    status: "rejected",
  },
  {
    id: "c-6",
    anonymousDescription:
      "Persona 55 anni con difficoltà legate al pensionamento imminente. Sensazione di perdita di identità e scopo.",
    primaryProblem: "Crisi di mezza età / transizione",
    intensity: 2,
    modality: "presenziale",
    compatibilityScore: 82,
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    keyAttributes: ["Lavoro", "Identità", "Over 50"],
    status: "completed",
  },
];

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
// Page
// ---------------------------------------------------------------------------

export default function CasesPage() {
  const [cases, setCases] = useState<CaseCardData[]>(MOCK_CASES);
  const [activeTab, setActiveTab] = useState<FilterTab>("tutti");

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

      {/* Filter tabs */}
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

      {/* Case list */}
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
              Nessun caso in questa categoria
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
    </div>
  );
}
