import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { matchSelections, psychologistProfiles } from "@/lib/db/schema";
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

    // Fetch active match selections with user and case data
    const patientSelections = await db.query.matchSelections.findMany({
      where: and(
        eq(matchSelections.psychologistProfileId, profile.id),
        inArray(matchSelections.status, ["continued", "call_completed", "call_scheduled"])
      ),
      with: {
        user: true,
        case: true,
      },
      orderBy: (ms, { desc }) => [desc(ms.createdAt)],
    });

    return NextResponse.json({
      data: patientSelections.map((ms) => ({
        matchSelectionId: ms.id,
        status: ms.status,
        callScheduledAt: ms.callScheduledAt,
        callCompletedAt: ms.callCompletedAt,
        createdAt: ms.createdAt,
        patient: ms.user
          ? {
              id: ms.user.id,
              name: ms.user.name,
              email: ms.user.email,
            }
          : null,
        case: ms.case
          ? {
              id: ms.case.id,
              primaryProblem: ms.case.primaryProblem,
              intensity: ms.case.intensity,
              preferredModality: ms.case.preferredModality,
            }
          : null,
      })),
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Patients list error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno del server" } },
      { status: 500 }
    );
  }
}
