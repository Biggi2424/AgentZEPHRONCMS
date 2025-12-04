import { getCurrentUser } from "@/lib/auth";

type StoreItem = {
  name: string;
  desc: string;
  scope: "company" | "user" | "both";
};

const items: StoreItem[] = [
  { name: "VPN Client", desc: "Corporate VPN with SSO and always-on.", scope: "company" },
  { name: "M365 Apps", desc: "Office, Teams, OneDrive - tenant licensed.", scope: "both" },
  { name: "Remote Assist", desc: "Helpdesk remote support.", scope: "both" },
  { name: "Adobe Reader", desc: "PDF viewer for all devices.", scope: "both" },
  { name: "Personal Backup", desc: "Backups for private devices.", scope: "user" },
  { name: "Line-of-Business App", desc: "Specialized app for departments.", scope: "company" },
];

export default async function StorePage() {
  const session = await getCurrentUser();
  const tenantType = session.tenantType;
  const viewLabel = tenantType === "company" ? "Company" : "User";
  const visibleItems =
    tenantType === "company"
      ? items.filter((item) => item.scope === "both" || item.scope === "company")
      : items.filter((item) => item.scope === "both" || item.scope === "user");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Service Store ({viewLabel} view)
          </h1>
          <p className="text-sm text-zinc-400">
            {tenantType === "company"
              ? "Self-service catalog with department scopes."
              : "Only offers available to you."}
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visibleItems.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">{item.name}</p>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                {item.scope === "both" ? "alle" : item.scope}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">{item.desc}</p>
            <button className="mt-3 w-full rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400">
              {tenantType === "company" ? "Zu Deployment hinzufuegen" : "Installieren"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
