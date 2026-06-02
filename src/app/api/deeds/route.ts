import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { description, mood, impact, date } = await request.json();
  if (!description?.trim()) {
    return NextResponse.json({ error: "请输入内容" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO good_deeds (user_id, description, mood, impact, deed_date)
    VALUES (${session.user.id}, ${description}, ${mood || null}, ${impact || null}, ${date || new Date().toISOString().split("T")[0]})
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0]?.id });
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const limit = parseInt(searchParams.get("limit") || "100");

  if (month) {
    const rows = await sql`
      SELECT id, description, mood, impact, deed_date
      FROM good_deeds
      WHERE user_id = ${session.user.id}
        AND to_char(deed_date, 'YYYY-MM') = ${month}
      ORDER BY deed_date DESC
      LIMIT ${limit}
    `;
    return NextResponse.json({ deeds: rows });
  }

  const rows = await sql`
    SELECT id, description, mood, impact, deed_date
    FROM good_deeds
    WHERE user_id = ${session.user.id}
    ORDER BY deed_date DESC
    LIMIT ${limit}
  `;
  return NextResponse.json({ deeds: rows });
}
