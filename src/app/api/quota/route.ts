import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEntitlement } from "@/lib/db/quota";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const entitlement = await getEntitlement(session.user.id);
  return NextResponse.json(entitlement);
}
