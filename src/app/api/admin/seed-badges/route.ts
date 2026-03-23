import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { badges } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

const DEFAULT_BADGES = [
  {
    code: "profilo_verificato",
    name: "Profilo Verificato",
    description: "Il tuo profilo professionale è stato verificato dal team Synapsy.",
    tier: "foundation" as const,
    iconName: "shield-check",
    criteria: {},
  },
  {
    code: "risposta_rapida",
    name: "Risposta Rapida",
    description: "Rispondi ai casi entro 24 ore in modo costante.",
    tier: "foundation" as const,
    iconName: "zap",
    criteria: {},
  },
  {
    code: "alta_continuita",
    name: "Alta Continuità",
    description: "Mantieni un tasso di continuità terapeutica superiore alla media.",
    tier: "quality" as const,
    iconName: "heart-handshake",
    criteria: {},
  },
  {
    code: "relazioni_durature",
    name: "Relazioni Durature",
    description: "Le tue relazioni terapeutiche durano nel tempo.",
    tier: "quality" as const,
    iconName: "timer",
    criteria: {},
  },
  {
    code: "ambasciatore",
    name: "Ambasciatore",
    description: "Hai portato nuovi colleghi nella rete Synapsy tramite il programma referral.",
    tier: "network" as const,
    iconName: "megaphone",
    criteria: {},
  },
  {
    code: "mentore_della_rete",
    name: "Mentore della Rete",
    description: "Supporti attivamente la crescita dei colleghi nella rete.",
    tier: "network" as const,
    iconName: "users",
    criteria: {},
  },
] as const;

/**
 * POST /api/admin/seed-badges
 * Admin-only endpoint — seeds the default badge catalogue.
 * Uses onConflictDoNothing on the unique code index to be idempotent.
 */
export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Non autenticato" } },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Accesso riservato agli amministratori" } },
        { status: 403 }
      );
    }

    const inserted = await db
      .insert(badges)
      .values(DEFAULT_BADGES.map((b) => ({ ...b, criteria: b.criteria })))
      .onConflictDoNothing({ target: badges.code })
      .returning();

    return NextResponse.json(
      {
        data: {
          inserted: inserted.length,
          skipped: DEFAULT_BADGES.length - inserted.length,
          badges: inserted,
        },
        meta: { version: "v1" },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed badges error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Si è verificato un errore. Riprova più tardi." } },
      { status: 500 }
    );
  }
}
