import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { referralCodes, referralRedemptions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Ongeldige code" }, { status: 400 });
  }

  // Find the referral code
  const [ref] = await db
    .select()
    .from(referralCodes)
    .where(eq(referralCodes.code, code.toLowerCase()))
    .limit(1);

  if (!ref) {
    return NextResponse.json({ error: "Code niet gevonden" }, { status: 404 });
  }

  // Can't refer yourself
  if (ref.userId === session.user.id) {
    return NextResponse.json({ error: "Je kunt jezelf niet uitnodigen" }, { status: 400 });
  }

  // Check if already redeemed by this user
  const [existing] = await db
    .select()
    .from(referralRedemptions)
    .where(
      and(
        eq(referralRedemptions.code, code.toLowerCase()),
        eq(referralRedemptions.refereeId, session.user.id)
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: "Code al gebruikt" }, { status: 400 });
  }

  // Create redemption
  await db.insert(referralRedemptions).values({
    referrerId: ref.userId,
    refereeId: session.user.id,
    code: code.toLowerCase(),
  });

  return NextResponse.json({ ok: true });
}
