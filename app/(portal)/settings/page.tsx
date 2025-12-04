import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getCurrentUser();
  const tenantType = session.tenantType;
  const viewLabel = tenantType === "company" ? "Company" : "User";

  const companySettings = [
    "Branding (logo, colors) for all users",
    "Manage roles and permissions",
    "Integrations (SSO, ticketing, CMDB)",
    "Billing address and invoicing",
  ];

  const userSettings = [
    "Profile (name, contact) and notifications",
    "Password / SSO binding",
    "Device links",
    "Self-service defaults",
  ];

  const items = tenantType === "company" ? companySettings : userSettings;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Settings ({viewLabel} view)
          </h1>
          <p className="text-sm text-zinc-400">
            {tenantType === "company"
              ? "Tenant settings, branding, and role management."
              : "Personal settings for your account."}
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Dev Ansicht: {viewLabel}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs text-zinc-400">
          {tenantType === "company" ? "Tenant-wide" : "Only for you"}
        </p>
        <p className="text-lg font-semibold text-zinc-50">Configuration areas</p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-300"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
