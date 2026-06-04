import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode: skip verification
  const computed = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computed === signature;
}

function calcPeriodEnd(billingPeriod: string, from: Date): Date {
  if (billingPeriod === "every-year") {
    return new Date(from.getFullYear() + 1, from.getMonth(), from.getDate());
  }
  return new Date(from.getFullYear(), from.getMonth() + 1, from.getDate());
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get("creem-signature") || "";

  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = payload.eventType as string;

  try {
    switch (eventType) {
      case "checkout.completed": {
        const meta = payload.object?.metadata || {};
        const sub = payload.object?.subscription;
        const customerId = payload.object?.customer?.id;
        const user_id = meta.user_id as string | undefined;
        if (!user_id || !sub?.id) {
          console.warn("[creem/webhook] checkout.completed missing user_id or sub id");
          return NextResponse.json({ ok: true });
        }

        const periodStart = new Date(sub.created_at || Date.now());
        const periodEnd = calcPeriodEnd(
          payload.object?.product?.billing_period || "every-month",
          periodStart
        );

        // upsert: if subscription already exists by creemSubscriptionId, update
        const existing = await db
          .select({ id: subscriptions.id })
          .from(subscriptions)
          .where(eq(subscriptions.creemSubscriptionId, sub.id))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(subscriptions)
            .set({
              status: "active",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existing[0].id));
        } else {
          await db.insert(subscriptions).values({
            userId: user_id,
            plan: "monthly",
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            creemSubscriptionId: sub.id,
            creemCustomerId: customerId || null,
          });
        }
        break;
      }

      case "subscription.active":
      case "subscription.paid": {
        const subId = payload.object?.id;
        const createdAt = payload.object?.created_at;
        if (!subId) break;

        const periodStart = new Date(createdAt || Date.now());
        const periodEnd = calcPeriodEnd(
          payload.object?.product?.billing_period || "every-month",
          periodStart
        );

        await db
          .update(subscriptions)
          .set({
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.creemSubscriptionId, subId));
        break;
      }

      case "subscription.canceled": {
        const cancelSubId = payload.object?.id;
        if (!cancelSubId) break;

        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            canceledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.creemSubscriptionId, cancelSubId));
        break;
      }

      case "subscription.expired": {
        const expireSubId = payload.object?.id;
        if (!expireSubId) break;

        await db
          .update(subscriptions)
          .set({
            status: "expired",
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.creemSubscriptionId, expireSubId));
        break;
      }

      default:
        console.log("[creem/webhook] unhandled event:", eventType);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[creem/webhook] error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
