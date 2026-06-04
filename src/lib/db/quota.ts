import { db } from "./index";
import { subscriptions, goodDeeds } from "./schema";
import { and, eq, sql } from "drizzle-orm";

export async function getEntitlement(userId: string) {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);

  const isPro =
    !!sub && new Date(sub.currentPeriodEnd) > new Date();

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(goodDeeds)
    .where(
      and(
        eq(goodDeeds.userId, userId),
        sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM') = ${new Date()
          .toISOString()
          .slice(0, 7)}`
      )
    );

  const monthlyUsed = row?.count ?? 0;
  const monthlyLimit = isPro ? Infinity : 30;

  return {
    isPro,
    monthlyUsed,
    monthlyLimit,
    remaining:
      monthlyLimit === Infinity ? Infinity : monthlyLimit - monthlyUsed,
  };
}
