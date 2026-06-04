import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { goodDeeds } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getEntitlement } from "@/lib/db/quota";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const ent = await getEntitlement(session.user.id);
  if (!ent.isPro) {
    return NextResponse.json({ error: "Alleen voor Pro-leden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  // Per-month breakdown
  const byMonth = await db
    .select({
      month: sql<string>`to_char(${goodDeeds.deedDate}, 'MM')`,
      count: sql<number>`count(*)::int`,
    })
    .from(goodDeeds)
    .where(
      sql`${goodDeeds.userId} = ${session.user.id} AND to_char(${goodDeeds.deedDate}, 'YYYY') = ${year}`
    )
    .groupBy(sql`to_char(${goodDeeds.deedDate}, 'MM')`)
    .orderBy(sql`to_char(${goodDeeds.deedDate}, 'MM')`);

  // Mood distribution
  const byMood = await db
    .select({
      mood: goodDeeds.mood,
      count: sql<number>`count(*)::int`,
    })
    .from(goodDeeds)
    .where(
      sql`${goodDeeds.userId} = ${session.user.id} AND to_char(${goodDeeds.deedDate}, 'YYYY') = ${year}`
    )
    .groupBy(goodDeeds.mood)
    .orderBy(sql`count(*) desc`);

  // Total count
  const [totalRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(goodDeeds)
    .where(
      sql`${goodDeeds.userId} = ${session.user.id} AND to_char(${goodDeeds.deedDate}, 'YYYY') = ${year}`
    );

  // Impact distribution
  const byImpact = await db
    .select({
      impact: goodDeeds.impact,
      count: sql<number>`count(*)::int`,
    })
    .from(goodDeeds)
    .where(
      sql`${goodDeeds.userId} = ${session.user.id} AND to_char(${goodDeeds.deedDate}, 'YYYY') = ${year}`
    )
    .groupBy(goodDeeds.impact)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  return NextResponse.json({
    year: parseInt(year),
    total: totalRow?.count || 0,
    byMonth: byMonth.map((m) => ({ month: parseInt(m.month), count: m.count })),
    byMood: byMood.filter((m) => m.mood),
    byImpact: byImpact.filter((i) => i.impact),
  });
}
