import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { postCallQuestionnaires, matchSelections } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from '@/lib/auth/session';
import { detectAndHandleDiscrepancies, fetchBothQuestionnaires } from '@/lib/verification';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubmitVerificationBody {
  matchSelectionId: string;
  respondentType: 'user' | 'psychologist';
  respondentId: string;
  callHappened: boolean;
  estimatedDurationMinutes?: number | null;
  willContinue: boolean;
  satisfactionRating?: number | null;
  notes?: string | null;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateBody(body: unknown): { valid: true; data: SubmitVerificationBody } | { valid: false; message: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Body non valido' };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.matchSelectionId !== 'string' || !b.matchSelectionId.trim()) {
    return { valid: false, message: 'matchSelectionId richiesto' };
  }

  if (b.respondentType !== 'user' && b.respondentType !== 'psychologist') {
    return { valid: false, message: 'respondentType deve essere "user" o "psychologist"' };
  }

  if (typeof b.respondentId !== 'string' || !b.respondentId.trim()) {
    return { valid: false, message: 'respondentId richiesto' };
  }

  if (typeof b.callHappened !== 'boolean') {
    return { valid: false, message: 'callHappened deve essere un booleano' };
  }

  if (typeof b.willContinue !== 'boolean') {
    return { valid: false, message: 'willContinue deve essere un booleano' };
  }

  if (b.estimatedDurationMinutes !== undefined && b.estimatedDurationMinutes !== null) {
    const dur = Number(b.estimatedDurationMinutes);
    if (!Number.isInteger(dur) || dur < 1 || dur > 300) {
      return { valid: false, message: 'estimatedDurationMinutes deve essere tra 1 e 300 minuti' };
    }
  }

  if (b.satisfactionRating !== undefined && b.satisfactionRating !== null) {
    const rating = Number(b.satisfactionRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return { valid: false, message: 'satisfactionRating deve essere tra 1 e 5' };
    }
  }

  if (b.notes !== undefined && b.notes !== null && typeof b.notes !== 'string') {
    return { valid: false, message: 'notes deve essere una stringa' };
  }

  return {
    valid: true,
    data: {
      matchSelectionId: b.matchSelectionId as string,
      respondentType: b.respondentType as 'user' | 'psychologist',
      respondentId: b.respondentId as string,
      callHappened: b.callHappened as boolean,
      estimatedDurationMinutes:
        b.estimatedDurationMinutes !== undefined && b.estimatedDurationMinutes !== null
          ? Number(b.estimatedDurationMinutes)
          : null,
      willContinue: b.willContinue as boolean,
      satisfactionRating:
        b.satisfactionRating !== undefined && b.satisfactionRating !== null
          ? Number(b.satisfactionRating)
          : null,
      notes: typeof b.notes === 'string' ? b.notes.trim() || null : null,
    },
  };
}

// ─── POST /api/verification/submit ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Non autenticato' } },
        { status: 401 },
      );
    }

    const rawBody = await request.json();
    const validation = validateBody(rawBody);

    if (!validation.valid) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: validation.message } },
        { status: 400 },
      );
    }

    const {
      matchSelectionId,
      respondentType,
      callHappened,
      estimatedDurationMinutes,
      willContinue,
      satisfactionRating,
      notes,
    } = validation.data;

    // Always derive respondentId from the authenticated session — never trust the request body
    const respondentId = session.user.id;

    // Verify matchSelection exists
    const [match] = await db
      .select({ id: matchSelections.id })
      .from(matchSelections)
      .where(eq(matchSelections.id, matchSelectionId))
      .limit(1);

    if (!match) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Match non trovato' } },
        { status: 404 },
      );
    }

    // Prevent duplicate submissions from the same respondent
    const [existing] = await db
      .select({ id: postCallQuestionnaires.id })
      .from(postCallQuestionnaires)
      .where(
        and(
          eq(postCallQuestionnaires.matchSelectionId, matchSelectionId),
          eq(postCallQuestionnaires.respondentType, respondentType),
        ),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: { code: 'ALREADY_SUBMITTED', message: 'Hai già inviato il questionario per questo match' } },
        { status: 409 },
      );
    }

    // satisfactionRating is only meaningful for users
    const ratingToStore =
      respondentType === 'user' && satisfactionRating !== null ? satisfactionRating : null;

    // Insert questionnaire
    const [questionnaire] = await db
      .insert(postCallQuestionnaires)
      .values({
        matchSelectionId,
        respondentType,
        respondentId,
        callHappened,
        estimatedDurationMinutes: callHappened ? estimatedDurationMinutes : null,
        willContinue,
        satisfactionRating: ratingToStore,
        notes,
      })
      .returning();

    // Check if both parties have now responded
    const [userQuestionnaire, psychologistQuestionnaire] = await fetchBothQuestionnaires(matchSelectionId);

    let discrepancyResult = null;

    if (userQuestionnaire !== null && psychologistQuestionnaire !== null) {
      // Both sides in — run discrepancy detection
      discrepancyResult = await detectAndHandleDiscrepancies(
        userQuestionnaire,
        psychologistQuestionnaire,
      );
    }

    return NextResponse.json(
      {
        data: {
          questionnaireId: questionnaire.id,
          bothPartiesResponded: userQuestionnaire !== null && psychologistQuestionnaire !== null,
          discrepancies: discrepancyResult
            ? {
                found: discrepancyResult.discrepanciesFound,
                types: discrepancyResult.types,
                penaltiesApplied: discrepancyResult.penaltiesApplied,
                matchUpdated: discrepancyResult.matchUpdated,
              }
            : null,
        },
        meta: { version: 'v1' },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Verification submission error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Si è verificato un errore. Riprova più tardi.',
        },
      },
      { status: 500 },
    );
  }
}
