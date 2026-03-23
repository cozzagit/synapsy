import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { candidacies, cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Psychologist responds to a candidacy (accept/reject)
 */
export async function POST(request: NextRequest) {
  try {
    const { candidacyId, action } = await request.json();

    if (!candidacyId || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Dati non validi" } },
        { status: 400 }
      );
    }

    const candidacy = await db.query.candidacies.findFirst({
      where: eq(candidacies.id, candidacyId),
    });

    if (!candidacy) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Candidatura non trovata" } },
        { status: 404 }
      );
    }

    if (candidacy.status !== "pending") {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "Candidatura già gestita" } },
        { status: 409 }
      );
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";

    await db
      .update(candidacies)
      .set({
        status: newStatus,
        respondedAt: new Date(),
      })
      .where(eq(candidacies.id, candidacyId));

    // If accepting, update case status
    if (action === "accept") {
      await db
        .update(cases)
        .set({ status: "matching", updatedAt: new Date() })
        .where(eq(cases.id, candidacy.caseId));
    }

    return NextResponse.json({
      data: { candidacyId, status: newStatus },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Candidacy respond error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno" } },
      { status: 500 }
    );
  }
}
