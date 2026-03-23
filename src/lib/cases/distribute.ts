/**
 * Case Distribution Engine
 *
 * When a case is created from a questionnaire, this module:
 * 1. Runs the matching engine against all eligible psychologists
 * 2. Creates candidacies for top matches
 * 3. Notifies matched psychologists
 * 4. Updates case status to 'matching'
 */

import { db } from "@/lib/db";
import {
  cases,
  candidacies,
  psychologistProfiles,
  penalties,
} from "@/lib/db/schema";
import { eq, and, isNull, gte, or, lte } from "drizzle-orm";
import { runMatchingEngine } from "@/lib/matching";
import type { PsychologistCandidate, UserMatchingInput } from "@/lib/matching";

export async function distributeCase(caseId: string): Promise<{
  distributedTo: number;
  topMatchIds: string[];
}> {
  // Fetch the case
  const caseResult = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseResult) {
    throw new Error(`Case ${caseId} not found`);
  }

  // Fetch all eligible psychologists
  const now = new Date();
  const allProfiles = await db.query.psychologistProfiles.findMany({
    where: and(
      eq(psychologistProfiles.isVerified, true),
      isNull(psychologistProfiles.deletedAt)
    ),
    with: { user: true },
  });

  // Check active lead blocks
  const activePenalties = await db.query.penalties.findMany({
    where: and(
      eq(penalties.isActive, true),
      eq(penalties.type, "lead_block"),
      lte(penalties.startsAt, now),
      or(isNull(penalties.endsAt), gte(penalties.endsAt, now))
    ),
  });

  const blockedIds = new Set(activePenalties.map((p) => p.psychologistProfileId));

  // Transform to matching candidates
  const candidates: PsychologistCandidate[] = allProfiles.map((pp) => ({
    id: pp.id,
    userId: pp.userId,
    treatedAreas: (pp.treatedAreas as string[]) || [],
    therapeuticApproaches: (pp.therapeuticApproaches as string[]) || [],
    targetPatients: (pp.targetPatients as string[]) || [],
    exclusions: (pp.exclusions as string[]) || [],
    modality: pp.modality,
    maxNewPatientsPerWeek: pp.maxNewPatientsPerWeek,
    currentCaseload: pp.currentCaseload,
    isVerified: pp.isVerified,
    rankingScore: pp.rankingScore,
    continuityRate: pp.continuityRate,
    conversionRate: pp.conversionRate,
    averageResponseTime: pp.averageResponseTime,
    growthStage: pp.growthStage,
    name: pp.user.name,
    shortBio: pp.shortBio,
    languages: (pp.languages as string[]) || ["it"],
    hasActiveLeadBlock: blockedIds.has(pp.id),
    createdAt: pp.createdAt,
  }));

  // Build user input from case
  const qData = caseResult.questionnaireData as Record<string, unknown>;
  const userInput: UserMatchingInput = {
    primaryProblems: (qData.primaryProblems as string[]) || [caseResult.primaryProblem],
    context: (qData.context as string[]) || [caseResult.context],
    intensity: caseResult.intensity,
    preferredModality: caseResult.preferredModality,
    preferredGender: caseResult.preferredGender,
    preferredApproaches: (caseResult.preferredApproaches as string[]) || [],
    urgency: ((qData.urgency as string) || "this_month") as UserMatchingInput["urgency"],
    previousTherapy: (qData.previousTherapy as boolean) || false,
    ageRange: (qData.ageRange as string) || "no_preference",
    referralPsychologistId: caseResult.referralPsychologistId,
  };

  // Run matching
  const result = runMatchingEngine(userInput, candidates);

  // All matches to distribute (top + additional + referral)
  const allMatches = [
    ...result.topMatches,
    ...result.additionalMatches,
  ];

  // Add referral if not already included
  if (
    result.referralMatch &&
    !allMatches.some((m) => m.psychologistId === result.referralMatch!.psychologistId)
  ) {
    allMatches.push(result.referralMatch);
  }

  // Create candidacies
  if (allMatches.length > 0) {
    await db.insert(candidacies).values(
      allMatches.map((match) => ({
        caseId,
        psychologistProfileId: match.psychologistId,
        compatibilityScore: match.score,
        scoreBreakdown: match.breakdown as unknown as Record<string, number>,
        status: "pending" as const,
      }))
    );
  }

  // Update case status
  await db
    .update(cases)
    .set({ status: "matching", updatedAt: new Date() })
    .where(eq(cases.id, caseId));

  const topMatchIds = result.topMatches.map((m) => m.psychologistId);

  return {
    distributedTo: allMatches.length,
    topMatchIds,
  };
}
