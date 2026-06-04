import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { referralCodes, referralRedemptions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateCode(): string {
  return randomBytes(4).toString("base64url").toLowerCase();
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Find or create referral code
  let [row] = await db
    .select()
    .from(referralCodes)
    .where(eq(referralCodes.userId, session.user.id))
    .limit(1);

  if (!row) {
    const code = generateCode();
    [row] = await db
      .insert(referralCodes)
      .values({ userId: session.user.id, code })
      .returning();
  }

  // Count successful redemptions
  const { count } = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(referralRedemptions)
    .where(eq(referralRedemptions.referrerId, session.user.id))
    .then((r) => r[0] || { count: 0 });

  return NextResponse.json({
    code: row.code,
    url: `https://dagdaad.nl/ref/${row.code}`,
    redemptions: count,
  });
}
