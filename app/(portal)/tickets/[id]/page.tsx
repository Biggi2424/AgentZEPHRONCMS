import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const db = getDb();
  const user = await getCurrentUser();
  const { id } = await params;

  const ticket = await db.ticket.findFirst({
    where: { id, tenantId: user.tenantId },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-50">
          {ticket.title}
        </h1>
        <p className="text-xs text-zinc-500">
          Ticket-ID {(ticket.humanId ?? ticket.id).toUpperCase()} · Quelle{" "}
          {ticket.source}
        </p>
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Status</span>
            <span className="inline-flex rounded-full bg-zinc-800 px-2 py-1 text-[0.7rem] capitalize text-zinc-100">
              {ticket.status.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Priorität</span>
            <span className="inline-flex rounded-full bg-rose-500/10 px-2 py-1 text-[0.7rem] capitalize text-rose-300">
              {ticket.priority}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Requester</span>
            <span className="text-sm text-zinc-200">
              {ticket.requesterUserId ?? "unbekannt"}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Beschreibung
          </h2>
          <p className="mt-2 text-zinc-200">
            {ticket.description || "Keine Beschreibung hinterlegt."}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Kommentare
          </h2>
          <p className="mt-3 text-xs text-zinc-500">
            Kommentar-Thread wird in einem späteren Schritt über{" "}
            <code>ticket_comments</code> angebunden.
          </p>
        </div>
      </div>
    </div>
  );
}
