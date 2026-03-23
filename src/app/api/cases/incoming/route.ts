import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { candidacies, psychologistProfiles } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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

    // Fetch candidacies with case data
    const incomingCandidacies = await db.query.candidacies.findMany({
      where: and(
        eq(candidacies.psychologistProfileId, profile.id),
        inArray(candidacies.status, ["pending", "accepted"])
      ),
      with: {
        case: true,
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json({
      data: incomingCandidacies.map((c) => ({
        candidacyId: c.id,
        status: c.status,
        compatibilityScore: c.compatibilityScore,
        scoreBreakdown: c.scoreBreakdown,
        respondedAt: c.respondedAt,
        createdAt: c.createdAt,
        case: c.case
          ? {
              id: c.case.id,
              primaryProblem: c.case.primaryProblem,
              context: c.case.context,
              intensity: c.case.intensity,
              preferredModality: c.case.preferredModality,
              preferredGender: c.case.preferredGender,
              status: c.case.status,
              createdAt: c.case.createdAt,
            }
          : null,
      })),
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Incoming cases error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno del server" } },
      { status: 500 }
    );
  }
}
