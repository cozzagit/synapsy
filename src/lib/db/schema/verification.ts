import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { psychologistProfiles } from './psychologists';
import { matchSelections } from './cases';
import { payments } from './payments';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const respondentTypeEnum = pgEnum('respondent_type', ['user', 'psychologist']);

export const discrepancyTypeEnum = pgEnum('discrepancy_type', [
  'call_happened',
  'continuity',
  'other',
]);

export const discrepancySeverityEnum = pgEnum('discrepancy_severity', [
  'minor',
  'major',
  'critical',
]);

export const discrepancyResolutionEnum = pgEnum('discrepancy_resolution', [
  'pending',
  'resolved_user',
  'resolved_psychologist',
  'penalty_applied',
  'dismissed',
]);

export const penaltyTypeEnum = pgEnum('penalty_type', [
  'visibility_reduction',
  'lead_block',
  'suspension',
  'removal',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const postCallQuestionnaires = pgTable(
  'post_call_questionnaires',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    matchSelectionId: uuid('match_selection_id')
      .notNull()
      .references(() => matchSelections.id, { onDelete: 'cascade' }),

    // Who responded
    respondentType: respondentTypeEnum('respondent_type').notNull(),
    respondentId: uuid('respondent_id').notNull(), // userId or psychologistProfileId

    // Questionnaire answers
    callHappened: boolean('call_happened').notNull(),
    estimatedDurationMinutes: integer('estimated_duration_minutes'),
    willContinue: boolean('will_continue').notNull(),
    satisfactionRating: integer('satisfaction_rating'), // 1–5, nullable
    notes: text('notes'),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('post_call_questionnaires_match_selection_id_idx').on(table.matchSelectionId),
    index('post_call_questionnaires_respondent_id_idx').on(table.respondentId),
    index('post_call_questionnaires_respondent_type_idx').on(table.respondentType),
  ],
);

export const discrepancies = pgTable(
  'discrepancies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    matchSelectionId: uuid('match_selection_id')
      .notNull()
      .references(() => matchSelections.id, { onDelete: 'cascade' }),

    // Discrepancy classification
    type: discrepancyTypeEnum('type').notNull(),
    severity: discrepancySeverityEnum('severity').notNull(),

    // Both sides of the discrepancy
    userResponse: jsonb('user_response').$type<Record<string, unknown>>().notNull(),
    psychologistResponse: jsonb('psychologist_response').$type<Record<string, unknown>>().notNull(),

    // Resolution lifecycle
    resolution: discrepancyResolutionEnum('resolution').notNull().default('pending'),
    resolvedAt: timestamp('resolved_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('discrepancies_match_selection_id_idx').on(table.matchSelectionId),
    index('discrepancies_type_idx').on(table.type),
    index('discrepancies_severity_idx').on(table.severity),
    index('discrepancies_resolution_idx').on(table.resolution),
  ],
);

export const penalties = pgTable(
  'penalties',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),

    // Penalty classification
    type: penaltyTypeEnum('type').notNull(),
    reason: text('reason').notNull(),

    // Optional link to the triggering discrepancy
    discrepancyId: uuid('discrepancy_id').references(() => discrepancies.id, {
      onDelete: 'set null',
    }),

    // Active window (null endsAt = permanent)
    startsAt: timestamp('starts_at', { withTimezone: true, mode: 'date' }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true, mode: 'date' }),
    isActive: boolean('is_active').notNull().default(true),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('penalties_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('penalties_type_idx').on(table.type),
    index('penalties_is_active_idx').on(table.isActive),
    index('penalties_discrepancy_id_idx').on(table.discrepancyId),
    index('penalties_starts_at_ends_at_idx').on(table.startsAt, table.endsAt),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const postCallQuestionnairesRelations = relations(postCallQuestionnaires, ({ one }) => ({
  matchSelection: one(matchSelections, {
    fields: [postCallQuestionnaires.matchSelectionId],
    references: [matchSelections.id],
  }),
}));

export const discrepanciesRelations = relations(discrepancies, ({ one, many }) => ({
  matchSelection: one(matchSelections, {
    fields: [discrepancies.matchSelectionId],
    references: [matchSelections.id],
  }),
  penalties: many(penalties),
}));

export const penaltiesRelations = relations(penalties, ({ one }) => ({
  psychologistProfile: one(psychologistProfiles, {
    fields: [penalties.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
  discrepancy: one(discrepancies, {
    fields: [penalties.discrepancyId],
    references: [discrepancies.id],
  }),
}));
