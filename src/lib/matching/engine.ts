/**
 * Synapsy Matching Engine v1
 *
 * Multi-stage pipeline:
 *   Stage 1: Hard Filter (eliminatory)
 *   Stage 2: Dimensional Scoring (weighted)
 *   Stage 3: Normalization & Ranking
 *   Stage 4: Referral Injection
 *   Stage 5: Diversity Injection
 *
 * "Il sistema propone pochi professionisti compatibili e disponibili"
 */

import {
  type UserMatchingInput,
  type PsychologistCandidate,
  type MatchResult,
  type MatchingOutput,
  type ScoreBreakdown,
  SCORING_WEIGHTS,
  MATCH_THRESHOLD,
  COLD_START_DAYS,
  COLD_START_MAX_BONUS,
} from "./types";

// ─── Stage 1: Hard Filter ────────────────────────────────────────────────────

function passesHardFilter(
  user: UserMatchingInput,
  psych: PsychologistCandidate
): boolean {
  // 1. Psychologist explicitly excludes user's primary problems
  const hasExcludedProblem = user.primaryProblems.some((problem) =>
    psych.exclusions.includes(problem)
  );
  if (hasExcludedProblem) return false;

  // 2. Modality mismatch
  if (
    user.preferredModality !== "both" &&
    psych.modality !== "both" &&
    user.preferredModality !== psych.modality
  ) {
    return false;
  }

  // 3. At max caseload
  if (psych.currentCaseload >= psych.maxNewPatientsPerWeek) return false;

  // 4. Lead block active
  if (psych.hasActiveLeadBlock) return false;

  // 5. Not verified (strict after Phase 1)
  if (!psych.isVerified) return false;

  // 6. Gender preference
  // Note: we don't have gender on PsychologistCandidate directly,
  // but it's inferred. For now, skip if "no_preference"
  // Gender filtering will be added when profile has gender field.

  return true;
}

// ─── Stage 2: Dimensional Scoring ────────────────────────────────────────────

function computeProblemAreaOverlap(
  userProblems: string[],
  psychAreas: string[]
): number {
  if (userProblems.length === 0) return 0;

  const matches = userProblems.filter((p) => psychAreas.includes(p));
  // Weighted: primary problem (first) counts more
  if (matches.length === 0) return 0;

  let score = 0;
  for (let i = 0; i < userProblems.length; i++) {
    const weight = i === 0 ? 0.5 : 0.5 / (userProblems.length - 1 || 1);
    if (psychAreas.includes(userProblems[i])) {
      score += weight;
    }
  }

  return Math.min(score, 1);
}

function computeApproachCompatibility(
  userApproaches: string[],
  psychApproaches: string[]
): number {
  // If user has no preference, give full score
  if (
    userApproaches.length === 0 ||
    userApproaches.includes("no_preference")
  ) {
    return 0.8; // slight penalty for "we don't know"
  }

  if (psychApproaches.length === 0) return 0.3;

  const matches = userApproaches.filter((a) => psychApproaches.includes(a));
  return matches.length / userApproaches.length;
}

function computeAvailabilityAlignment(
  urgency: string,
  currentCaseload: number,
  maxCapacity: number
): number {
  const capacityRatio = 1 - currentCaseload / maxCapacity;

  // Weight by urgency
  const urgencyMultiplier: Record<string, number> = {
    immediate: 1.5,
    this_week: 1.2,
    this_month: 1.0,
    exploring: 0.8,
  };

  const multiplier = urgencyMultiplier[urgency] ?? 1.0;
  return Math.min(capacityRatio * multiplier, 1);
}

function computeRankingBonus(rankingScore: number): number {
  // rankingScore is 0-100, normalize to 0-1
  return rankingScore / 100;
}

function computeResponseTimeBonus(avgResponseTimeHours: number): number {
  // Under 4 hours = perfect, degrades linearly to 24 hours = 0
  if (avgResponseTimeHours <= 0) return 0.5; // no data
  if (avgResponseTimeHours <= 4) return 1;
  if (avgResponseTimeHours >= 24) return 0;
  return 1 - (avgResponseTimeHours - 4) / 20;
}

function computeColdStartBonus(createdAt: Date): number {
  const daysSinceCreation =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceCreation >= COLD_START_DAYS) return 0;

  // Linear decay from MAX_BONUS to 0 over COLD_START_DAYS
  return COLD_START_MAX_BONUS * (1 - daysSinceCreation / COLD_START_DAYS);
}

function computeScore(
  user: UserMatchingInput,
  psych: PsychologistCandidate
): ScoreBreakdown {
  const problemAreaOverlap = computeProblemAreaOverlap(
    user.primaryProblems,
    psych.treatedAreas
  );

  const approachCompatibility = computeApproachCompatibility(
    user.preferredApproaches,
    psych.therapeuticApproaches
  );

  const availabilityAlignment = computeAvailabilityAlignment(
    user.urgency,
    psych.currentCaseload,
    psych.maxNewPatientsPerWeek
  );

  const rankingBonus = computeRankingBonus(psych.rankingScore);
  const responseTimeBonus = computeResponseTimeBonus(
    psych.averageResponseTime
  );
  const coldStartBonus = computeColdStartBonus(psych.createdAt);

  const totalScore =
    problemAreaOverlap * SCORING_WEIGHTS.problemAreaOverlap +
    approachCompatibility * SCORING_WEIGHTS.approachCompatibility +
    availabilityAlignment * SCORING_WEIGHTS.availabilityAlignment +
    rankingBonus * SCORING_WEIGHTS.rankingBonus +
    responseTimeBonus * SCORING_WEIGHTS.responseTimeBonus +
    coldStartBonus * SCORING_WEIGHTS.coldStartBonus;

  return {
    problemAreaOverlap,
    approachCompatibility,
    availabilityAlignment,
    rankingBonus,
    responseTimeBonus,
    coldStartBonus,
    totalScore: Math.min(totalScore, 1), // cap at 1
  };
}

