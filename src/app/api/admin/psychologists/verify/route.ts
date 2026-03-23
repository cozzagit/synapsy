import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { psychologistProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface VerifyRequestBody {
  psychologistProfileId: string;
  verified: boolean;
}

/**
 * POST /api/admin/psychologists/verify
 * Admin-only — verify or unverify a psychologist profile.
 *
 * Body: { psychologistProfileId: string, verified: boolean }
 * Response: { data: { id, isVerified, verifiedAt } }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
      { status: 401 },
    );
  }

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "admin") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Accesso riservato agli amministratori" } },
      { status: 403 },
    );
  }

  let body: VerifyRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Corpo della richiesta non valido" } },
      { status: 400 },
    );
  }

  const { psychologistProfileId, verified } = body;

  if (!psychologistProfileId || typeof verified !== "boolean") {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Parametri mancanti o non validi",
          details: [
            { field: "psychologistProfileId", message: "Obbligatorio" },
            { field: "verified", message: "Deve essere un booleano" },
          ],
        },
      },
      { status: 400 },
    );
  }

  const existing = await db
    .select({ id: psychologistProfiles.id })
    .from(psychologistProfiles)
    .where(eq(psychologistProfiles.id, psychologistProfileId))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Profilo psicologo non trovato" } },
      { status: 404 },
    );
  }

  const updatedAt = new Date();
  const verifiedAt = verified ? updatedAt : null;

  const updated = await db
    .update(psychologistProfiles)
    .set({
      isVerified: verified,
      verifiedAt,
      updatedAt,
    })
    .where(eq(psychologistProfiles.id, psychologistProfileId))
    .returning({
      id: psychologistProfiles.id,
      isVerified: psychologistProfiles.isVerified,
      verifiedAt: psychologistProfiles.verifiedAt,
    });

  return NextResponse.json({
    data: updated[0],
    meta: { version: "v1" },
  });
}
