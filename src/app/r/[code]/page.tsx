import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { psychologistProfiles } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

interface ReferralPageProps {
  params: Promise<{ code: string }>;
}

/**
 * Referral redirect — the `code` is the psychologistProfile.id (UUID).
 * Valid → redirect to /questionnaire?ref={code}
 * Invalid → redirect to / (the home page handles flash messages via searchParams)
 */
export default async function ReferralPage({ params }: ReferralPageProps) {
  const { code } = await params;

  // Validate that the code corresponds to a verified, active psychologist profile
  const profile = await db
    .select({ id: psychologistProfiles.id })
    .from(psychologistProfiles)
    .where(
      and(
        eq(psychologistProfiles.id, code),
        eq(psychologistProfiles.isVerified, true),
        isNull(psychologistProfiles.deletedAt),
      ),
    )
    .limit(1);

  if (profile.length === 0) {
    // Invalid or unknown referral code — redirect home with a notice
    redirect("/?ref_invalid=1");
  }

  // Valid referral — forward to questionnaire so it can capture the ref param
  redirect(`/questionnaire?ref=${code}`);
}
