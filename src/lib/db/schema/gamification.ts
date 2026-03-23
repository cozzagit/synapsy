import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  real,
  jsonb,
  timestamp,
  date,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { psychologistProfiles } from './psychologists';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const badgeTierEnum = pgEnum('badge_tier', [
  'foundation',
  'quality',
  'network',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const badges = pgTable(
  'badges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    tier: badgeTierEnum('tier').notNull(),
    iconName: text('icon_name').notNull(),

    // Machine-readable criteria for automated evaluation
    criteria: jsonb('criteria').$type<Record<string, unknown>>().notNull().default({}),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('badges_code_unique').on(table.code),
    index('badges_tier_idx').on(table.tier),
  ],
);

export const psychologistBadges = pgTable(
  'psychologist_badges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),
    badgeId: uuid('badge_id')
      .notNull()
      .references(() => badges.id, { onDelete: 'cascade' }),

    // Award lifecycle
    awardedAt: timestamp('awarded_at', { withTimezone: true, mode: 'date' }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'date' }),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('psychologist_badges_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('psychologist_badges_badge_id_idx').on(table.badgeId),
    index('psychologist_badges_is_active_idx').on(table.isActive),
    // A psychologist should only hold each badge once at a time
    uniqueIndex('psychologist_badges_profile_badge_unique').on(
      table.psychologistProfileId,
      table.badgeId,
    ),
  ],
);

export const rankingHistory = pgTable(
  'ranking_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'cascade' }),

    // Snapshot of all ranking dimensions
    rankingScore: real('ranking_score').notNull(),
    continuityRate: real('continuity_rate').notNull(),
    conversionRate: real('conversion_rate').notNull(),
    paymentReliability: real('payment_reliability').notNull(),
    discrepancyScore: real('discrepancy_score').notNull(),
    activityScore: real('activity_score').notNull(),

    // One snapshot per psychologist per day
    snapshotDate: date('snapshot_date').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('ranking_history_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('ranking_history_snapshot_date_idx').on(table.snapshotDate),
    // Prevent duplicate snapshots for the same psychologist on the same day
    uniqueIndex('ranking_history_profile_date_unique').on(
      table.psychologistProfileId,
      table.snapshotDate,
    ),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const badgesRelations = relations(badges, ({ many }) => ({
  psychologistBadges: many(psychologistBadges),
}));

export const psychologistBadgesRelations = relations(psychologistBadges, ({ one }) => ({
  psychologistProfile: one(psychologistProfiles, {
    fields: [psychologistBadges.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
  badge: one(badges, {
    fields: [psychologistBadges.badgeId],
    references: [badges.id],
  }),
}));

export const rankingHistoryRelations = relations(rankingHistory, ({ one }) => ({
  psychologistProfile: one(psychologistProfiles, {
    fields: [rankingHistory.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
}));