// ─── Stage 5: Diversity Injection ────────────────────────────────────────────

function injectDiversity(matches: MatchResult[], candidates: Map<string, PsychologistCandidate>): MatchResult[] {
  if (matches.length <= 2) return matches;

  const top3 = matches.slice(0, 3);
  const rest = matches.slice(3);

  // Check if top 3 all share the same primary approach
  const getApproaches = (m: MatchResult) => {
    const psych = candidates.get(m.psychologistId);
    return psych?.therapeuticApproaches ?? [];
  };

  const approaches0 = getApproaches(top3[0]);
  const approaches1 = getApproaches(top3[1]);
  const approaches2 = getApproaches(top3[2]);

  // Find dominant approach (appears in all 3)
  const commonApproaches = approaches0.filter(
    (a) => approaches1.includes(a) && approaches2.includes(a)
  );

  if (commonApproaches.length > 0 && rest.length > 0) {
    // Find highest-scoring candidate from rest with different approach
    const diverse = rest.find((m) => {
      const mApproaches = getApproaches(m);
      return !commonApproaches.some((ca) => mApproaches.includes(ca));
    });

    if (diverse) {
      // Swap #3 with the diverse candidate
      const swapped = top3[2];
      top3[2] = diverse;
      return [...top3, swapped, ...rest.filter((m) => m !== diverse)];
    }
  }

  return matches;
}

// ─── Main Engine ─────────────────────────────────────────────────────────────

export function runMatchingEngine(
  user: UserMatchingInput,
  candidates: PsychologistCandidate[]
): MatchingOutput {
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));

  // Stage 1: Hard Filter
  const passedFilter = candidates.filter((c) => passesHardFilter(user, c));

  // Stage 2 & 3: Score and Rank
  let results: MatchResult[] = passedFilter
    .map((psych) => {
      const breakdown = computeScore(user, psych);
      return {
        psychologistId: psych.id,
        score: breakdown.totalScore,
        breakdown,
        isReferral: psych.id === user.referralPsychologistId,
        passedHardFilter: true,
      };
    })
    .sort((a, b) => b.score - a.score);

  // Stage 4: Referral Injection
  let referralMatch: MatchResult | null = null;

  if (user.referralPsychologistId) {
    const existingReferral = results.find((r) => r.isReferral);

    if (existingReferral) {
      referralMatch = existingReferral;
    } else {
      // Referral didn't pass hard filter — compute score anyway
      const referralPsych = candidateMap.get(user.referralPsychologistId);
      if (referralPsych) {
        const breakdown = computeScore(user, referralPsych);
        referralMatch = {
          psychologistId: referralPsych.id,
          score: breakdown.totalScore,
          breakdown,
          isReferral: true,
          passedHardFilter: false,
        };
      }
    }
  }

  // Stage 5: Diversity Injection
  results = injectDiversity(results, candidateMap);

  // Split into top 3 + additional
  const topMatches = results.slice(0, 3);
  const additionalMatches = results
    .slice(3)
    .filter((r) => r.score >= MATCH_THRESHOLD);

  // Ensure referral is in top matches if it passed filter
  if (
    referralMatch &&
    referralMatch.passedHardFilter &&
    !topMatches.some((m) => m.isReferral)
  ) {
    // Add to top matches without displacing others
    topMatches.push(referralMatch);
  }

  return {
    topMatches,
    additionalMatches,
    referralMatch,
    totalCandidatesEvaluated: candidates.length,
    totalPassedHardFilter: passedFilter.length,
  };
}

// ─── Score Explanation (for UI) ──────────────────────────────────────────────

export function explainScore(breakdown: ScoreBreakdown): string[] {
  const explanations: string[] = [];

  if (breakdown.problemAreaOverlap >= 0.8) {
    explanations.push("Specializzazione molto rilevante per le tue esigenze");
  } else if (breakdown.problemAreaOverlap >= 0.5) {
    explanations.push("Buona esperienza nelle aree indicate");
  }

  if (breakdown.approachCompatibility >= 0.8) {
    explanations.push("Approccio terapeutico in linea con le tue preferenze");
  }

  if (breakdown.availabilityAlignment >= 0.7) {
    explanations.push("Ampia disponibilità per nuovi pazienti");
  }

  if (breakdown.rankingBonus >= 0.7) {
    explanations.push("Alto tasso di continuità terapeutica");
  }

  if (breakdown.responseTimeBonus >= 0.8) {
    explanations.push("Tempi di risposta molto rapidi");
  }

  if (breakdown.coldStartBonus > 0) {
    explanations.push("Nuovo sulla piattaforma, motivato ad accogliere");
  }

  return explanations;
}
