import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { distributeCase } from "@/lib/cases";
import type { QuestionnaireResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Questionnaire can be filled without login (user is anonymous until match selection)
    const session = await getServerSession();

    const body = await request.json();
    const {
      responses,
      referralId,
    }: {
      responses: QuestionnaireResponse;
      referralId?: string;
    } = body;

    // Validate required fields
    if (!responses.primaryProblems?.length) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Problema principale richiesto" } },
        { status: 400 }
      );
    }

    if (!responses.intensity || responses.intensity < 1 || responses.intensity > 5) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Intensità non valida" } },
        { status: 400 }
      );
    }

    // Map modality value
    const modalityMap: Record<string, "online" | "in_person" | "both"> = {
      online: "online",
      in_person: "in_person",
      in_studio: "in_person",
      both: "both",
      no_preference: "both",
    };

    const preferredModality = modalityMap[responses.preferredModality] ?? "both";

    // Map gender preference
    const genderMap: Record<string, "male" | "female" | "no_preference"> = {
      male: "male",
      uomo: "male",
      female: "female",
      donna: "female",
      no_preference: "no_preference",
    };

    const preferredGender = genderMap[responses.preferredGender] ?? "no_preference";

    // Create case in database, linked to the authenticated user
    const [newCase] = await db
      .insert(cases)
      .values({
        userId: session?.user?.id ?? "00000000-0000-0000-0000-000000000000",
        status: "pending",
        questionnaireData: responses as unknown as Record<string, unknown>,
        primaryProblem: responses.primaryProblems[0],
        context: responses.context?.join(", ") ?? "",
        intensity: responses.intensity,
        preferredModality,
        preferredGender,
        preferredApproaches: responses.preferredApproaches?.filter(
          (a) => (a as string) !== "no_preference"
        ) ?? [],
        referralPsychologistId: referralId || null,
      })
      .returning();

    // Trigger case distribution asynchronously — questionnaire submission succeeds regardless
    try {
      await distributeCase(newCase.id);
    } catch (distributionError) {
      console.error("Case distribution failed (non-blocking):", distributionError);
    }

    return NextResponse.json({
      data: {
        caseId: newCase.id,
        status: newCase.status,
      },
      meta: { version: "v1" },
    }, { status: 201 });
  } catch (error) {
    console.error("Questionnaire submission error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Si è verificato un errore. Riprova più tardi.",
        },
      },
      { status: 500 }
    );
  }
}
