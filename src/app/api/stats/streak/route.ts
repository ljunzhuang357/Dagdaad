import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { goodDeeds } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const rows = await db
    .select({ deedDate: sql<string>`to_char(${goodDeeds.deedDate}, 'YYYY-MM-DD')` })
    .from(goodDeeds)
    .where(eq(goodDeeds.userId, session.user.id))
    .orderBy(desc(goodDeeds.deedDate));

  const uniqueDates = [...new Set(rows.map((r) => r.deedDate))].sort().reverse();

  // Calculate current streak
  let streak = 0;
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

  // If no deeds today, check if we should start from yesterday
  const startFrom = uniqueDates[0] === todayStr
    ? todayStr
    : uniqueDates[0] === yesterdayStr
      ? yesterdayStr
      : null;

  if (startFrom) {
    const startIdx = uniqueDates.indexOf(startFrom);
    streak = 1;
    for (let i = startIdx + 1; i < uniqueDates.length; i++) {
      const expected = new Date(startFrom);
      expected.setDate(expected.getDate() - streak);
      if (uniqueDates[i] === expected.toISOString().slice(0, 10)) {
        streak++;
      } else {
        break;
      }
    }
  }

  return NextResponse.json({
    streak,
    hasToday: uniqueDates[0] === todayStr,
    totalDays: uniqueDates.length,
  });
}
