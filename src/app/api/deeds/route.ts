import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { goodDeeds } from "@/lib/db/schema";
import { desc, and, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getEntitlement } from "@/lib/db/quota";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { description, mood, impact, date } = await request.json();
  if (!description?.trim()) {
    return NextResponse.json({ error: "Voer een beschrijving in" }, { status: 400 });
  }

  // Quota check — only for current-month deeds
  if (!date || date === sql`CURRENT_DATE`) {
    const entitlement = await getEntitlement(session.user.id);
    if (entitlement.remaining <= 0) {
      return NextResponse.json(
        { error: "Je hebt dit maand je gratis limiet bereikt. Upgrade naar Pro voor onbeperkt noteren." },
        { status: 403 }
      );
    }
  }

  const [row] = await db
    .insert(goodDeeds)
    .values({
      userId: session.user.id,
      description,
      mood: mood || null,
      impact: impact || null,
      deedDate: date || sql`CURRENT_DATE`,
    })
    .returning({ id: goodDeeds.id });

  return NextResponse.json({ id: row?.id });
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const limit = parseInt(searchParams.get("limit") || "100");

  const conditions = [eq(goodDeeds.userId, session.user.id)];

  // Free users: only see current month
  const entitlement = await getEntitlement(session.user.id);
  if (!entitlement.isPro && !month) {
    conditions.push(
      sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM') = ${new Date()
        .toISOString()
        .slice(0, 7)}`
    );
  }

  if (month) {
    conditions.push(sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM') = ${month}`);
    // Free users can't view past months via API
    if (!entitlement.isPro) {
      const thisMonth = new Date().toISOString().slice(0, 7);
      if (month !== thisMonth) {
        return NextResponse.json({ deeds: [] });
      }
    }
  }

  const rows = await db
    .select({
      id: goodDeeds.id,
      description: goodDeeds.description,
      mood: goodDeeds.mood,
      impact: goodDeeds.impact,
      deedDate: sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM-DD')`,
    })
    .from(goodDeeds)
    .where(and(...conditions))
    .orderBy(desc(goodDeeds.deedDate))
    .limit(limit);

  return NextResponse.json({ deeds: rows });
}
