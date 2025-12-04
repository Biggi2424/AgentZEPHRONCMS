import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type CardTone = "emerald" | "amber" | "cyan" | "blue";

export default async function DashboardPage() {
  const session = await getCurrentUser();
  const db = getDb();

  if (session.tenantType === "user") {
    const [agents, tickets] = await Promise.all([
      db.agent.findMany({
        where: { tenantId: session.tenantId, userId: session.id },
        orderBy: { createdAt: "desc" },
      }),
      db.ticket.findMany({
        where: { tenantId: session.tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const online = agents.filter((a) => a.onlineStatus === "online").length;

    return (
      <div className="w-full space-y-8 px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Workspace</p>
            <h1 className="text-3xl font-semibold text-zinc-50">Willkommen, {session.displayName}</h1>
            <p className="text-sm text-zinc-400">
              Plan {session.plan.toUpperCase()} · Trial endet {session.trialExpiresAt ?? "n/a"}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 grid grid-cols-12 gap-6">
            <Card
              label="Tokens (Periode)"
              value={`${session.tokensUsedPeriod.toLocaleString()} / ${session.tokensQuotaPeriod.toLocaleString()}`}
              tone="emerald"
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            />
            <Card label="Agents online" value={`${online}/${agents.length}`} tone="cyan" className="col-span-12 sm:col-span-6 lg:col-span-4" />
            <Card label="Tickets" value={`${tickets.length} offen`} tone="amber" className="col-span-12 sm:col-span-6 lg:col-span-4" />
          </div>

          <div className="col-span-12 grid grid-cols-12 gap-6">
            <section className="col-span-12 lg:col-span-6 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-50">Devices</p>
                <span className="text-xs text-zinc-400">Live aus Postgres</span>
              </div>
              <div className="grid grid-cols-12 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="col-span-12 sm:col-span-6 rounded-xl border border-zinc-800 bg-black/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-50">{agent.deviceName}</p>
                        <p className="text-xs text-zinc-400">
                          {agent.osVersion} · Agent {agent.neyraqVersion}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          agent.onlineStatus === "online"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {agent.onlineStatus}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">
                      Last seen: {agent.lastSeenAt ? new Date(agent.lastSeenAt).toLocaleString("de-DE") : "n/a"}
                    </p>
                  </div>
                ))}
                {agents.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Agents.</p>}
              </div>
            </section>

            <section className="col-span-12 lg:col-span-6 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-50">Tickets</p>
                <span className="text-xs text-zinc-400">Neueste Vorgänge</span>
              </div>
              <div className="grid grid-cols-12 gap-3">
                {tickets.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Tickets vorhanden.</p>}
                {tickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="col-span-12 sm:col-span-6 rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-sm text-zinc-200"
                  >
                    <p className="font-semibold text-zinc-50">
                      {ticket.humanId} · {ticket.title}
                    </p>
                    <p className="text-xs text-zinc-400">{ticket.status}</p>
                    <p className="text-[11px] text-zinc-500">
                      {new Date(ticket.createdAt).toLocaleString("de-DE")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  const [tenant, agents, tickets, deployments, catalogRequests] = await Promise.all([
    db.tenant.findUnique({ where: { id: session.tenantId } }),
    db.agent.findMany({ where: { tenantId: session.tenantId } }),
    db.ticket.findMany({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "desc" }, take: 8 }),
    db.deployment.findMany({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "desc" }, take: 6 }),
    db.catalogRequest.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { catalogItem: true },
    }),
  ]);

  const openTickets = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
  const runningDeployments = deployments.filter((d) => d.status === "running" || d.status === "pending").length;
  const online = agents.filter((a) => a.onlineStatus === "online").length;

  return (
    <div className="w-full space-y-8 px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Company Command Center</p>
          <h1 className="text-3xl font-semibold text-zinc-50">
            Tenant Overview · {tenant?.name ?? "Unknown tenant"}
          </h1>
          <p className="text-sm text-zinc-400">Live-Daten aus Postgres für Fleet, Tickets und Deployments.</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <Card label="Agents online" value={`${online}/${agents.length}`} tone="emerald" className="col-span-12 sm:col-span-6 lg:col-span-3" />
          <Card label="Offene Tickets" value={openTickets.toString()} tone="amber" className="col-span-12 sm:col-span-6 lg:col-span-3" />
          <Card label="Deployments aktiv" value={runningDeployments.toString()} tone="cyan" className="col-span-12 sm:col-span-6 lg:col-span-3" />
          <Card label="Service Requests" value={catalogRequests.length.toString()} tone="blue" className="col-span-12 sm:col-span-6 lg:col-span-3" />
        </div>

        <section className="col-span-12 lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Tickets</p>
            <span className="text-xs text-zinc-400">Top Vorgänge</span>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            {tickets.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Tickets vorhanden.</p>}
            {tickets.slice(0, 6).map((ticket) => (
              <div
                key={ticket.id}
                className="col-span-12 sm:col-span-6 rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-sm text-zinc-200"
              >
                <p className="font-semibold text-zinc-50">
                  {ticket.humanId} · {ticket.title}
                </p>
                <p className="text-xs text-zinc-400">
                  {ticket.status} · {ticket.priority}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {new Date(ticket.createdAt).toLocaleString("de-DE")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">Deployments</p>
              <span className="text-xs text-zinc-400">Pakete & Ringe</span>
            </div>
            <div className="mt-3 space-y-2">
              {deployments.length === 0 && <p className="text-sm text-zinc-500">Keine Deployments geplant.</p>}
              {deployments.slice(0, 4).map((deployment) => (
                <div key={deployment.id} className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-200">
                  <p className="font-semibold text-zinc-50">{deployment.name}</p>
                  <p className="text-xs text-zinc-400">
                    {deployment.rolloutStrategy} · Status {deployment.status}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {deployment.startTime ? new Date(deployment.startTime).toLocaleString("de-DE") : "Kein Start"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">Letzte Vorgänge</p>
              <span className="text-xs text-zinc-400">Activity</span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-zinc-200">
              {catalogRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2">
                  <p className="font-semibold text-zinc-50">{req.catalogItem?.title ?? "Catalog Item"}</p>
                  <p className="text-xs text-zinc-400">{req.status}</p>
                  <p className="text-[11px] text-zinc-500">
                    {new Date(req.createdAt).toLocaleString("de-DE")}
                  </p>
                </div>
              ))}
              {catalogRequests.length === 0 && <p className="text-sm text-zinc-500">Keine Activity.</p>}
            </div>
          </section>
        </div>

        <section className="col-span-12 lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Service Requests</p>
            <span className="text-xs text-zinc-400">Catalog Items & Deployments</span>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            {catalogRequests.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Requests.</p>}
            {catalogRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="col-span-12 sm:col-span-6 rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-sm text-zinc-200"
              >
                <p className="font-semibold text-zinc-50">{req.catalogItem?.title ?? "Catalog Item"}</p>
                <p className="text-xs text-zinc-400">{req.status}</p>
                <p className="text-[11px] text-zinc-500">
                  {new Date(req.createdAt).toLocaleString("de-DE")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Catalog</p>
            <span className="text-xs text-zinc-400">Aktiv</span>
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-200">
            {catalogRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="rounded-lg border border-zinc-800 bg-black/40 px-3 py-2">
                <p className="font-semibold text-zinc-50">{req.catalogItem?.title ?? "Catalog Item"}</p>
                <p className="text-xs text-zinc-400">{req.status}</p>
              </div>
            ))}
            {catalogRequests.length === 0 && <p className="text-sm text-zinc-500">Keine Catalog-Einträge.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  tone,
  className = "",
}: {
  label: string;
  value: string;
  tone: CardTone;
  className?: string;
}) {
  const toneMap: Record<CardTone, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    amber: "text-amber-300 bg-amber-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    blue: "text-blue-300 bg-blue-500/10",
  };
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
      <p className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
        Live aus DB
      </p>
    </div>
  );
}
