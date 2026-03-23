import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, psychologistProfiles, penalties } from "@/lib/db/schema";
import { eq, and, isNull, lte, gte, or } from "drizzle-orm";
import { runMatchingEngine, explainScore } from "@/lib/matching";
import { getServerSession } from "@/lib/auth/session";
import type { PsychologistCandidate, UserMatchingInput } from "@/lib/matching";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const { caseId } = await params;

    // Fetch the case and verify it belongs to the authenticated user
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
    if (caseResult.userId !== session.user.id && userRole !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Non hai accesso a questo caso" } },
        { status: 403 }
      );
    }

    // Fetch all active psychologist profiles with user names
    const now = new Date();
    const psychProfiles = await db.query.psychologistProfiles.findMany({
      where: and(
        eq(psychologistProfiles.isVerified, true),
        isNull(psychologistProfiles.deletedAt)
      ),
      with: {
        user: true,
      },
    });

    // Check active penalties for each psychologist
    const activePenalties = await db.query.penalties.findMany({
      where: and(
        eq(penalties.isActive, true),
        eq(penalties.type, "lead_block"),
        lte(penalties.startsAt, now),
        or(isNull(penalties.endsAt), gte(penalties.endsAt, now))
      ),
    });

    const blockedPsychIds = new Set(
      activePenalties.map((p) => p.psychologistProfileId)
    );

    // Transform to matching candidates
    const candidates: PsychologistCandidate[] = psychProfiles.map((pp) => ({
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
      hasActiveLeadBlock: blockedPsychIds.has(pp.id),
      createdAt: pp.createdAt,
    }));

    // Build user matching input from case data
    const questionnaireData = caseResult.questionnaireData as Record<string, unknown>;
    const userInput: UserMatchingInput = {
      primaryProblems: (questionnaireData.primaryProblems as string[]) || [caseResult.primaryProblem],
      context: (questionnaireData.context as string[]) || [caseResult.context],
      intensity: caseResult.intensity,
      preferredModality: caseResult.preferredModality,
      preferredGender: caseResult.preferredGender,
      preferredApproaches: (caseResult.preferredApproaches as string[]) || [],
      urgency: ((questionnaireData.urgency as string) || "this_month") as UserMatchingInput["urgency"],
      previousTherapy: (questionnaireData.previousTherapy as boolean) || false,
      ageRange: (questionnaireData.ageRange as string) || "no_preference",
      referralPsychologistId: caseResult.referralPsychologistId,
    };

    // Run matching engine
    const matchingOutput = runMatchingEngine(userInput, candidates);

    // Enrich results with profile info and explanations
    const enrichMatch = (match: (typeof matchingOutput.topMatches)[0]) => {
      const psych = candidates.find((c) => c.id === match.psychologistId);
      return {
        ...match,
        name: psych?.name ?? "Professionista",
        shortBio: psych?.shortBio ?? "",
        treatedAreas: psych?.treatedAreas ?? [],
        therapeuticApproaches: psych?.therapeuticApproaches ?? [],
        modality: psych?.modality ?? "both",
        continuityRate: psych?.continuityRate ?? 0,
        growthStage: psych?.growthStage ?? "seed",
        explanations: explainScore(match.breakdown),
      };
    };

    // Update case status
    await db
      .update(cases)
      .set({
        status: "matching",
        matchedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(cases.id, caseId));

    return NextResponse.json({
      data: {
        caseId,
        topMatches: matchingOutput.topMatches.map(enrichMatch),
        additionalMatches: matchingOutput.additionalMatches.map(enrichMatch),
        referralMatch: matchingOutput.referralMatch
          ? enrichMatch(matchingOutput.referralMatch)
          : null,
        stats: {
          totalEvaluated: matchingOutput.totalCandidatesEvaluated,
          totalPassed: matchingOutput.totalPassedHardFilter,
        },
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Errore durante il matching. Riprova più tardi.",
        },
      },
      { status: 500 }
    );
  }
}
