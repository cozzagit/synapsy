/* ============================================
   SYNAPSY — Core Type Definitions
   ============================================ */

// === ENUMS ===

export type UserRole = "user" | "psychologist" | "admin";

export type Modality = "online" | "in_person" | "both";

export type GenderPreference = "male" | "female" | "no_preference";

export type CaseStatus =
  | "pending"
  | "matching"
  | "matched"
  | "in_call"
  | "completed"
  | "expired"
  | "cancelled";

export type CandidacyStatus = "pending" | "accepted" | "rejected" | "expired";

export type MatchSelectionStatus =
  | "selected"
  | "call_scheduled"
  | "call_completed"
  | "continued"
  | "not_continued"
  | "disputed";

export type PaymentType = "selection_fee" | "continuity_fee";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CreditStatus = "available" | "used" | "expired";

export type GrowthStage =
  | "seed"
  | "germoglio"
  | "crescita"
  | "fioritura"
  | "radici";

export type BadgeTier = "foundation" | "quality" | "network";

export type PenaltyType =
  | "visibility_reduction"
  | "lead_block"
  | "suspension"
  | "removal";

export type DiscrepancySeverity = "minor" | "major" | "critical";

export type DiscrepancyResolution =
  | "pending"
  | "resolved_user"
  | "resolved_psychologist"
  | "penalty_applied"
  | "dismissed";

// === PROBLEM CATEGORIES ===

export const PROBLEM_CATEGORIES = [
  "anxiety",
  "depression",
  "stress",
  "burnout",
  "relationship",
  "family",
  "grief",
  "trauma",
  "self_esteem",
  "eating_disorders",
  "addiction",
  "sleep",
  "anger",
  "phobias",
  "ocd",
  "sexuality",
  "identity",
  "work_issues",
  "academic_issues",
  "parenting",
  "social_anxiety",
  "panic_attacks",
  "life_transitions",
  "chronic_illness",
  "other",
] as const;

export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number];

// === THERAPEUTIC APPROACHES ===

export const THERAPEUTIC_APPROACHES = [
  "cbt",
  "psychodynamic",
  "systemic",
  "humanistic",
  "gestalt",
  "emdr",
  "act",
  "dbt",
  "mindfulness",
  "psychoanalytic",
  "integrative",
  "solution_focused",
  "narrative",
  "art_therapy",
  "other",
] as const;

export type TherapyApproach = (typeof THERAPEUTIC_APPROACHES)[number];

// === QUESTIONNAIRE ===

export interface QuestionnaireResponse {
  primaryProblems: ProblemCategory[];
  context: string[];
  intensity: 1 | 2 | 3 | 4 | 5;
  preferredModality: Modality;
  preferredGender: GenderPreference;
  preferredApproaches: TherapyApproach[];
  urgency: "immediate" | "this_week" | "this_month" | "exploring";
  ageRange: "18_25" | "26_35" | "36_45" | "46_55" | "56_plus" | "no_preference";
  previousTherapy: boolean;
  additionalPreferences: Record<string, string>;
}

// === MATCHING ===

export interface ScoreBreakdown {
  problemAreaOverlap: number;
  approachCompatibility: number;
  availabilityAlignment: number;
  embeddingSimilarity: number;
  rankingScore: number;
  responseTimeScore: number;
  collaborativeFilteringScore: number;
  totalScore: number;
}

export interface MatchCandidate {
  psychologistProfileId: string;
  name: string;
  shortBio: string;
  treatedAreas: ProblemCategory[];
  therapeuticApproaches: TherapyApproach[];
  modality: Modality;
  compatibilityScore: number;
  scoreBreakdown: ScoreBreakdown;
  badges: string[];
  continuityRate: number;
  growthStage: GrowthStage;
  isReferral: boolean;
}

// === PSYCHOLOGIST DASHBOARD ===

export interface PsychologistMetrics {
  acquiredPatients: number;
  totalRevenue: number;
  totalCosts: number;
  availableCredits: number;
  netMargin: number;
  continuityRate: number;
  conversionRate: number;
  averageRelationshipDuration: number;
  rankingScore: number;
  growthStage: GrowthStage;
}
