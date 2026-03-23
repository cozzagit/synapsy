import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { psychologistProfiles } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";
import {
  updatePsychologistRanking,
  computeGrowthStage,
} from "@/lib/ranking";
import { checkOverduePayments } from "@/lib/payments";
import { eq } from "drizzle-orm";

/**
 * Update rankings for all psychologists
 * Should be called daily via cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Simple API key check for cron authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autorizzato" } },
        { status: 401 }
      );
    }

    // Get all active psychologist profiles
    const profiles = await db.query.psychologistProfiles.findMany({
      where: isNull(psychologistProfiles.deletedAt),
    });

    const results = [];

    for (const profile of profiles) {
      // Update ranking
      const newScore = await updatePsychologistRanking(profile.id);

      // Check overdue payments
      const hasOverdue = await checkOverduePayments(profile.id);

      // Update growth stage
      const monthsOnPlatform = Math.floor(
        (Date.now() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const newStage = computeGrowthStage(monthsOnPlatform, newScore);

      if (newStage !== profile.growthStage) {
        await db
          .update(psychologistProfiles)
          .set({ growthStage: newStage, updatedAt: new Date() })
          .where(eq(psychologistProfiles.id, profile.id));
      }

      results.push({
        id: profile.id,
        score: newScore,
        stage: newStage,
        hasOverdue,
      });
    }

    return NextResponse.json({
      data: {
        updatedCount: results.length,
        results,
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Ranking update error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore aggiornamento ranking" } },
      { status: 500 }
    );
  }
}
