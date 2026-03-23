import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { psychologistProfiles, psychologistAvailabilities } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

/**
 * GET /api/psychologist/availability
 * Returns all availability slots for the authenticated psychologist.
 */
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [profile] = await db
      .select({ id: psychologistProfiles.id })
      .from(psychologistProfiles)
      .where(eq(psychologistProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Profilo psicologo non trovato" } },
        { status: 404 }
      );
    }

    const slots = await db
      .select()
      .from(psychologistAvailabilities)
      .where(eq(psychologistAvailabilities.psychologistProfileId, profile.id));

    return NextResponse.json(
      { data: slots, meta: { version: "v1" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get psychologist availability error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore. Riprova più tardi." } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/psychologist/availability
 * Replaces all availability slots for the authenticated psychologist.
 * Body: { slots: Array<{ dayOfWeek: number, startTime: string, endTime: string }> }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [profile] = await db
      .select({ id: psychologistProfiles.id })
      .from(psychologistProfiles)
      .where(eq(psychologistProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Profilo psicologo non trovato" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { slots }: { slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }> } = body;

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Il campo slots deve essere un array" } },
        { status: 400 }
      );
    }

    // Validate each slot
    for (const slot of slots) {
      if (typeof slot.dayOfWeek !== "number" || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "dayOfWeek deve essere un numero tra 0 e 6" } },
          { status: 400 }
        );
      }
      if (!slot.startTime || !slot.endTime) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "startTime e endTime sono obbligatori per ogni slot" } },
          { status: 400 }
        );
      }
    }

    // Replace all slots in a single transaction
    await db.transaction(async (tx) => {
      await tx
        .delete(psychologistAvailabilities)
        .where(eq(psychologistAvailabilities.psychologistProfileId, profile.id));

      if (slots.length > 0) {
        await tx.insert(psychologistAvailabilities).values(
          slots.map((slot) => ({
            psychologistProfileId: profile.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
          }))
        );
      }
    });

    const newSlots = await db
      .select()
      .from(psychologistAvailabilities)
      .where(eq(psychologistAvailabilities.psychologistProfileId, profile.id));

    return NextResponse.json(
      { data: newSlots, meta: { version: "v1" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Set psychologist availability error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore. Riprova più tardi." } },
      { status: 500 }
    );
  }
}
