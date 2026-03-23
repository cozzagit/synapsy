/**
 * Synapsy Matching Engine — Type Definitions
 *
 * The matching engine is the intellectual core of Synapsy.
 * It must be precise (right matches), fair (meritocratic),
 * and explainable (users understand why).
 */

export interface UserMatchingInput {
  primaryProblems: string[];
  context: string[];
  intensity: number; // 1-5
  preferredModality: "online" | "in_person" | "both";
  preferredGender: "male" | "female" | "no_preference";
  preferredApproaches: string[];
  urgency: "immediate" | "this_week" | "this_month" | "exploring";
  previousTherapy: boolean;
  ageRange: string;
  referralPsychologistId?: string | null;
}

export interface PsychologistCandidate {
  id: string;
  userId: string;
  treatedAreas: string[];
  therapeuticApproaches: string[];
  targetPatients: string[];
  exclusions: string[];
  modality: "online" | "in_person" | "both";
  maxNewPatientsPerWeek: number;
  currentCaseload: number;
  isVerified: boolean;
  rankingScore: number;
  continuityRate: number;
  conversionRate: number;
  averageResponseTime: number;
  growthStage: string;
  name: string;
  shortBio: string;
  languages: string[];
  // Penalties
  hasActiveLeadBlock: boolean;
  // Timestamps
  createdAt: Date;
}

export interface ScoreBreakdown {
  problemAreaOverlap: number;
  approachCompatibility: number;
  availabilityAlignment: number;
  rankingBonus: number;
  responseTimeBonus: number;
  coldStartBonus: number;
  totalScore: number;
}

export interface MatchResult {
  psychologistId: string;
  score: number;
  breakdown: ScoreBreakdown;
  isReferral: boolean;
  passedHardFilter: boolean;
}

export interface MatchingOutput {
  topMatches: MatchResult[]; // top 3
  additionalMatches: MatchResult[]; // above threshold
  referralMatch: MatchResult | null; // always present if referral
  totalCandidatesEvaluated: number;
  totalPassedHardFilter: number;
}

// Weights for dimensional scoring
export const SCORING_WEIGHTS = {
  problemAreaOverlap: 0.30,
  approachCompatibility: 0.20,
  availabilityAlignment: 0.15,
  rankingBonus: 0.15,
  responseTimeBonus: 0.10,
  coldStartBonus: 0.10,
} as const;

// Minimum score to be included in results
export const MATCH_THRESHOLD = 0.45;

// Cold start parameters
export const COLD_START_DAYS = 30;
export const COLD_START_MAX_BONUS = 0.15;
export const COLD_START_MIN_PRESENTATIONS = 20;
