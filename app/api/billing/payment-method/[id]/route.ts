import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type Params = { params: { id: string } };

export async function PATCH(_request: Request, { params }: Params) {
  const session = await getCurrentUser();
  const db = getDb();
  const id = params.id;

  const pm = await db.paymentMethod.findUnique({ where: { id } });
  if (!pm || pm.tenantId !== session.tenantId) {
    return NextResponse.json({ error: "Payment method not found" }, { status: 404 });
  }

  const updated = await db.paymentMethod.update({
    where: { id },
    data: { status: "inactive" },
  });

  return NextResponse.json({ ok: true, paymentMethod: updated });
}
