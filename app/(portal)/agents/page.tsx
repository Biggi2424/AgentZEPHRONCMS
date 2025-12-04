import { AgentActions } from "@/components/agents/AgentActions";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

type AgentWithRelations = {
  id: string;
  deviceName: string;
  osVersion: string;
  neyraqVersion: string;
  onlineStatus: string;
  lastSeenAt: Date | null;
  tags: string[];
  user: { displayName: string } | null;
  events: { id: bigint; eventType: string; message: string; createdAt: Date }[];
};

export default async function AgentsPage() {
  const session = await getCurrentUser();
  const db = getDb();
  const agents = (await db.agent.findMany({
    where:
      session.tenantType === "user"
        ? { tenantId: session.tenantId, userId: session.id }
        : { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      events: { orderBy: { createdAt: "desc" }, take: 3 },
      user: { select: { displayName: true } },
    },
  })) as AgentWithRelations[];

  const onlineCount = agents.filter((a) => a.onlineStatus === "online").length;
  const offlineCount = agents.length - onlineCount;

  return (
    <div className="w-full space-y-8 px-6">
      {session.tenantType === "user" ? (
        <UserDevices agents={agents} onlineCount={onlineCount} offlineCount={offlineCount} />
      ) : (
        <CompanyFleet agents={agents} onlineCount={onlineCount} offlineCount={offlineCount} />
      )}
    </div>
  );
}

function UserDevices({
  agents,
  onlineCount,
  offlineCount,
}: {
  agents: AgentWithRelations[];
  onlineCount: number;
  offlineCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">My devices</h1>
          <p className="text-sm text-zinc-400">
            Neyraq runs on your devices; status, version, and latest actions at a glance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <StatCard label="Online" value={onlineCount.toString()} tone="emerald" className="col-span-12 sm:col-span-4" />
        <StatCard label="Offline" value={offlineCount.toString()} tone="amber" className="col-span-12 sm:col-span-4" />
        <StatCard label="Agents total" value={agents.length.toString()} tone="cyan" className="col-span-12 sm:col-span-4" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="col-span-12 md:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Endpoint</p>
                <p className="text-lg font-semibold text-zinc-50">{agent.deviceName}</p>
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
                {agent.onlineStatus === "online" ? "Online" : "Offline"}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Last seen: {agent.lastSeenAt ? new Date(agent.lastSeenAt).toLocaleString("de-DE") : "n/a"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
              <AgentActions agentId={agent.id} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-xs text-zinc-400">Recent events</p>
                <ul className="mt-2 space-y-1 text-xs text-zinc-200">
                  {agent.events.length === 0 && <li className="text-zinc-500">No events yet</li>}
                  {agent.events.map((event) => (
                    <li key={event.id.toString()} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        <span className="font-semibold text-zinc-100">{event.eventType}</span>{" "}
                        <span className="text-zinc-400">{event.message}</span>
                        <span className="block text-[10px] text-zinc-500">
                          {new Date(event.createdAt).toLocaleString("de-DE")}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-xs text-zinc-400">Tags</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-200">
                  {agent.tags.length === 0 && <li className="text-zinc-500">No tags</li>}
                  {agent.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-100"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyFleet({
  agents,
  onlineCount,
  offlineCount,
}: {
  agents: AgentWithRelations[];
  onlineCount: number;
  offlineCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Flottenübersicht</h1>
          <p className="text-sm text-zinc-400">Company view: departments, OS versions, and online status.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <StatCard label="Agents online" value={onlineCount.toString()} tone="emerald" className="col-span-12 sm:col-span-4" />
        <StatCard label="Agents offline" value={offlineCount.toString()} tone="amber" className="col-span-12 sm:col-span-4" />
        <StatCard label="Agents total" value={agents.length.toString()} tone="cyan" className="col-span-12 sm:col-span-4" />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-50">Geräte</p>
          <span className="text-xs text-zinc-400">Live aus Postgres</span>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="col-span-12 md:col-span-6 lg:col-span-4 rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="text-sm font-semibold text-zinc-50">{agent.deviceName}</p>
              <p className="text-xs text-zinc-400">{agent.user?.displayName ?? "Unassigned"}</p>
              <p className="text-xs text-zinc-400">{agent.osVersion}</p>
              <div className="mt-2 text-xs">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-[0.7rem] font-semibold ${
                    agent.onlineStatus === "online"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {agent.onlineStatus}
                </span>
              </div>
            </div>
          ))}
          {agents.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Agents.</p>}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  className = "",
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "cyan";
  className?: string;
}) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    amber: "text-amber-300 bg-amber-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
  };
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${toneMap[tone]}`}>
        {value}
      </p>
    </div>
  );
}
