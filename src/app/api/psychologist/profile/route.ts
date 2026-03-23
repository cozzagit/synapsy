import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { psychologistProfiles } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

/**
 * POST /api/psychologist/profile
 * Creates a psychologist profile after successful registration.
 * Requires an authenticated session with role "psychologist".
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

    const userId = session.user.id;

    // Ensure no profile exists yet for this user
    const [existing] = await db
      .select({ id: psychologistProfiles.id })
      .from(psychologistProfiles)
      .where(eq(psychologistProfiles.userId, userId))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "Profilo già esistente per questo utente" } },
        { status: 409 }
      );
    }

    const body = await request.json();
    const {
      alboNumber,
      alboRegion,
      treatedAreas,
      therapeuticApproaches,
      modality,
      bio,
      shortBio,
      maxNewPatientsPerWeek,
    }: {
      alboNumber: string;
      alboRegion: string;
      treatedAreas: string[];
      therapeuticApproaches: string[];
      modality: "online" | "in_person" | "both";
      bio: string;
      shortBio: string;
      maxNewPatientsPerWeek?: number;
    } = body;

    // Validate required fields
    if (!alboNumber || !alboRegion) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Numero e regione albo sono obbligatori" } },
        { status: 400 }
      );
    }

    if (!modality || !["online", "in_person", "both"].includes(modality)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Modalità non valida" } },
        { status: 400 }
      );
    }

    const [createdProfile] = await db
      .insert(psychologistProfiles)
      .values({
        userId,
        alboNumber,
        alboRegion,
        treatedAreas: treatedAreas ?? [],
        therapeuticApproaches: therapeuticApproaches ?? [],
        modality,
        bio: bio ?? "",
        shortBio: shortBio ?? "",
        maxNewPatientsPerWeek: maxNewPatientsPerWeek ?? 5,
      })
      .returning();

    return NextResponse.json(
      { data: createdProfile, meta: { version: "v1" } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create psychologist profile error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore. Riprova più tardi." } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/psychologist/profile
 * Updates the authenticated psychologist's existing profile.
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

    const [existingProfile] = await db
      .select({ id: psychologistProfiles.id })
      .from(psychologistProfiles)
      .where(eq(psychologistProfiles.userId, userId))
      .limit(1);

    if (!existingProfile) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Profilo non trovato" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      treatedAreas,
      therapeuticApproaches,
      modality,
      bio,
      shortBio,
      maxNewPatientsPerWeek,
      languages,
    }: {
      treatedAreas?: string[];
      therapeuticApproaches?: string[];
      modality?: "online" | "in_person" | "both";
      bio?: string;
      shortBio?: string;
      maxNewPatientsPerWeek?: number;
      languages?: string[];
    } = body;

    if (modality && !["online", "in_person", "both"].includes(modality)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Modalità non valida" } },
        { status: 400 }
      );
    }

    const updateValues: Partial<{
      treatedAreas: string[];
      therapeuticApproaches: string[];
      modality: "online" | "in_person" | "both";
      bio: string;
      shortBio: string;
      maxNewPatientsPerWeek: number;
      languages: string[];
      updatedAt: Date;
    }> = { updatedAt: new Date() };

    if (treatedAreas !== undefined) updateValues.treatedAreas = treatedAreas;
    if (therapeuticApproaches !== undefined) updateValues.therapeuticApproaches = therapeuticApproaches;
    if (modality !== undefined) updateValues.modality = modality;
    if (bio !== undefined) updateValues.bio = bio;
    if (shortBio !== undefined) updateValues.shortBio = shortBio;
    if (maxNewPatientsPerWeek !== undefined) updateValues.maxNewPatientsPerWeek = maxNewPatientsPerWeek;
    if (languages !== undefined) updateValues.languages = languages;

    const [updatedProfile] = await db
      .update(psychologistProfiles)
      .set(updateValues)
      .where(eq(psychologistProfiles.userId, userId))
      .returning();

    return NextResponse.json(
      { data: updatedProfile, meta: { version: "v1" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update psychologist profile error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore. Riprova più tardi." } },
      { status: 500 }
    );
  }
}
