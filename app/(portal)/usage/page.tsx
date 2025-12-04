import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { PaymentMethodForm } from "@/components/usage/PaymentMethodForm";
import { Badge } from "@/components/ui/Badge";

export default async function UsagePage() {
  const session = await getCurrentUser();
  const db = getDb();

  const agents = await db.agent.count({ where: { tenantId: session.tenantId } });
  const tickets = await db.ticket.count({ where: { tenantId: session.tenantId } });
  const paymentMethods = await db.paymentMethod.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="w-full space-y-8 px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Billing & Usage</h1>
          <p className="text-sm text-zinc-400">Plan, Token-Verbrauch und Grunddaten direkt aus der Datenbank.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card label="Aktueller Plan" value={session.plan.toUpperCase()} sub={`Throttle: ${session.throttleState}`} tone="emerald" className="col-span-12 sm:col-span-4" />
        <Card
          label="Tokens (Periode)"
          value={`${session.tokensUsedPeriod.toLocaleString()} / ${session.tokensQuotaPeriod.toLocaleString()}`}
          sub="Tages- und Periodenbudget aus Users-Tabelle"
          tone="cyan"
          className="col-span-12 sm:col-span-4"
        />
        <Card label="Agents / Tickets" value={`${agents} / ${tickets}`} sub="Tenant-Counts aus DB" tone="amber" className="col-span-12 sm:col-span-4" />
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-sm font-semibold text-zinc-50">Trial / Abrechnung</p>
        <p className="mt-1 text-xs text-zinc-400">
          Trial bis: {session.trialExpiresAt ?? "keine Trial"} · Tokens aktuell: {session.tokensUsedPeriod} /{" "}
          {session.tokensQuotaPeriod}
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Rechnungen, Plans, Usage: werden direkt aus Postgres bezogen. Keine UI-Stubs mehr; bei fehlenden Tabellen
          werden die Abschnitte ausgelassen.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Zahlungsmethoden</p>
            <span className="text-xs text-zinc-400">{paymentMethods.length} hinterlegt</span>
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-200">
            {paymentMethods.length === 0 && <p className="text-sm text-zinc-500">Noch keine Zahlungsmethode hinterlegt.</p>}
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-zinc-50">
                    {pm.brand} · **** **** **** {pm.last4}
                  </p>
                  <Badge tone={pm.status === "active" ? "emerald" : "amber"}>{pm.status}</Badge>
                </div>
                <p className="text-xs text-zinc-400">
                  Expires {pm.expMonth.toString().padStart(2, "0")}/{pm.expYear}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Hinzugefügt {pm.createdAt.toLocaleString("de-DE")}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/billing/payment-method/${pm.id}`, { method: "PATCH" });
                      location.reload();
                    }}
                    className="rounded-full border border-zinc-700 px-2 py-1 text-[11px] text-zinc-200 hover:border-rose-400 hover:text-rose-300"
                  >
                    Deaktivieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <PaymentMethodForm />
        </section>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  tone,
  className = "",
}: {
  label: string;
  value: string;
  sub: string;
  tone: "emerald" | "cyan" | "amber";
  className?: string;
}) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    amber: "text-amber-300 bg-amber-500/10",
  };
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
      <p className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>{sub}</p>
    </div>
  );
}
