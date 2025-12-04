import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = (await request.json()) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email required", exists: false }, { status: 400 });
  }

  const user = await db.user.findFirst({ where: { email } });
  return NextResponse.json({ exists: !!user });
}
