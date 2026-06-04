import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const res = await fetch("https://api.creem.io/v1/checkouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CREEM_API_KEY!,
    },
    body: JSON.stringify({
      product_id: process.env.CREEM_PRODUCT_ID,
      success_url: process.env.NEXT_PUBLIC_APP_URL || "https://dagdaad.nl",
      customer: { email: session.user.email },
      metadata: { user_id: session.user.id },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[creem/checkout]", res.status, err);
    return NextResponse.json(
      { error: "Kon geen betaalsessie aanmaken" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ checkout_url: data.checkout_url });
}
