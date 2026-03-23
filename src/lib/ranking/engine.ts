/**
 * Synapsy Ranking Engine
 *
 * Computes and updates psychologist rankings based on:
 * - Continuity rate (patients who continue after intro call)
 * - Conversion rate (candidacies that result in selection)
 * - Payment reliability (on-time payment ratio)
 * - Discrepancy score (inverse — fewer discrepancies = better)
 * - Activity score (responsiveness and engagement)
 *
 * Rankings are snapshotted daily into ranking_history.
 * The ranking score (0-100) directly affects matching visibility.
 */

import { db } from "@/lib/db";
import {
  psychologistProfiles,
  matchSelections,
  candidacies,
  payments,
  discrepancies,
  rankingHistory,
} from "@/lib/db/schema";
import { eq, and, gte, sql, count } from "drizzle-orm";

export interface RankingComponents {
  continuityRate: number; // 0-1
  conversionRate: number; // 0-1
  paymentReliability: number; // 0-1
  discrepancyScore: number; // 0-1 (1 = no discrepancies)
  activityScore: number; // 0-1
}

const RANKING_WEIGHTS = {
  continuityRate: 0.35,
  conversionRate: 0.20,
  paymentReliability: 0.20,
  discrepancyScore: 0.15,
  activityScore: 0.10,
};

export function computeRankingScore(components: RankingComponents): number {
  const weighted =
    components.continuityRate * RANKING_WEIGHTS.continuityRate +
    components.conversionRate * RANKING_WEIGHTS.conversionRate +
    components.paymentReliability * RANKING_WEIGHTS.paymentReliability +
    components.discrepancyScore * RANKING_WEIGHTS.discrepancyScore +
    components.activityScore * RANKING_WEIGHTS.activityScore;

  // Scale to 0-100
  return Math.round(weighted * 100);
}

export async function computeRankingForPsychologist(
  psychologistProfileId: string
): Promise<RankingComponents> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Continuity rate: continued / total call_completed
  const matchStats = await db
    .select({
      total: count(),
      continued: sql<number>`count(*) filter (where ${matchSelections.status} = 'continued')`,
      completed: sql<number>`count(*) filter (where ${matchSelections.status} in ('call_completed', 'continued', 'not_continued'))`,
    })
    .from(matchSelections)
    .where(
      and(
        eq(matchSelections.psychologistProfileId, psychologistProfileId),
        gte(matchSelections.createdAt, thirtyDaysAgo)
      )
    );

  const totalCompleted = Number(matchStats[0]?.completed ?? 0);
  const totalContinued = Number(matchStats[0]?.continued ?? 0);
  const continuityRate = totalCompleted > 0 ? totalContinued / totalCompleted : 0.5; // neutral for new

  // Conversion rate: selected / total candidacies accepted
  const candidacyStats = await db
    .select({
      accepted: sql<number>`count(*) filter (where ${candidacies.status} = 'accepted')`,
      selected: sql<number>`count(*) filter (where ${candidacies.id} in (
        select ${matchSelections.candidacyId} from ${matchSelections}
      ))`,
    })
    .from(candidacies)
    .where(
      and(
        eq(candidacies.psychologistProfileId, psychologistProfileId),
        gte(candidacies.createdAt, thirtyDaysAgo)
      )
    );

  const totalAccepted = Number(candidacyStats[0]?.accepted ?? 0);
  const totalSelected = Number(candidacyStats[0]?.selected ?? 0);
  const conversionRate = totalAccepted > 0 ? totalSelected / totalAccepted : 0.5;

  // Payment reliability: paid on time / total due
  const paymentStats = await db
    .select({
      total: count(),
      paid: sql<number>`count(*) filter (where ${payments.status} = 'paid')`,
    })
    .from(payments)
    .where(
      and(
        eq(payments.psychologistProfileId, psychologistProfileId),
        gte(payments.createdAt, thirtyDaysAgo)
      )
    );

  const totalPayments = Number(paymentStats[0]?.total ?? 0);
  const paidPayments = Number(paymentStats[0]?.paid ?? 0);
  const paymentReliability = totalPayments > 0 ? paidPayments / totalPayments : 1; // perfect if no payments due

  // Discrepancy score: 1 - (discrepancies / total verifications)
  const discrepancyStats = await db
    .select({
      total: count(),
    })
    .from(discrepancies)
    .innerJoin(
      matchSelections,
      eq(discrepancies.matchSelectionId, matchSelections.id)
    )
    .where(
      and(
        eq(matchSelections.psychologistProfileId, psychologistProfileId),
        gte(discrepancies.createdAt, thirtyDaysAgo)
      )
    );

  const totalDiscrepancies = Number(discrepancyStats[0]?.total ?? 0);
  const discrepancyScore =
    totalCompleted > 0
      ? Math.max(0, 1 - totalDiscrepancies / totalCompleted)
      : 1;

  // Activity score: based on response time and candidacy rate
  // For now, use average response time from profile
  const profile = await db.query.psychologistProfiles.findFirst({
    where: eq(psychologistProfiles.id, psychologistProfileId),
  });

  const avgResponseHours = profile?.averageResponseTime ?? 12;
  const activityScore = avgResponseHours <= 4 ? 1 : avgResponseHours >= 24 ? 0.2 : 1 - (avgResponseHours - 4) / 25;

  return {
    continuityRate,
    conversionRate,
    paymentReliability,
    discrepancyScore,
    activityScore,
  };
}

export async function updatePsychologistRanking(
  psychologistProfileId: string
): Promise<number> {
  const components = await computeRankingForPsychologist(psychologistProfileId);
  const score = computeRankingScore(components);

  // Update profile
  await db
    .update(psychologistProfiles)
    .set({
      rankingScore: score,
      continuityRate: components.continuityRate,
      conversionRate: components.conversionRate,
      updatedAt: new Date(),
    })
    .where(eq(psychologistProfiles.id, psychologistProfileId));

  // Snapshot to history
  const today = new Date().toISOString().split("T")[0];
  await db
    .insert(rankingHistory)
    .values({
      psychologistProfileId,
      rankingScore: score,
      continuityRate: components.continuityRate,
      conversionRate: components.conversionRate,
      paymentReliability: components.paymentReliability,
      discrepancyScore: components.discrepancyScore,
      activityScore: components.activityScore,
      snapshotDate: today,
    })
    .onConflictDoUpdate({
      target: [rankingHistory.psychologistProfileId, rankingHistory.snapshotDate],
      set: {
        rankingScore: score,
        continuityRate: components.continuityRate,
        conversionRate: components.conversionRate,
        paymentReliability: components.paymentReliability,
        discrepancyScore: components.discrepancyScore,
        activityScore: components.activityScore,
      },
    });

  return score;
}

// Determine growth stage based on time and quality
export function computeGrowthStage(
  monthsOnPlatform: number,
  rankingScore: number
): "seed" | "germoglio" | "crescita" | "fioritura" | "radici" {
  if (monthsOnPlatform >= 24 && rankingScore >= 70) return "radici";
  if (monthsOnPlatform >= 12 && rankingScore >= 60) return "fioritura";
  if (monthsOnPlatform >= 6 && rankingScore >= 50) return "crescita";
  if (monthsOnPlatform >= 3 && rankingScore >= 40) return "germoglio";
  return "seed";
}
