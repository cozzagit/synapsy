"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PsychologistCard } from "@/components/matching";

interface MatchData {
  psychologistId: string;
  name: string;
  shortBio: string;
  treatedAreas: string[];
  therapeuticApproaches: string[];
  modality: string;
  score: number;
  breakdown: {
    problemAreaOverlap: number;
    approachCompatibility: number;
    availabilityAlignment: number;
    rankingBonus: number;
    responseTimeBonus: number;
    coldStartBonus: number;
    totalScore: number;
  };
  continuityRate: number;
  growthStage: string;
  isReferral: boolean;
  explanations: string[];
}

interface MatchingResponse {
  data: {
    caseId: string;
    topMatches: MatchData[];
    additionalMatches: MatchData[];
    referralMatch: MatchData | null;
    stats: {
      totalEvaluated: number;
      totalPassed: number;
    };
  };
}

export default function MatchingResultsPage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<MatchingResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/matching/${params.caseId}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Errore durante il matching");
        }
        const json = (await res.json()) as MatchingResponse;
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [params.caseId]);

  const handleSelect = (psychologistId: string) => {
    setSelectedId(psychologistId);
    // TODO: POST to /api/matching/select
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200"
        >
          <Brain className="h-10 w-10 text-primary-600" />
        </motion.div>
        <h2 className="font-heading text-xl font-bold text-text">
          Stiamo cercando i professionisti migliori
        </h2>
        <p className="mt-2 text-text-secondary">
          Analisi della compatibilità in corso...
        </p>
        <Loader2 className="mt-4 h-5 w-5 animate-spin text-primary-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="font-heading text-xl font-bold text-text">
            Si è verificato un errore
          </h2>
          <p className="mt-2 text-text-secondary">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  const allMatches = [
    ...(data?.topMatches ?? []),
    ...(data?.additionalMatches ?? []),
  ];

  // No matches
  if (allMatches.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
        <div className="mx-auto max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br from-accent-100 to-primary-100"
          />
          <h2 className="font-heading text-xl font-bold text-text">
            Stiamo cercando il professionista adatto
          </h2>
          <p className="mt-3 text-text-secondary">
            Al momento non abbiamo trovato professionisti con alta
            compatibilità per le tue esigenze. Ti avviseremo non appena ci
            saranno nuove disponibilità.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary-100 opacity-20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[300px] w-[300px] rounded-full bg-secondary-100 opacity-15 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
            I professionisti più adatti a te
          </h1>
          <p className="mt-2 text-text-secondary">
            Abbiamo analizzato {data?.stats.totalEvaluated ?? 0} professionisti.
            Ecco i risultati.
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            Puoi selezionare fino a 2 professionisti a settimana
          </p>
        </motion.div>

        {/* Match cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {allMatches.map((match, index) => (
              <PsychologistCard
                key={match.psychologistId}
                name={match.name}
                shortBio={match.shortBio}
                treatedAreas={match.treatedAreas}
                therapeuticApproaches={match.therapeuticApproaches}
                modality={match.modality}
                score={match.score}
                breakdown={match.breakdown}
                continuityRate={match.continuityRate}
                growthStage={match.growthStage}
                isReferral={match.isReferral}
                explanations={match.explanations}
                onSelect={() => handleSelect(match.psychologistId)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Selected confirmation */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-4 right-4 mx-auto max-w-lg rounded-2xl bg-primary-600 p-4 text-center text-white shadow-xl"
            >
              <p className="font-heading font-semibold">
                Ottima scelta! Stiamo organizzando la call conoscitiva.
              </p>
              <p className="mt-1 text-sm text-primary-100">
                Riceverai una notifica con i dettagli.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
