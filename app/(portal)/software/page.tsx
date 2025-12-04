import { CreateDeploymentForm } from "@/components/software/CreateDeploymentForm";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function SoftwarePage() {
  const session = await getCurrentUser();
  const db = getDb();

  if (session.tenantType !== "company") {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        Softwareverteilung ist nur für Company-Tenants sichtbar.
      </div>
    );
  }

  const [packages, deployments, deviceGroups, deploymentResults] = await Promise.all([
    db.package.findMany({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "desc" } }),
    db.deployment.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      include: { package: true, deviceGroup: true },
    }),
    db.deviceGroup.findMany({ where: { tenantId: session.tenantId }, orderBy: { name: "asc" } }),
    db.deploymentResult.findMany({ where: { tenantId: session.tenantId } }),
  ]);

  const activeDeployments = deployments.filter((d) => d.status === "pending" || d.status === "running").length;
  const totalResults = deploymentResults.length;

  return (
    <div className="w-full space-y-8 px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Software Distribution</h1>
          <p className="text-sm text-zinc-400">Packages, deployments, device groups – direkt aus der DB.</p>
        </div>
        <CreateDeploymentForm packages={packages} deviceGroups={deviceGroups} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Stat label="Pakete" value={packages.length.toString()} className="col-span-12 sm:col-span-4" />
        <Stat label="Deployments aktiv" value={activeDeployments.toString()} className="col-span-12 sm:col-span-4" />
        <Stat label="Deployment Results" value={totalResults.toString()} className="col-span-12 sm:col-span-4" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Packages</p>
            <span className="text-xs text-zinc-400">Alle Packages des Tenants</span>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-xl border border-zinc-800 bg-black/40 p-3 text-sm text-zinc-200">
                <p className="font-semibold text-zinc-50">{pkg.name}</p>
                <p className="text-xs text-zinc-400">
                  Version {pkg.version} · {pkg.type}
                </p>
                <p className="text-[11px] text-zinc-500">Reboot: {pkg.rebootBehavior}</p>
              </div>
            ))}
            {packages.length === 0 && <p className="col-span-12 text-sm text-zinc-500">Keine Pakete hinterlegt.</p>}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Deployments</p>
            <span className="text-xs text-zinc-400">Live Status</span>
          </div>
          <div className="mt-3 space-y-2">
            {deployments.length === 0 && <p className="text-sm text-zinc-500">Noch keine Deployments.</p>}
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-200"
              >
                <p className="font-semibold text-zinc-50">{deployment.name}</p>
                <p className="text-xs text-zinc-400">
                  {deployment.package?.name} → {deployment.deviceGroup?.name}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-zinc-900 px-2 py-1">{deployment.rolloutStrategy}</span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      deployment.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : deployment.status === "failed"
                          ? "bg-rose-500/10 text-rose-300"
                          : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {deployment.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {deployment.startTime ? new Date(deployment.startTime).toLocaleString("de-DE") : "Kein Start"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
    </div>
  );
}
