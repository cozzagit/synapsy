/**
 * Synapsy Payment & Credit System
 *
 * Fee structure:
 * - €10 selection fee: charged when psychologist is chosen
 * - €60 continuity fee: charged when user confirms continuity
 *
 * Credit system:
 * - When user enters via psychologist A's referral but chooses psychologist B,
 *   psychologist A earns 1 credit
 * - Credit covers selection fee (€10), NOT continuity fee
 * - Credits expire after 6 months
 */

import { db } from "@/lib/db";
import {
  payments,
  credits,
  matchSelections,
  cases,
  psychologistProfiles,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

// Amounts in cents
export const SELECTION_FEE = 1000; // €10
export const CONTINUITY_FEE = 6000; // €60
export const CREDIT_EXPIRY_DAYS = 180; // 6 months

/**
 * Create a selection fee payment when a user chooses a psychologist
 */
export async function createSelectionFeePayment(
  matchSelectionId: string,
  psychologistProfileId: string
): Promise<string> {
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 7); // 7 days to pay

  // Check if psychologist has available credits
  const availableCredits = await db.query.credits.findFirst({
    where: and(
      eq(credits.psychologistProfileId, psychologistProfileId),
      eq(credits.status, "available")
    ),
  });

  const [payment] = await db
    .insert(payments)
    .values({
      matchSelectionId,
      psychologistProfileId,
      type: "selection_fee",
      amount: SELECTION_FEE,
      currency: "EUR",
      status: availableCredits ? "paid" : "pending",
      dueAt,
      paidAt: availableCredits ? new Date() : null,
    })
    .returning();

  // If credit available, use it
  if (availableCredits) {
    await db
      .update(credits)
      .set({
        status: "used",
        usedForPaymentId: payment.id,
        usedAt: new Date(),
      })
      .where(eq(credits.id, availableCredits.id));
  }

  return payment.id;
}

/**
 * Create a continuity fee payment when user confirms continuation
 */
export async function createContinuityFeePayment(
  matchSelectionId: string,
  psychologistProfileId: string
): Promise<string> {
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 14); // 14 days to pay

  const [payment] = await db
    .insert(payments)
    .values({
      matchSelectionId,
      psychologistProfileId,
      type: "continuity_fee",
      amount: CONTINUITY_FEE,
      currency: "EUR",
      status: "pending",
      dueAt,
    })
    .returning();

  return payment.id;
}

/**
 * Award a referral credit to the referring psychologist
 * Called when: user entered via psychologist A's link but chose psychologist B
 */
export async function awardReferralCredit(
  referralPsychologistId: string,
  originCaseId: string
): Promise<string | null> {
  // Verify the referral psychologist was NOT the one chosen
  const caseResult = await db.query.cases.findFirst({
    where: eq(cases.id, originCaseId),
    with: {
      matchSelections: true,
    },
  });

  if (!caseResult?.referralPsychologistId) return null;

  // Check if the chosen psychologist is different from referral
  const chosenSelection = caseResult.matchSelections?.find(
    (ms) => ms.status !== "not_continued"
  );

  if (
    chosenSelection &&
    chosenSelection.psychologistProfileId === referralPsychologistId
  ) {
    // Psychologist was chosen — no credit (they get the patient directly)
    return null;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CREDIT_EXPIRY_DAYS);

  const [credit] = await db
    .insert(credits)
    .values({
      psychologistProfileId: referralPsychologistId,
      originCaseId,
      status: "available",
      expiresAt,
    })
    .returning();

  return credit.id;
}

/**
 * Get payment summary for a psychologist
 */
export async function getPaymentSummary(psychologistProfileId: string) {
  const paymentSummary = await db
    .select({
      totalPaid: sql<number>`coalesce(sum(case when ${payments.status} = 'paid' then ${payments.amount} else 0 end), 0)`,
      totalPending: sql<number>`coalesce(sum(case when ${payments.status} = 'pending' then ${payments.amount} else 0 end), 0)`,
      totalSelectionFees: sql<number>`coalesce(sum(case when ${payments.type} = 'selection_fee' and ${payments.status} = 'paid' then ${payments.amount} else 0 end), 0)`,
      totalContinuityFees: sql<number>`coalesce(sum(case when ${payments.type} = 'continuity_fee' and ${payments.status} = 'paid' then ${payments.amount} else 0 end), 0)`,
    })
    .from(payments)
    .where(eq(payments.psychologistProfileId, psychologistProfileId));

  const creditCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(credits)
    .where(
      and(
        eq(credits.psychologistProfileId, psychologistProfileId),
        eq(credits.status, "available")
      )
    );

  return {
    totalPaid: Number(paymentSummary[0]?.totalPaid ?? 0),
    totalPending: Number(paymentSummary[0]?.totalPending ?? 0),
    totalSelectionFees: Number(paymentSummary[0]?.totalSelectionFees ?? 0),
    totalContinuityFees: Number(paymentSummary[0]?.totalContinuityFees ?? 0),
    availableCredits: Number(creditCount[0]?.count ?? 0),
  };
}

/**
 * Check for overdue payments and apply penalties
 */
export async function checkOverduePayments(
  psychologistProfileId: string
): Promise<boolean> {
  const now = new Date();

  const overduePayments = await db
    .select({ count: sql<number>`count(*)` })
    .from(payments)
    .where(
      and(
        eq(payments.psychologistProfileId, psychologistProfileId),
        eq(payments.status, "pending"),
        sql`${payments.dueAt} < ${now}`
      )
    );

  const overdueCount = Number(overduePayments[0]?.count ?? 0);

  if (overdueCount > 0) {
    // Reduce visibility by lowering ranking
    await db
      .update(psychologistProfiles)
      .set({
        rankingScore: sql`greatest(${psychologistProfiles.rankingScore} - ${overdueCount * 5}, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(psychologistProfiles.id, psychologistProfileId));
  }

  return overdueCount > 0;
}
