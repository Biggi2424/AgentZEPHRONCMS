import { getCurrentUser } from "@/lib/auth";

const skills = [
  {
    id: "browser",
    name: "Browser öffnen",
    category: "Apps & Fenster",
    description: "Öffnet Edge/Chrome und lädt gewünschte Seite.",
    status: "active",
    tags: ["Empfohlen"],
  },
  {
    id: "downloads",
    name: "Downloads ordnen",
    category: "Dateisystem",
    description: "Sortiert Downloads nach Typ, räumt auf Wunsch leere Ordner.",
    status: "inactive",
    tags: ["Beta"],
  },
  {
    id: "teams",
    name: "Teams starten",
    category: "Apps & Fenster",
    description: "Startet Teams, prüft Login und Audio-Devices.",
    status: "active",
    tags: [],
  },
  {
    id: "health",
    name: "Systemstatus prüfen",
    category: "Systemwartung",
    description: "Schnelle Checks: CPU/RAM/Disk, Eventlog, Netzwerkeinstellungen.",
    status: "active",
    tags: ["Empfohlen"],
  },
];

const packs = [
  {
    id: "daily",
    name: "Daily Routine",
    description: "Browser, Mail, Teams, Health-Check – alles in einem Klick.",
  },
  {
    id: "office-setup",
    name: "Office Setup",
    description: "Office Apps reparieren, Cache leeren, Updates anstoßen.",
  },
  {
    id: "it-check",
    name: "IT-Check",
    description: "Kurze Security-Checks und Autostart-Bewertung.",
  },
];

export default async function SkillsPage() {
  const session = await getCurrentUser();

  if (session.tenantType !== "user") {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
        Skills & Automations are for user tenants. (Company: please define roles/permissions.)
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Skills & Automations</h1>
          <p className="text-sm text-zinc-400">
            All available desktop skills for you. Enable/disable with one click.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{skill.category}</p>
                <p className="text-lg font-semibold text-zinc-50">{skill.name}</p>
                <p className="text-sm text-zinc-400">{skill.description}</p>
                <div className="mt-2 flex gap-2 text-[11px]">
                  {skill.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  skill.status === "active"
                    ? "bg-emerald-500 text-emerald-950"
                    : "border border-zinc-700 bg-zinc-900 text-zinc-300"
                }`}
              >
                {skill.status === "active" ? "Aktiv" : "Aktivieren"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-50">Automation Packs</p>
          <span className="text-xs text-zinc-400">Bündel starten</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-sm text-zinc-200"
            >
              <p className="font-semibold text-zinc-50">{pack.name}</p>
              <p className="text-xs text-zinc-400">{pack.description}</p>
              <button className="mt-2 w-full rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400">
                Pack aktivieren
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
