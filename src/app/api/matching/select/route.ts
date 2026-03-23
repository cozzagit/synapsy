import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  matchSelections,
  candidacies,
  cases,
  psychologistProfiles,
} from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import {
  createSelectionFeePayment,
  awardReferralCredit,
} from "@/lib/payments";

/**
 * User selects a psychologist from their matches
 * Enforces: max 2 selections per week
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    // userId always comes from the authenticated session — never trusted from the body
    const userId = session.user.id;

    const { caseId, candidacyId, psychologistProfileId } =
      await request.json();

    if (!caseId || !candidacyId || !psychologistProfileId) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Dati incompleti" } },
        { status: 400 }
      );
    }

    // Verify the case belongs to this user
    const caseResult = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseResult) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Caso non trovato" } },
        { status: 404 }
      );
    }

    const userRole = (session.user as { role?: string }).role;
    if (caseResult.userId !== userId && userRole !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Non hai accesso a questo caso" } },
        { status: 403 }
      );
    }

    // Check weekly selection limit (max 2)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSelections = await db
      .select({ count: sql<number>`count(*)` })
      .from(matchSelections)
      .where(
        and(
          eq(matchSelections.userId, userId),
          gte(matchSelections.createdAt, oneWeekAgo)
        )
      );

    if (Number(recentSelections[0]?.count ?? 0) >= 2) {
      return NextResponse.json(
        {
          error: {
            code: "LIMIT_EXCEEDED",
            message:
              "Hai raggiunto il limite di 2 selezioni a settimana. Riprova tra qualche giorno.",
          },
        },
        { status: 429 }
      );
    }

    // Verify candidacy exists and is accepted
    const candidacy = await db.query.candidacies.findFirst({
      where: eq(candidacies.id, candidacyId),
    });

    if (!candidacy || candidacy.status !== "accepted") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_CANDIDACY",
            message: "Candidatura non valida o non accettata",
          },
        },
        { status: 400 }
      );
    }

    // Create match selection
    const [selection] = await db
      .insert(matchSelections)
      .values({
        caseId,
        candidacyId,
        userId,
        psychologistProfileId,
        status: "selected",
      })
      .returning();

    // Update case status
    await db
      .update(cases)
      .set({ status: "matched", matchedAt: new Date(), updatedAt: new Date() })
      .where(eq(cases.id, caseId));

    // Create selection fee payment
    await createSelectionFeePayment(selection.id, psychologistProfileId);

    // Increment psychologist caseload
    await db
      .update(psychologistProfiles)
      .set({
        currentCaseload: sql`${psychologistProfiles.currentCaseload} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(psychologistProfiles.id, psychologistProfileId));

    // Check if referral credit should be awarded (reuse already-fetched case)
    if (
      caseResult.referralPsychologistId &&
      caseResult.referralPsychologistId !== psychologistProfileId
    ) {
      await awardReferralCredit(
        caseResult.referralPsychologistId,
        caseId
      );
    }

    return NextResponse.json(
      {
        data: {
          matchSelectionId: selection.id,
          status: selection.status,
        },
        meta: { version: "v1" },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Match selection error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno" } },
      { status: 500 }
    );
  }
}
