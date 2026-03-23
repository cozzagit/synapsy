import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum("notification_type", [
  "new_case",
  "candidacy_accepted",
  "match_found",
  "call_reminder",
  "post_call_questionnaire",
  "payment_due",
  "payment_received",
  "credit_earned",
  "badge_awarded",
  "penalty_applied",
  "ranking_updated",
  "welcome",
  "system",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    link: text("link"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_is_read_idx").on(table.isRead),
    index("notifications_type_idx").on(table.type),
    index("notifications_created_at_idx").on(table.createdAt),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
