import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  psychologistProfiles,
  matchSelections,
  payments,
  credits,
  candidacies,
  cases,
} from "@/lib/db/schema";
import { eq, and, gte, count, sql } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "psychologist" && userRole !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Accesso negato" } },
        { status: 403 }
      );
    }

    // Fetch psychologist profile
    const profile = await db.query.psychologistProfiles.findFirst({
      where: eq(psychologistProfiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Profilo psicologo non trovato" } },
        { status: 404 }
      );
    }

    // Stats — this month window
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count continued matches this month
    const [continuedResult] = await db
      .select({ count: count() })
      .from(matchSelections)
      .where(
        and(
          eq(matchSelections.psychologistProfileId, profile.id),
          eq(matchSelections.status, "continued"),
          gte(matchSelections.updatedAt, startOfMonth)
        )
      );

    // Sum paid payments this month (amount is in cents)
    const [earningsResult] = await db
      .select({ total: sql<number>`coalesce(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(
        and(
          eq(payments.psychologistProfileId, profile.id),
          eq(payments.status, "paid"),
          gte(payments.paidAt, startOfMonth)
        )
      );

    // Count available credits
    const [creditsResult] = await db
      .select({ count: count() })
      .from(credits)
      .where(
        and(
          eq(credits.psychologistProfileId, profile.id),
          eq(credits.status, "available")
        )
      );

    // Pending candidacies with case data
    const pendingCandidacies = await db.query.candidacies.findMany({
      where: and(
        eq(candidacies.psychologistProfileId, profile.id),
        eq(candidacies.status, "pending")
      ),
      with: {
        case: true,
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json({
      data: {
        stats: {
          newPatientsThisMonth: Number(continuedResult?.count ?? 0),
          earningsThisMonthCents: Number(earningsResult?.total ?? 0),
          availableCredits: Number(creditsResult?.count ?? 0),
          continuityRate: profile.continuityRate,
        },
        pendingCases: pendingCandidacies.map((c) => ({
          candidacyId: c.id,
          compatibilityScore: c.compatibilityScore,
          createdAt: c.createdAt,
          case: c.case
            ? {
                id: c.case.id,
                primaryProblem: c.case.primaryProblem,
                intensity: c.case.intensity,
                preferredModality: c.case.preferredModality,
                status: c.case.status,
              }
            : null,
        })),
        profile: {
          id: profile.id,
          growthStage: profile.growthStage,
          rankingScore: profile.rankingScore,
          isVerified: profile.isVerified,
          currentCaseload: profile.currentCaseload,
          maxNewPatientsPerWeek: profile.maxNewPatientsPerWeek,
        },
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Psychologist dashboard error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno del server" } },
      { status: 500 }
    );
  }
}
