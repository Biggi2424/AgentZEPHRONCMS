type BadgeTone = "emerald" | "amber" | "cyan" | "rose";

const toneMap: Record<BadgeTone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-300",
  amber: "bg-amber-500/10 text-amber-300",
  cyan: "bg-cyan-500/10 text-cyan-300",
  rose: "bg-rose-500/10 text-rose-300",
};

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[tone]}`}>
      {children}
    </span>
  );
}
