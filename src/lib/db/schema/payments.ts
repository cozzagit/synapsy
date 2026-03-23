import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { psychologistProfiles } from './psychologists';
import { matchSelections, cases } from './cases';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const paymentTypeEnum = pgEnum('payment_type', [
  'selection_fee',
  'continuity_fee',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'failed',
  'refunded',
]);

export const creditStatusEnum = pgEnum('credit_status', [
  'available',
  'used',
  'expired',
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    matchSelectionId: uuid('match_selection_id')
      .notNull()
      .references(() => matchSelections.id, { onDelete: 'restrict' }),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'restrict' }),

    // Payment details
    type: paymentTypeEnum('type').notNull(),
    amount: integer('amount').notNull(), // stored in cents
    currency: text('currency').notNull().default('EUR'),
    status: paymentStatusEnum('status').notNull().default('pending'),

    // Stripe integration
    stripePaymentIntentId: text('stripe_payment_intent_id'),

    // Billing lifecycle
    dueAt: timestamp('due_at', { withTimezone: true, mode: 'date' }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('payments_match_selection_id_idx').on(table.matchSelectionId),
    index('payments_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('payments_status_idx').on(table.status),
    index('payments_type_idx').on(table.type),
    index('payments_stripe_payment_intent_id_idx').on(table.stripePaymentIntentId),
    index('payments_due_at_idx').on(table.dueAt),
  ],
);

export const credits = pgTable(
  'credits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    psychologistProfileId: uuid('psychologist_profile_id')
      .notNull()
      .references(() => psychologistProfiles.id, { onDelete: 'restrict' }),
    originCaseId: uuid('origin_case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'restrict' }),

    // Credit lifecycle
    status: creditStatusEnum('status').notNull().default('available'),
    usedForPaymentId: uuid('used_for_payment_id').references(() => payments.id, {
      onDelete: 'set null',
    }),

    // Validity window
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true, mode: 'date' }),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('credits_psychologist_profile_id_idx').on(table.psychologistProfileId),
    index('credits_origin_case_id_idx').on(table.originCaseId),
    index('credits_status_idx').on(table.status),
    index('credits_expires_at_idx').on(table.expiresAt),
    index('credits_used_for_payment_id_idx').on(table.usedForPaymentId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  matchSelection: one(matchSelections, {
    fields: [payments.matchSelectionId],
    references: [matchSelections.id],
  }),
  psychologistProfile: one(psychologistProfiles, {
    fields: [payments.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
  credits: many(credits),
}));

export const creditsRelations = relations(credits, ({ one }) => ({
  psychologistProfile: one(psychologistProfiles, {
    fields: [credits.psychologistProfileId],
    references: [psychologistProfiles.id],
  }),
  originCase: one(cases, {
    fields: [credits.originCaseId],
    references: [cases.id],
  }),
  usedForPayment: one(payments, {
    fields: [credits.usedForPaymentId],
    references: [payments.id],
  }),
}));
