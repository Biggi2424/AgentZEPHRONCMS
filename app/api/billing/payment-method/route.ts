import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type Payload = { cardNumber?: string; expMonth?: number; expYear?: number; brand?: string };

function detectBrand(cardNumber: string): string {
  const trimmed = cardNumber.replace(/\s|-/g, "");
  if (/^4[0-9]{6,}$/.test(trimmed)) return "visa";
  if (/^5[1-5][0-9]{5,}$/.test(trimmed) || /^2(2[2-9]|[3-6][0-9]|7[01])[0-9]{4,}$/.test(trimmed)) return "mastercard";
  if (/^3[47][0-9]{5,}$/.test(trimmed)) return "amex";
  return "card";
}

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  const db = getDb();
  const body = (await request.json()) as Payload;

  const rawCard = (body.cardNumber ?? "").replace(/\s|-/g, "");
  const expMonth = Number(body.expMonth ?? 0);
  const expYear = Number(body.expYear ?? 0);
  const brand = (body.brand || detectBrand(rawCard)).toLowerCase();

  if (!rawCard || rawCard.length < 12 || rawCard.length > 19) {
    return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
  }
  if (!expMonth || expMonth < 1 || expMonth > 12) {
    return NextResponse.json({ error: "Invalid expiration month" }, { status: 400 });
  }
  if (!expYear || expYear < new Date().getFullYear() || expYear > new Date().getFullYear() + 15) {
    return NextResponse.json({ error: "Invalid expiration year" }, { status: 400 });
  }
  const now = new Date();
  const currentYm = now.getFullYear() * 12 + now.getMonth() + 1;
  const cardYm = expYear * 12 + expMonth;
  if (cardYm < currentYm) {
    return NextResponse.json({ error: "Card is expired" }, { status: 400 });
  }

  const last4 = rawCard.slice(-4);
  const fingerprint = createHash("sha256").update(rawCard).digest("hex");

  const existing = await db.paymentMethod.findFirst({
    where: { tenantId: session.tenantId, fingerprint },
  });
  if (existing) {
    return NextResponse.json({ error: "Diese Karte ist bereits hinterlegt." }, { status: 409 });
  }

  const paymentMethod = await db.paymentMethod.create({
    data: {
      tenantId: session.tenantId,
      userId: session.id,
      brand,
      last4,
      expMonth,
      expYear,
      fingerprint,
      status: "active",
    },
  });

  return NextResponse.json({ ok: true, paymentMethod }, { status: 201 });
}
