import { db } from '@/lib/db';
import {
  discrepancies,
  penalties,
  matchSelections,
  postCallQuestionnaires,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuestionnaireSnapshot {
  id: string;
  matchSelectionId: string;
  respondentType: 'user' | 'psychologist';
  respondentId: string;
  callHappened: boolean;
  estimatedDurationMinutes: number | null;
  willContinue: boolean;
  satisfactionRating: number | null;
  notes: string | null;
}

export interface DiscrepancyResult {
  discrepanciesFound: number;
  types: Array<'call_happened' | 'continuity' | 'duration_mismatch'>;
  penaltiesApplied: number;
  matchUpdated: boolean;
}

// ─── Duration mismatch threshold ──────────────────────────────────────────────

const DURATION_MISMATCH_THRESHOLD_MINUTES = 10;

// ─── Main detector ────────────────────────────────────────────────────────────

/**
 * Runs full discrepancy detection after both parties have submitted.
 * Inserts discrepancy records, applies penalties, and updates match status.
 */
export async function detectAndHandleDiscrepancies(
  userQuestionnaire: QuestionnaireSnapshot,
  psychologistQuestionnaire: QuestionnaireSnapshot,
): Promise<DiscrepancyResult> {
  const result: DiscrepancyResult = {
    discrepanciesFound: 0,
    types: [],
    penaltiesApplied: 0,
    matchUpdated: false,
  };

  const matchSelectionId = userQuestionnaire.matchSelectionId;

  // Fetch the match to get the psychologistProfileId for penalties
  const [match] = await db
    .select()
    .from(matchSelections)
    .where(eq(matchSelections.id, matchSelectionId))
    .limit(1);

  if (!match) {
    throw new Error(`matchSelection ${matchSelectionId} not found`);
  }

  // ─── Check 1: Did the call actually happen? ────────────────────────────────
  if (userQuestionnaire.callHappened !== psychologistQuestionnaire.callHappened) {
    const [discrepancy] = await db
      .insert(discrepancies)
      .values({
        matchSelectionId,
        type: 'call_happened',
        severity: 'critical',
        userResponse: {
          callHappened: userQuestionnaire.callHappened,
          respondentId: userQuestionnaire.respondentId,
        },
        psychologistResponse: {
          callHappened: psychologistQuestionnaire.callHappened,
          respondentId: psychologistQuestionnaire.respondentId,
        },
        resolution: 'pending',
      })
      .returning();

    result.discrepanciesFound++;
    result.types.push('call_happened');

    // Critical discrepancy: mark match as disputed
    await db
      .update(matchSelections)
      .set({ status: 'disputed', updatedAt: new Date() })
      .where(eq(matchSelections.id, matchSelectionId));

    result.matchUpdated = true;

    // Apply suspension penalty to psychologist (critical severity)
    if (!psychologistQuestionnaire.callHappened) {
      // Psychologist claims it didn't happen — suspicious; apply lead_block
      const startsAt = new Date();
      const endsAt = new Date(startsAt);
      endsAt.setMonth(endsAt.getMonth() + 2);

      await db.insert(penalties).values({
        psychologistProfileId: match.psychologistProfileId,
        type: 'lead_block',
        reason:
          'Discrepanza critica: lo psicologo ha dichiarato che la call non è avvenuta, mentre il paziente ha confermato il contrario.',
        discrepancyId: discrepancy.id,
        startsAt,
        endsAt,
        isActive: true,
      });

      result.penaltiesApplied++;
    }

    // If call didn't happen per both → mark as not_continued, skip further checks
    return result;
  }

  // If call didn't happen per both parties — no further checks needed
  if (!userQuestionnaire.callHappened && !psychologistQuestionnaire.callHappened) {
    await db
      .update(matchSelections)
      .set({ status: 'not_continued', updatedAt: new Date() })
      .where(eq(matchSelections.id, matchSelectionId));
    result.matchUpdated = true;
    return result;
  }

  // ─── Check 2: Continuity agreement ────────────────────────────────────────
  // Spec: psychologist says won't continue BUT user says will → MAJOR (2-month lead block)
  if (!psychologistQuestionnaire.willContinue && userQuestionnaire.willContinue) {
    const [discrepancy] = await db
      .insert(discrepancies)
      .values({
        matchSelectionId,
        type: 'continuity',
        severity: 'major',
        userResponse: {
          willContinue: userQuestionnaire.willContinue,
          respondentId: userQuestionnaire.respondentId,
        },
        psychologistResponse: {
          willContinue: psychologistQuestionnaire.willContinue,
          respondentId: psychologistQuestionnaire.respondentId,
        },
        resolution: 'pending',
      })
      .returning();

    result.discrepanciesFound++;
    result.types.push('continuity');

    // 2-month lead block per spec
    const startsAt = new Date();
    const endsAt = new Date(startsAt);
    endsAt.setMonth(endsAt.getMonth() + 2);

    await db.insert(penalties).values({
      psychologistProfileId: match.psychologistProfileId,
      type: 'lead_block',
      reason:
        'Discrepanza sulla continuità: il paziente desidera continuare ma lo psicologo ha dichiarato il contrario. Blocco lead per 2 mesi.',
      discrepancyId: discrepancy.id,
      startsAt,
      endsAt,
      isActive: true,
    });

    result.penaltiesApplied++;

    // Mark match as not_continued
    await db
      .update(matchSelections)
      .set({ status: 'not_continued', updatedAt: new Date() })
      .where(eq(matchSelections.id, matchSelectionId));

    result.matchUpdated = true;
  } else if (userQuestionnaire.willContinue && psychologistQuestionnaire.willContinue) {
    // Both agree to continue → trigger payment / advance status
    await db
      .update(matchSelections)
      .set({ status: 'continued', updatedAt: new Date() })
      .where(eq(matchSelections.id, matchSelectionId));

    result.matchUpdated = true;
  } else {
    // Both or user alone says no
    await db
      .update(matchSelections)
      .set({ status: 'not_continued', updatedAt: new Date() })
      .where(eq(matchSelections.id, matchSelectionId));

    result.matchUpdated = true;
  }

  // ─── Check 3: Duration mismatch ───────────────────────────────────────────
  const userDuration = userQuestionnaire.estimatedDurationMinutes;
  const psychDuration = psychologistQuestionnaire.estimatedDurationMinutes;

  if (
    userDuration !== null &&
    psychDuration !== null &&
    Math.abs(userDuration - psychDuration) > DURATION_MISMATCH_THRESHOLD_MINUTES
  ) {
    await db.insert(discrepancies).values({
      matchSelectionId,
      type: 'other',
      severity: 'minor',
      userResponse: {
        estimatedDurationMinutes: userDuration,
        respondentId: userQuestionnaire.respondentId,
      },
      psychologistResponse: {
        estimatedDurationMinutes: psychDuration,
        respondentId: psychologistQuestionnaire.respondentId,
      },
      resolution: 'pending',
    });

    result.discrepanciesFound++;
    result.types.push('duration_mismatch');
  }

  return result;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetches all questionnaires for a matchSelection.
 * Returns [userQuestionnaire | null, psychologistQuestionnaire | null].
 */
export async function fetchBothQuestionnaires(
  matchSelectionId: string,
): Promise<[QuestionnaireSnapshot | null, QuestionnaireSnapshot | null]> {
  const rows = await db
    .select()
    .from(postCallQuestionnaires)
    .where(eq(postCallQuestionnaires.matchSelectionId, matchSelectionId));

  const userRow = rows.find((r) => r.respondentType === 'user') ?? null;
  const psychRow = rows.find((r) => r.respondentType === 'psychologist') ?? null;

  return [
    userRow
      ? {
          id: userRow.id,
          matchSelectionId: userRow.matchSelectionId,
          respondentType: 'user',
          respondentId: userRow.respondentId,
          callHappened: userRow.callHappened,
          estimatedDurationMinutes: userRow.estimatedDurationMinutes,
          willContinue: userRow.willContinue,
          satisfactionRating: userRow.satisfactionRating,
          notes: userRow.notes,
        }
      : null,
    psychRow
      ? {
          id: psychRow.id,
          matchSelectionId: psychRow.matchSelectionId,
          respondentType: 'psychologist',
          respondentId: psychRow.respondentId,
          callHappened: psychRow.callHappened,
          estimatedDurationMinutes: psychRow.estimatedDurationMinutes,
          willContinue: psychRow.willContinue,
          satisfactionRating: psychRow.satisfactionRating,
          notes: psychRow.notes,
        }
      : null,
  ];
}
