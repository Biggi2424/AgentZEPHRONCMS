import { getCurrentUser } from "@/lib/auth";

const usagePoints = [
  { date: "Mo", chat: 6200, voice: 1800, automation: 2400 },
  { date: "Di", chat: 5400, voice: 2200, automation: 2000 },
  { date: "Mi", chat: 7000, voice: 2600, automation: 2600 },
  { date: "Do", chat: 4800, voice: 1500, automation: 1800 },
  { date: "Fr", chat: 8200, voice: 2100, automation: 3200 },
  { date: "Sa", chat: 2600, voice: 600, automation: 800 },
  { date: "So", chat: 1800, voice: 400, automation: 600 },
];

const invoices = [
  { id: "INV-2025-11-01", date: "01.11.2025", amount: "29,00 €", status: "bezahlt" },
  { id: "INV-2025-12-01", date: "01.12.2025", amount: "29,00 €", status: "offen" },
];

export default async function UsagePage() {
  const session = await getCurrentUser();

  if (session.tenantType !== "user") {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        Verbrauch & Abrechnung ist in dieser Demo auf User-Tenants fokussiert. (Company: bitte Billing-API anbinden.)
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Verbrauch & Abrechnung</h1>
          <p className="text-sm text-zinc-400">
            Plan, Limits, Token-Verbrauch und Rechnungen im Überblick.
          </p>
        </div>
        <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400">
          Plan upgraden
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Aktueller Plan" value={session.plan.toUpperCase()} sub="Trial aktiv" tone="emerald" />
        <Card
          label="Nächste Abrechnung"
          value="01.01.2026"
          sub="1 Gerät aktiv von 3 erlaubt"
          tone="cyan"
        />
        <Card
          label="Tokens (heute)"
          value={`${session.tokensUsedPeriod.toLocaleString()} / ${session.tokensQuotaPeriod.toLocaleString()}`}
          sub="Ab 100% wird gedrosselt"
          tone="amber"
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-50">Tokenverbrauch (letzte 7 Tage)</p>
          <span className="text-xs text-zinc-400">Chat / Voice / Automations</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-7">
          {usagePoints.map((p) => (
            <div key={p.date} className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-black/40 p-3">
              <span className="text-xs text-zinc-500">{p.date}</span>
              <Bar label="Chat" value={p.chat} tone="emerald" />
              <Bar label="Voice" value={p.voice} tone="cyan" />
              <Bar label="Automation" value={p.automation} tone="amber" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Token & Limits (Details)</p>
            <span className="text-xs text-zinc-400">Chat / Voice / Automations</span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <MiniStat label="Chat" value="24.1k" tone="emerald" />
            <MiniStat label="Voice" value="7.2k" tone="cyan" />
            <MiniStat label="Automations" value="9.4k" tone="amber" />
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Hinweis: Throttle-State {session.throttleState}. Bei 100% Tagesbudget wird gedrosselt;
            Upgrade empfohlen.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">Rechnungen</p>
            <span className="text-xs text-zinc-400">Stripe / PDF-Download</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-200">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-3 py-2"
              >
                <div>
                  <p className="font-semibold text-zinc-50">{inv.id}</p>
                  <p className="text-xs text-zinc-400">{inv.date}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-300">{inv.amount}</span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      inv.status === "bezahlt"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {inv.status}
                  </span>
                  <button className="rounded-full border border-zinc-700 px-2 py-1 text-[11px] text-zinc-200 hover:border-emerald-500/40">
                    PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "emerald" | "cyan" | "amber" }) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    amber: "text-amber-300 bg-amber-500/10",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
      <p className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
        {sub}
      </p>
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: "emerald" | "cyan" | "amber" }) {
  const max = 9000;
  const pct = Math.min(100, Math.round((value / max) * 100));
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
  };
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-zinc-400">
        <span>{label}</span>
        <span>{value.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-zinc-900">
        <div className={`h-full rounded-full ${toneMap[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "emerald" | "cyan" | "amber" }) {
  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    amber: "text-amber-300 bg-amber-500/10",
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-lg font-semibold text-zinc-50">{value}</p>
      <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${toneMap[tone]}`}>
        Verbrauch
      </span>
    </div>
  );
}
