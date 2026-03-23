import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases, matchSelections } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
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
    if (userRole !== "user" && userRole !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Accesso negato" } },
        { status: 403 }
      );
    }

    // Fetch the most recent case for this user
    const currentCase = await db.query.cases.findFirst({
      where: eq(cases.userId, session.user.id),
      orderBy: [desc(cases.createdAt)],
    });

    if (!currentCase) {
      return NextResponse.json({
        data: { currentCase: null, matches: [] },
        meta: { version: "v1" },
      });
    }

    // Fetch match selections for this case with psychologist profile data
    const matches = await db.query.matchSelections.findMany({
      where: eq(matchSelections.caseId, currentCase.id),
      with: {
        psychologistProfile: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (ms, { desc: d }) => [d(ms.createdAt)],
    });

    return NextResponse.json({
      data: {
        currentCase: {
          id: currentCase.id,
          status: currentCase.status,
          primaryProblem: currentCase.primaryProblem,
          intensity: currentCase.intensity,
          preferredModality: currentCase.preferredModality,
          createdAt: currentCase.createdAt,
          matchedAt: currentCase.matchedAt,
        },
        matches: matches.map((m) => ({
          matchSelectionId: m.id,
          status: m.status,
          callScheduledAt: m.callScheduledAt,
          callCompletedAt: m.callCompletedAt,
          psychologist: m.psychologistProfile
            ? {
                id: m.psychologistProfile.id,
                name: m.psychologistProfile.user.name,
                shortBio: m.psychologistProfile.shortBio,
                modality: m.psychologistProfile.modality,
                growthStage: m.psychologistProfile.growthStage,
                isVerified: m.psychologistProfile.isVerified,
              }
            : null,
        })),
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno del server" } },
      { status: 500 }
    );
  }
}
