import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { credits, psychologistProfiles } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
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

    // Count available credits
    const [availableResult] = await db
      .select({ count: count() })
      .from(credits)
      .where(
        and(
          eq(credits.psychologistProfileId, profile.id),
          eq(credits.status, "available")
        )
      );

    // Full credits history
    const history = await db.query.credits.findMany({
      where: eq(credits.psychologistProfileId, profile.id),
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return NextResponse.json({
      data: {
        available: Number(availableResult?.count ?? 0),
        history: history.map((c) => ({
          id: c.id,
          status: c.status,
          originCaseId: c.originCaseId,
          usedForPaymentId: c.usedForPaymentId,
          expiresAt: c.expiresAt,
          usedAt: c.usedAt,
          createdAt: c.createdAt,
        })),
      },
      meta: { version: "v1" },
    });
  } catch (error) {
    console.error("Credits error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Errore interno del server" } },
      { status: 500 }
    );
  }
}
