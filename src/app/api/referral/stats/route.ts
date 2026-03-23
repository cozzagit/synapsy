import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  cases,
  matchSelections,
  psychologistProfiles,
} from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";

/**
 * GET /api/referral/stats
 * Returns referral statistics for the authenticated psychologist.
 *
 * Response:
 * {
 *   profileId: string
 *   totalReferrals: number        — cases where referralPsychologistId = this profile
 *   selectedByReferral: number    — cases where referral led to THIS psychologist being selected
 *   referralLeadsToOther: number  — cases where referral led to ANOTHER psychologist (credit earned)
 * }
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Non autenticato" } }, { status: 401 });
  }

  // Support admin override: ?profileId=xxx
  const url = new URL(req.url);
  const requestedProfileId = url.searchParams.get("profileId");
  const userRole = (session.user as { role?: string }).role;

  let profileId: string;

  if (requestedProfileId && userRole === "admin") {
    profileId = requestedProfileId;
  } else {
    // Resolve the psychologist profile for the current user
    const profile = await db
      .select({ id: psychologistProfiles.id })
      .from(psychologistProfiles)
      .where(eq(psychologistProfiles.userId, session.user.id))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { error: { code: "PROFILE_NOT_FOUND", message: "Profilo psicologo non trovato" } },
        { status: 404 },
      );
    }

    profileId = profile[0].id;
  }

  // 1. Total cases referred by this psychologist
  const [totalReferralsResult] = await db
    .select({ count: count() })
    .from(cases)
    .where(eq(cases.referralPsychologistId, profileId));

  const totalReferrals = totalReferralsResult?.count ?? 0;

  // 2. Cases where referral resulted in THIS psychologist being selected
  const [selectedByReferralResult] = await db
    .select({ count: count() })
    .from(cases)
    .innerJoin(
      matchSelections,
      and(
        eq(matchSelections.caseId, cases.id),
        eq(matchSelections.psychologistProfileId, profileId),
      ),
    )
    .where(eq(cases.referralPsychologistId, profileId));

  const selectedByReferral = selectedByReferralResult?.count ?? 0;

  // 3. Cases where referral led to ANOTHER psychologist being selected (credits earned)
  //    i.e. referred by this psychologist, but matched to someone else
  const referralLeadsToOther = Math.max(0, Number(totalReferrals) - Number(selectedByReferral));

  return NextResponse.json({
    data: {
      profileId,
      totalReferrals: Number(totalReferrals),
      selectedByReferral: Number(selectedByReferral),
      referralLeadsToOther,
    },
    meta: { version: "v1" },
  });
}
