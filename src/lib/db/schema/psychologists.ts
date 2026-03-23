import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  real,
  jsonb,
  timestamp,
  time,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const modalityEnum = pgEnum('modality', ['online', 'in_person', 'both']);

export const growthStageEnum = pgEnum('growth_stage', [
  'seed',
  'germoglio',
  'crescita',
  'fioritura',
  'radici',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const psychologistProfiles = pgTable(
  'psychologist_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Professional credentials
    alboNumber: text('albo_number').notNull(),
    alboRegion: text('albo_region').notNull(),

    // Clinical profile (stored as JSONB arrays)
    treatedAreas: jsonb('treated_areas').$type<string[]>().notNull().default([]),
    therapeuticApproaches: jsonb('therapeutic_approaches').$type<string[]>().notNull().default([]),
    targetPatients: jsonb('target_patients').$type<string[]>().notNull().default([]),
    exclusions: jsonb('exclusions').$type<string[]>().notNull().default([]),

    // Session preferences
    modality: modalityEnum('modality').notNull(),

    // Public profile content
    bio: text('bio').notNull().default(''),
    shortBio: text('short_bio').notNull().default(''),
    videoIntroUrl: text('video_intro_url'),

    // Capacity management
    maxNewPatientsPerWeek: integer('max_new_patients_per_week').notNull().default(5),
    currentCaseload: integer('current_caseload').notNull().default(0),

    // Languages (default Italian)
    languages: jsonb('languages').$type<string[]>().notNull().default(['it']),

    // Verification status
    isVerified: boolean('is_verified').notNull().default(false),
    verifiedAt: timestamp('verified_at', { withTimezone: true, mode: 'date' }),

    // Ranking metrics
    rankingScore: real('ranking_score').notNull().default(50),
    continuityRate: real('continuity_rate').notNull().default(0),
    conversionRate: real('conversion_rate').notNull().default(0),
    averageResponseTime: real('average_response_time').notNull().default(0),

    // Growth gamification stage
    growthStage: growthStageEnum('growth_stage').notNull().default('seed'),

    // AI embedding (text for now, will migrate to pgvector)
    profileEmbedding: text('profile_embedding'),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    uniqueIndex('psychologist_profiles_user_id_unique').on(table.userId),
    index('psychologist_profiles_is_verified_idx').on(table.isVerified),
    index('psychologist_profiles_ranking_score_idx').on(table.rankingScore),
    index('psychologist_profiles_growth_stage_idx').on(table.growthStage),
    index('psychologist_profiles_modality_idx').on(table.modality),
    index('psychologist_profiles_deleted_at_idx').on(table.deletedAt),
  ],
);

export const psychologistAvailabilities = pgTable(
  'psychologist_availabilities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    dayOfWeek: integer('day_of_week').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('psychologist_availabilities_profile_id_idx').on(table.psychologistProfileId),
    index('psychologist_availabilities_day_of_week_idx').on(table.dayOfWeek),
    index('psychologist_availabilities_is_active_idx').on(table.isActive),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const psychologistProfilesRelations = relations(
  psychologistProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [psychologistProfiles.userId],
      references: [users.id],
    }),
    availabilities: many(psychologistAvailabilities),
  }),
);

export const psychologistAvailabilitiesRelations = relations(
  psychologistAvailabilities,
  ({ one }) => ({
    psychologistProfile: one(psychologistProfiles, {
      fields: [psychologistAvailabilities.psychologistProfileId],
      references: [psychologistProfiles.id],
    }),
  }),
);
