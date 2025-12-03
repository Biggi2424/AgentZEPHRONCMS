import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const db = getDb();
  const user = await getCurrentUser();
  const { id } = await context.params;

  const ticket = await db.ticket.findFirst({
    where: { id, tenantId: user.tenantId },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const db = getDb();
  const user = await getCurrentUser();
  const { id } = await context.params;
  const body = await request.json();

  const ticket = await db.ticket.updateMany({
    where: { id, tenantId: user.tenantId },
    data: {
      status: body.status,
      priority: body.priority,
      assigneeUserId: body.assigneeUserId,
      updatedAt: new Date(),
    },
  });

  if (ticket.count === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const updated = await db.ticket.findFirst({
    where: { id, tenantId: user.tenantId },
  });

  return NextResponse.json(updated);
}
