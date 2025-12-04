import { RequestButton } from "@/components/store/RequestButton";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function StorePage() {
  const session = await getCurrentUser();
  const db = getDb();

  const items = await db.catalogItem.findMany({
    where: { tenantId: session.tenantId, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const requests = await db.catalogRequest.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    include: { catalogItem: true },
    take: 10,
  });

  const viewLabel = session.tenantType === "company" ? "Company" : "User";

  return (
    <div className="w-full space-y-8 px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Service Store ({viewLabel})</h1>
          <p className="text-sm text-zinc-400">Catalog Items aus Postgres, Request erzeugt echte DB-Einträge.</p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          {items.length} Angebote
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {items.map((item) => (
          <div key={item.id} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">{item.title}</p>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">{item.category}</span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">{item.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-300">
              <span>{item.requiresApproval ? "Approval required" : "Self-service"}</span>
              <RequestButton catalogItemId={item.id} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine aktiven Catalog Items.</p>}
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-50">Letzte Requests</p>
          <span className="text-xs text-zinc-400">{requests.length} Einträge</span>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-3">
          {requests.map((req) => (
            <div key={req.id} className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-200">
              <p className="font-semibold text-zinc-50">{req.catalogItem?.title ?? "Catalog Item"}</p>
              <p className="text-xs text-zinc-400">{req.status}</p>
              <p className="text-[11px] text-zinc-500">{new Date(req.createdAt).toLocaleString("de-DE")}</p>
            </div>
          ))}
          {requests.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Requests erstellt.</p>}
        </div>
      </section>
    </div>
  );
}
