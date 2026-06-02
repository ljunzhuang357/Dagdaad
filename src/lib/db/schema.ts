import { integer, text, date, timestamp, pgTable, serial, index, foreignKey } from "drizzle-orm/pg-core";

export const goodDeeds = pgTable(
  "good_deeds",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    deedDate: date("deed_date").notNull().defaultNow(),
    description: text("description").notNull(),
    mood: text("mood"),
    impact: text("impact"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_good_deeds_user").on(table.userId),
    index("idx_good_deeds_user_date").on(table.userId, table.deedDate),
  ]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    plan: text("plan", { enum: ["monthly", "yearly"] }).notNull(),
    status: text("status", { enum: ["active", "canceled", "expired", "past_due"] }).notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    creemSubscriptionId: text("creem_subscription_id"),
    creemCustomerId: text("creem_customer_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_subscriptions_user").on(table.userId),
    index("idx_subscriptions_creem").on(table.creemSubscriptionId),
  ]
);
