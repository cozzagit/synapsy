import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  real,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { psychologistProfiles, modalityEnum } from './psychologists';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const caseStatusEnum = pgEnum('case_status', [
  'pending',
  'matching',
  'matched',
  'in_call',
  'completed',
  'expired',
  'cancelled',
]);

export const preferredGenderEnum = pgEnum('preferred_gender', [
  'male',
  'female',
  'no_preference',
]);

export const candidacyStatusEnum = pgEnum('candidacy_status', [
  'pending',
  'accepted',
  'rejected',
  'expired',
]);

export const matchSelectionStatusEnum = pgEnum('match_selection_status', [
  'selected',
  'call_scheduled',
  'call_completed',
  'continued',
  'not_continued',
  'disputed',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const cases = pgTable(
  'cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    referralPsychologistId: uuid('referral_psychologist_id').references(
      () => psychologistProfiles.id,
      { onDelete: 'set null' },
    ),

    // Lifecycle status
    status: caseStatusEnum('status').notNull().default('pending'),

    // Questionnaire answers (structured JSON)
    questionnaireData: jsonb('questionnaire_data').$type<Record<string, unknown>>().notNull().default({}),

    // Clinical context
    primaryProblem: text('primary_problem').notNull().default(''),
    context: text('context').notNull().default(''),
    intensity: integer('intensity').notNull().default(1), // 1–5

    // Patient preferences
    preferredModality: modalityEnum('preferred_modality').notNull(),
    preferredGender: preferredGenderEnum('preferred_gender').notNull().default('no_preference'),
    preferredApproaches: jsonb('preferred_approaches').$type<string[]>(),

    // AI embedding (text for now, will migrate to pgvector)
    caseEmbedding: text('case_embedding'),

    // Key lifecycle timestamps
    matchedAt: timestamp('matched_at', { withTimezone: true, mode: 'date' }),
    completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('cases_user_id_idx').on(table.userId),
    index('cases_status_idx').on(table.status),
    index('cases_referral_psychologist_id_idx').on(table.referralPsychologistId),
    index('cases_created_at_idx').on(table.createdAt),
  ],
);

export const candidacies = pgTable(
  'candidacies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),

    // Matching output
    compatibilityScore: real('compatibility_score').notNull(),
    scoreBreakdown: jsonb('score_breakdown').$type<Record<string, number>>().notNull().default({}),

    // Candidacy lifecycle
    status: candidacyStatusEnum('status').notNull().default('pending'),
    respondedAt: timestamp('responded_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('candidacies_case_id_idx').on(table.caseId),
    index('candidacies_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('candidacies_status_idx').on(table.status),
    index('candidacies_compatibility_score_idx').on(table.compatibilityScore),
  ],
);

export const matchSelections = pgTable(
  'match_selections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    candidacyId: uuid('candidacy_id')
      .notNull()
      .references(() => candidacies.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),

    // Selection lifecycle
    status: matchSelectionStatusEnum('status').notNull().default('selected'),

    // Call scheduling
    callScheduledAt: timestamp('call_scheduled_at', { withTimezone: true, mode: 'date' }),
    callCompletedAt: timestamp('call_completed_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('match_selections_case_id_idx').on(table.caseId),
    index('match_selections_candidacy_id_idx').on(table.candidacyId),
    index('match_selections_user_id_idx').on(table.userId),
    index('match_selections_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('match_selections_status_idx').on(table.status),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const casesRelations = relations(cases, ({ one, many }) => ({
  user: one(users, {
    fields: [cases.userId],
    references: [users.id],
  }),
  referralPsychologist: one(psychologistProfiles, {
    fields: [cases.referralPsychologistId],
    references: [psychologistProfiles.id],
  }),
  candidacies: many(candidacies),
  matchSelections: many(matchSelections),
}));

export const candidaciesRelations = relations(candidacies, ({ one, many }) => ({
  case: one(cases, {
    fields: [candidacies.caseId],
    references: [cases.id],
  }),
  psychologistProfile: one(psychologistProfiles, {
    fields: [candidacies.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
  matchSelections: many(matchSelections),
}));

export const matchSelectionsRelations = relations(matchSelections, ({ one }) => ({
  case: one(cases, {
    fields: [matchSelections.caseId],
    references: [cases.id],
  }),
  candidacy: one(candidacies, {
    fields: [matchSelections.candidacyId],
    references: [candidacies.id],
  }),
  user: one(users, {
    fields: [matchSelections.userId],
    references: [users.id],
  }),
  psychologistProfile: one(psychologistProfiles, {
    fields: [matchSelections.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
}));
