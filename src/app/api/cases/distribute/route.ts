import { NextRequest, NextResponse } from "next/server";
import { distributeCase } from "@/lib/cases";

/**
 * POST /api/cases/distribute
 * Triggers case distribution to eligible psychologists.
 * Called after questionnaire submission.
 */
export async function POST(request: NextRequest) {
  try {
    const { caseId } = await request.json();

    if (!caseId) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "caseId richiesto" } },
        { status: 400 }
      );
    }

    const result = await distributeCase(caseId);

    return NextResponse.json({
      data: {
        caseId,
        distributedTo: result.distributedTo,
        topMatchCount: result.topMatchIds.length,
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Case distribution error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore nella distribuzione del caso" } },
      { status: 500 }
    );
  }
}
