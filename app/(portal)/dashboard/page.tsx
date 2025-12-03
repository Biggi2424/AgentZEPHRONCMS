import type React from "react";

type TenantType = "company" | "user";

type PageProps = {
  searchParams?: { tenantType?: string };
};

const companyData = {
  tenant: {
    name: "VDMA (Demo Tenant)",
    id: "tenant-001",
    users: 142,
    devices: 510,
    regions: ["DE-Frankfurt", "AT-Vienna", "CH-Zurich"],
  },
  leadership: {
    owner: "Zephron Admin",
    email: "zephron.admin@vdma.example",
    roles: ["Owner", "Admin"],
    controls: ["Abrechnung", "Rollen & Policies", "Integrationen"],
  },
  kpis: [
    { label: "Offene Tickets", value: "7", tone: "amber" },
    { label: "Aktive Deployments", value: "3", tone: "emerald" },
    { label: "Agents online", value: "32", tone: "cyan" },
    { label: "Service Requests heute", value: "14", tone: "violet" },
    { label: "Compliance Pass", value: "96%", tone: "emerald" },
    { label: "Patch Readiness", value: "88%", tone: "blue" },
  ],
  operations: [
    {
      title: "Deployments",
      detail: "Patch Wave 12, Office 365 Rollout, Agent Updates",
      status: "3 laufend / 11 geplant",
    },
    {
      title: "Tickets & Support",
      detail: "SLA 98%, 2 kritische Incidents, 4 Wartend auf User",
      status: "7 offen",
    },
    {
      title: "Automation",
      detail: "8 Playbooks aktiv (Onboarding, Reboot Windows, Collect Logs)",
      status: "Autopilot aktiv",
    },
    {
      title: "Integrationen",
      detail: "Entra ID, Intune, Defender, ServiceNow, Splunk",
      status: "5 verbunden",
    },
  ],
  security: [
    { label: "CIS Compliance", value: "96%", description: "Server + Clients" },
    { label: "AV Status", value: "Alle OK", description: "Defender Live" },
    { label: "Audit Events", value: "21 letzte 24h", description: "keine Kritisch" },
    { label: "Remote Actions", value: "RMM Live", description: "PowerShell, Reboot, WOL" },
  ],
  roles: [
    { role: "Owner", scope: "Billing, Policies, Alle Daten" },
    { role: "Admin", scope: "Policies, Deployments, Integrationen" },
    { role: "IT Ops", scope: "Monitoring, Rollouts, Tickets" },
    { role: "Support", scope: "Tickets, Remote Assist" },
    { role: "Security", scope: "Alerts, Compliance, Reports" },
    { role: "Viewer", scope: "Read-only Reports" },
  ],
  roadmap: [
    "Geplante Wartung: 08.12 22:00 CET (Patch Wave 13)",
    "Software-Katalog: neue SAP GUI Version validiert",
    "Security Review: MFA-Enforcement fuer Admin-Rollen",
    "FinOps: Kostenstellen-Report Q4 bereit",
  ],
};

const userData = {
  profile: {
    name: "Max Mustermann",
    email: "max.private@example.com",
    role: "Einzel-User",
    devices: 4,
    tickets: 2,
  },
  kpis: [
    { label: "Meine Tickets", value: "2", tone: "amber" },
    { label: "Geraete online", value: "2", tone: "emerald" },
    { label: "Self-Service", value: "1 aktiv", tone: "cyan" },
    { label: "Backups", value: "Letzte 3 OK", tone: "violet" },
  ],
  devices: [
    { name: "MAX-LAPTOP", os: "Windows 11", status: "online", health: "OK" },
    { name: "MAX-HOME-PC", os: "Windows 10", status: "offline", health: "Needs Reboot" },
    { name: "MAX-SURFACE", os: "Windows 11", status: "online", health: "OK" },
  ],
  tickets: [
    { id: "T-1042", title: "VPN trennt nach 5 Minuten", status: "in_progress" },
    { id: "T-1045", title: "Office Add-in Fehler", status: "waiting" },
  ],
  actions: [
    "Self-Service: Teams Repair",
    "Remote Assist anfragen",
    "Gerat Neustart planen",
    "Ticket eroeffnen",
    "Log-Sammlung starten",
  ],
  activity: [
    "Agent Check-in vor 12min",
    "Windows Update KB5033375 installiert",
    "Backup abgeschlossen heute 03:00",
    "Ticket T-1042 aktualisiert (Support antwortet)",
  ],
};

function Badge({
  tone,
  children,
}: {
  tone: "emerald" | "amber" | "cyan" | "violet" | "blue";
  children: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-300",
    amber: "bg-amber-500/10 text-amber-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    violet: "bg-violet-500/10 text-violet-300",
    blue: "bg-blue-500/10 text-blue-300",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
      {children}
    </span>
  );
}

function CompanyDashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Company Command Center</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Tenant Uebersicht</h1>
            <p className="mt-2 max-w-4xl text-sm text-zinc-200">
              Fullscreen-Ansicht fuer Unternehmens-Tenants: Operations, Security, Rollen und Roadmap in einem Blick.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
              <Badge tone="emerald">Regions: {companyData.tenant.regions.join(" · ")}</Badge>
              <Badge tone="cyan">Users: {companyData.tenant.users}</Badge>
              <Badge tone="blue">Devices: {companyData.tenant.devices}</Badge>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-black/30 px-4 py-3 text-sm text-zinc-200">
            <p className="text-xs text-emerald-300">Leadership</p>
            <p className="font-semibold text-zinc-50">{companyData.leadership.owner}</p>
            <p className="text-xs text-zinc-400">{companyData.leadership.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {companyData.leadership.roles.map((role) => (
                <span key={role} className="rounded-full bg-zinc-100 px-2 py-1 font-semibold text-zinc-900">
                  {role}
                </span>
              ))}
              {companyData.leadership.controls.map((item) => (
                <span key={item} className="rounded-full bg-zinc-900 px-2 py-1 text-zinc-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {companyData.kpis.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{item.label}</span>
              <Badge tone={item.tone as any}>Live</Badge>
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Operations Pipeline</p>
                <p className="text-lg font-semibold text-zinc-50">Deployments, Tickets, Automation</p>
              </div>
              <Badge tone="emerald">Live</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {companyData.operations.map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-50">{item.title}</p>
                    <span className="text-[11px] text-zinc-400">{item.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Rollen & Verantwortlichkeiten</p>
                <p className="text-lg font-semibold text-zinc-50">Policy-gestuetzter Zugriff</p>
              </div>
              <Badge tone="blue">{companyData.roles.length} Rollen</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {companyData.roles.map((entry) => (
                <div key={entry.role} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <p className="text-sm font-semibold text-zinc-50">{entry.role}</p>
                  <p className="mt-1 text-xs text-emerald-300">{entry.scope}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Security & Compliance</p>
                <p className="text-lg font-semibold text-zinc-50">Sicherheit auf Tenant-Level</p>
              </div>
              <Badge tone="emerald">OK</Badge>
            </div>
            <div className="mt-3 space-y-3">
              {companyData.security.map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-50">{item.label}</p>
                    <span className="text-sm text-emerald-300">{item.value}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Roadmap & Termine</p>
              <Badge tone="violet">Planung</Badge>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-200">
              {companyData.roadmap.map((item) => (
                <li key={item} className="rounded-lg border border-zinc-800 bg-black/40 p-2 text-xs">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-rose-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">User Cockpit</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Meine Umgebung</h1>
            <p className="mt-2 max-w-4xl text-sm text-zinc-200">
              Klar getrennte User-Sicht: nur eigene Geraete, Tickets, Self-Service und Aktivitaeten.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-black/30 px-4 py-3 text-sm text-zinc-200">
            <p className="text-xs text-emerald-300">Profil</p>
            <p className="font-semibold text-zinc-50">{userData.profile.name}</p>
            <p className="text-xs text-zinc-400">{userData.profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-zinc-100 px-2 py-1 font-semibold text-zinc-900">
                Rolle: {userData.profile.role}
              </span>
              <span className="rounded-full bg-zinc-900 px-2 py-1 text-zinc-200">
                Geraete: {userData.profile.devices}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {userData.kpis.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{item.label}</span>
              <Badge tone={(item.tone as any) ?? "emerald"}>User</Badge>
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Meine Geraete</p>
              <Badge tone="emerald">Health</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {userData.devices.map((device) => (
                <div key={device.name} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-50">{device.name}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        device.status === "online"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{device.os}</p>
                  <p className="mt-1 text-xs text-emerald-300">Health: {device.health}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Schnellaktionen</p>
              <Badge tone="cyan">Self-Service</Badge>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {userData.actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-left text-sm text-zinc-200 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Meine Tickets</p>
              <Badge tone="amber">{userData.tickets.length} offen</Badge>
            </div>
            <div className="mt-3 space-y-3">
              {userData.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-50">{ticket.title}</p>
                    <span className="text-[11px] capitalize text-zinc-400">
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300">{ticket.id}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Aktivitaet</p>
              <Badge tone="violet">Live</Badge>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-200">
              {userData.activity.map((item) => (
                <li key={item} className="rounded-lg border border-zinc-800 bg-black/40 p-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ searchParams }: PageProps) {
  const tenantType: TenantType = searchParams?.tenantType === "user" ? "user" : "company";

  return tenantType === "company" ? <CompanyDashboard /> : <UserDashboard />;
}
