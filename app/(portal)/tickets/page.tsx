import Link from "next/link";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const db = getDb();
  const user = await getCurrentUser();

  if (user.tenantType !== "company") {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        Ticketing is only visible for company tenants.
      </div>
    );
  }

  const tickets = await db.ticket.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const open = tickets.filter((t) => t.status === "new" || t.status === "in_progress" || t.status === "waiting").length;
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="w-full space-y-8 px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Tickets</h1>
          <p className="text-sm text-zinc-400">Live aus der tickets-Tabelle, keine Stubs.</p>
        </div>
        <CreateTicketForm />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <StatCard label="Tickets gesamt" value={tickets.length.toString()} className="col-span-12 sm:col-span-4" />
        <StatCard label="Offen / In Progress" value={open.toString()} className="col-span-12 sm:col-span-4" />
        <StatCard label="Gelöst / Geschlossen" value={resolved.toString()} className="col-span-12 sm:col-span-4" />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-50">Tickets (Top 12)</p>
          <span className="text-xs text-zinc-400">Neueste Vorgänge</span>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-3">
          {tickets.length === 0 && <p className="col-span-12 text-sm text-zinc-500">No tickets for this tenant yet.</p>}
          {tickets.slice(0, 12).map((ticket) => (
            <div
              key={ticket.id}
              className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-sm text-zinc-200"
            >
              <Link
                href={{ pathname: `/tickets/${ticket.id}` }}
                className="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                {(ticket.humanId ?? ticket.id).toUpperCase()} - {ticket.title}
              </Link>
              <p className="mt-1 text-xs text-zinc-400">
                {ticket.status.replace("_", " ")} · {ticket.priority}
              </p>
              <p className="text-[11px] text-zinc-500">{ticket.createdAt.toLocaleString("de-DE")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
    </div>
  );
}
