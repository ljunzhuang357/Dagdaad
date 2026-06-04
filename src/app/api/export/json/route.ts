import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { goodDeeds } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
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

  const rows = await db
    .select({
      id: goodDeeds.id,
      description: goodDeeds.description,
      mood: goodDeeds.mood,
      impact: goodDeeds.impact,
      deedDate: sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM-DD')`,
      createdAt: goodDeeds.createdAt,
    })
    .from(goodDeeds)
    .where(eq(goodDeeds.userId, session.user.id))
    .orderBy(desc(goodDeeds.deedDate));

  return NextResponse.json({ deeds: rows, exportedAt: new Date().toISOString() });
}
