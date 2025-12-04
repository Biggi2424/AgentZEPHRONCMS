import { getCurrentUser } from "@/lib/auth";

const userDevices = [
  {
    name: "DESKTOP-XYZ",
    type: "PC",
    os: "Windows 11 Pro 23H2",
    agentVersion: "1.4.2",
    status: "online",
    lastSeenAt: "2025-12-03T08:42:00Z",
    tasks: ["Update scheduled (18:00)", "Skill bundle installing"],
    recent: ["Opened Edge", "Moved PDF", "Ran Word diagnostics"],
  },
  {
    name: "LAPTOP-HOME",
    type: "Laptop",
    os: "Windows 10 22H2",
    agentVersion: "1.3.9",
    status: "offline",
    lastSeenAt: "2025-12-02T22:10:00Z",
    tasks: ["Reconnect agent recommended"],
    recent: ["Restarted Teams", "Cleared Outlook cache"],
  },
];

const companyFleet = [
  { name: "VDMA-LAP-023", owner: "IT Ops", os: "Windows 11", status: "online" },
  { name: "VDMA-LAP-017", owner: "Sales", os: "Windows 10", status: "offline" },
  { name: "VDMA-SRV-004", owner: "Datacenter", os: "Windows Server 2022", status: "online" },
  { name: "VDMA-LAP-031", owner: "Support", os: "Windows 11", status: "online" },
];

export default async function AgentsPage() {
  const session = await getCurrentUser();

  if (session.tenantType === "user") {
    return <UserDevices />;
  }

  return <CompanyFleet />;
}

function UserDevices() {
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

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Online" value="1" tone="emerald" />
        <StatCard label="Offline" value="1" tone="amber" />
        <StatCard label="Pending tasks" value="2" tone="cyan" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {userDevices.map((device) => (
          <div
            key={device.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{device.type}</p>
                <p className="text-lg font-semibold text-zinc-50">{device.name}</p>
                <p className="text-xs text-zinc-400">
                  {device.os} · Agent {device.agentVersion}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                  device.status === "online"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-amber-500/10 text-amber-300"
                }`}
              >
                {device.status === "online" ? "Online" : "Offline"}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Last seen: {new Date(device.lastSeenAt).toLocaleString("de-DE")}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
                <button className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 hover:border-emerald-500/40 hover:text-emerald-200">
                  Show details
                </button>
                <button className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 hover:border-emerald-500/40 hover:text-emerald-200">
                  Reconnect agent
                </button>
                <button className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 hover:border-rose-500/40 hover:text-rose-200">
                  Remove device
                </button>
              </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-xs text-zinc-400">Recent actions</p>
                <ul className="mt-2 space-y-1 text-xs text-zinc-200">
                  {device.recent.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-xs text-zinc-400">Pending tasks</p>
                <ul className="mt-2 space-y-1 text-xs text-zinc-200">
                  {device.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                      {task}
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

function CompanyFleet() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Flottenübersicht</h1>
          <p className="text-sm text-zinc-400">
            Company view: departments, OS versions, and online status.
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Agents online" value="32" tone="emerald" />
        <StatCard label="Agents offline" value="5" tone="amber" />
        <StatCard label="Pending Updates" value="11" tone="cyan" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Gerät</th>
              <th className="px-4 py-3 font-medium">Owner / Dept</th>
              <th className="px-4 py-3 font-medium">OS</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {companyFleet.map((device) => (
              <tr
                key={device.name}
                className="border-t border-zinc-800/80 text-zinc-200 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-3 font-semibold text-zinc-50">{device.name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{device.owner}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{device.os}</td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-[0.7rem] font-semibold ${
                      device.status === "online"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "cyan" }) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    amber: "text-amber-300 bg-amber-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${toneMap[tone]}`}>
        {value}
      </p>
    </div>
  );
}
