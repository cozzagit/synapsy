import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users, psychologistProfiles, cases, payments } from "@/lib/db/schema";
import { eq, count, sum, isNull } from "drizzle-orm";

/**
 * GET /api/admin/stats
 * Admin-only endpoint — returns platform-wide aggregate statistics.
 *
 * Response:
 * {
 *   totalUsers: number
 *   totalPsychologists: number
 *   totalCases: number
 *   totalRevenueCents: number
 * }
 */
export async function GET() {
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

  const [
    totalUsersResult,
    totalPsychologistsResult,
    totalCasesResult,
    totalRevenueResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(users)
      .where(isNull(users.deletedAt)),

    db
      .select({ count: count() })
      .from(psychologistProfiles)
      .where(isNull(psychologistProfiles.deletedAt)),

    db
      .select({ count: count() })
      .from(cases),

    db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.status, "paid")),
  ]);

  return NextResponse.json({
    data: {
      totalUsers: Number(totalUsersResult[0]?.count ?? 0),
      totalPsychologists: Number(totalPsychologistsResult[0]?.count ?? 0),
      totalCases: Number(totalCasesResult[0]?.count ?? 0),
      totalRevenueCents: Number(totalRevenueResult[0]?.total ?? 0),
    },
    meta: { version: "v1" },
  });
}
