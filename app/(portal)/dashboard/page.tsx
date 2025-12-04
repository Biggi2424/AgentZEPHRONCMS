import type React from "react";
import type { PlanType, SessionUser } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";
import type { UserHomeData } from "@/components/user/UserHome";
import { UserHome } from "@/components/user/UserHome";

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (session.tenantType === "user") {
    const data = buildUserHomeData(session);
    return <UserHome data={data} />;
  }

  return <CompanyDashboard />;
}

function buildUserHomeData(session: SessionUser): UserHomeData {
  return {
    greetingName: session.displayName,
    agent: { status: "running", version: "1.4.2", lastSeenAt: new Date().toISOString() },
    plan: session.plan,
    trialExpiresAt: session.trialExpiresAt,
    tokens: {
      used: session.tokensUsedPeriod,
      quota: session.tokensQuotaPeriod,
      throttleState: session.throttleState,
      hardBlockAt: session.tokensQuotaPeriod * 1.2,
    },
    activity: [
      { time: "08:34", title: "Opened Edge" },
      { time: "08:36", title: "Moved PDF to Projects folder" },
      { time: "08:40", title: "Ran diagnostics for Word" },
      { time: "08:47", title: "Restarted Teams (silent)" },
    ],
    quickActions: [
      { id: "open-browser", label: "Browser öffnen", description: "Edge oder Standardbrowser starten" },
      { id: "show-downloads", label: "Downloads anzeigen", description: "Ordner Downloads öffnen" },
      { id: "check-mail", label: "E-Mails checken", description: "Outlook öffnen und Sync prüfen" },
      { id: "start-teams", label: "Teams starten", description: "Teams mit Autologin öffnen" },
      { id: "system-health", label: "Systemstatus prüfen", description: "CPU/RAM/Disk schnelle Analyse" },
      { id: "collect-logs", label: "Logs sammeln", description: "Eventlogs + App-Logs bündeln" },
    ],
    suggestions: [
      { title: "Sort downloads by voice", prompt: "Sort my Downloads folder by file type." },
      { title: "Repair Teams", prompt: "Repair Teams and clear its cache." },
      { title: "Backup check", prompt: "Verify last backups completed cleanly." },
    ],
    productScore: 72,
    badges: ["Automation beginner", "Trial active"],
    security: {
      status: "ok",
      items: ["Startup reviewed", "Disk space OK", "No critical events"],
    },
    trust: {
      strictMode: true,
      sensitiveSkills: ["File delete", "Registry changes", "Remote commands without prompt"],
    },
  };
}

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

const companyData = {
  tenant: {
    name: "VDMA (Demo Tenant)",
    id: "tenant-001",
    users: 142,
    devices: 510,
    regions: ["DE-Frankfurt", "AT-Vienna", "CH-Zurich"],
  },
  leadership: {
    owner: "Neyraq Admin",
    email: "neyraq.admin@vdma.example",
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

function CompanyDashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Company Command Center</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Tenant Uebersicht</h1>
            <p className="mt-2 max-w-4xl text-sm text-zinc-200">
              Company-Sicht: Geräte, Tickets, Deployments und Security-Status.
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
