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
      description: goodDeeds.description,
      mood: goodDeeds.mood,
      impact: goodDeeds.impact,
      deedDate: sql`to_char(${goodDeeds.deedDate}, 'YYYY-MM-DD')`,
    })
    .from(goodDeeds)
    .where(eq(goodDeeds.userId, session.user.id))
    .orderBy(desc(goodDeeds.deedDate));

  const header = "date,description,mood,impact";
  const csv = rows
    .map(
      (r) =>
        `${r.deedDate},"${(r.description || "").replace(/"/g, '""')}",${r.mood || ""},"${(r.impact || "").replace(/"/g, '""')}"`
    )
    .join("\n");

  return new NextResponse(`${header}\n${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dagdaad-export.csv"`,
    },
  });
}
