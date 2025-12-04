"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThrottleState } from "@/lib/auth";

export type UserHomeData = {
  greetingName: string;
  agent: { status: "running" | "offline" | "missing"; version: string; lastSeenAt: string };
  plan: "trial" | "free" | "pro" | "enterprise";
  trialExpiresAt: string;
  tokens: { used: number; quota: number; throttleState: ThrottleState; hardBlockAt?: number };
  activity: { time: string; title: string; detail?: string }[];
  quickActions: { id: string; label: string; description?: string }[];
  suggestions: { title: string; prompt: string }[];
  productScore: number;
  badges: string[];
  security: { status: "ok" | "warn"; items: string[] };
  trust: { strictMode: boolean; sensitiveSkills: string[] };
};

export function UserHome({ data }: { data: UserHomeData }) {
  const [countdown, setCountdown] = useState(formatCountdown(data.trialExpiresAt));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(formatCountdown(data.trialExpiresAt));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [data.trialExpiresAt]);

  const tokenPct = useMemo(() => {
    if (!data.tokens.quota) return 0;
    return Math.min(100, Math.round((data.tokens.used / data.tokens.quota) * 100));
  }, [data.tokens.quota, data.tokens.used]);

  const tokenTone =
    tokenPct < 60 ? "emerald" : tokenPct < 90 ? "amber" : tokenPct < 100 ? "rose" : "red";

  const agentLabel =
    data.agent.status === "running"
      ? "Agent running"
      : data.agent.status === "offline"
        ? "Agent offline"
        : "Agent not installed";

  const agentTone =
    data.agent.status === "running"
      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
      : data.agent.status === "offline"
        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
        : "bg-rose-500/10 text-rose-300 border border-rose-500/30";

  const throttleLabel =
    data.tokens.throttleState === "normal"
      ? "Normal"
      : data.tokens.throttleState === "warning"
        ? "Warning"
        : "Throttled";

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-800/40 bg-gradient-to-r from-emerald-500/10 via-zinc-950 to-black p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">User Cockpit · Neyraq</p>
            <h1 className="text-3xl font-semibold text-zinc-50">Hey {data.greetingName}, Neyraq is active and ready.</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-200">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${agentTone}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {agentLabel}
              </span>
              <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
                Agent version {data.agent.version} · Last seen {new Date(data.agent.lastSeenAt).toLocaleTimeString("de-DE")}
              </span>
              {data.agent.status !== "running" && (
                <button className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-950 hover:bg-emerald-400">
                  Install / reconnect agent
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right text-xs text-zinc-300">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-200">
              Plan: {data.plan}
            </span>
            {data.plan === "trial" && (
              <span className="rounded-full border border-emerald-700/40 bg-emerald-700/10 px-3 py-1 text-emerald-200">
                Trial ends in {countdown}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard
          title="Trial & plan"
          badge={data.plan === "trial" ? "Trial" : data.plan.toUpperCase()}
          badgeTone="emerald"
          body={
            <p className="mt-2 text-sm text-zinc-200">
              {countdown} full access left.{" "}
              <button className="text-emerald-300 underline underline-offset-2">Choose plan now</button>
            </p>
          }
        />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Tokens & throttle</span>
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                data.tokens.throttleState === "normal"
                  ? "bg-emerald-500/10 text-emerald-300"
                  : data.tokens.throttleState === "warning"
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-rose-500/10 text-rose-300"
              }`}
            >
              {throttleLabel}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {data.tokens.used.toLocaleString()} / {data.tokens.quota.toLocaleString()}
          </p>
          <div className="mt-3 h-2 rounded-full bg-zinc-900">
            <div
              className={`h-full rounded-full ${
                tokenTone === "emerald"
                  ? "bg-emerald-500"
                  : tokenTone === "amber"
                    ? "bg-amber-400"
                    : "bg-rose-500"
              }`}
              style={{ width: `${tokenPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            At 100% speed is reduced (throttling). Hard limit: {data.tokens.hardBlockAt?.toLocaleString() ?? "n/a"} tokens.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Productivity score</span>
            <span className="rounded-full bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300">
              Badges: {data.badges.join(", ")}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{data.productScore}/100</p>
          <div className="mt-3 flex gap-2 text-xs text-zinc-400">
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">
              Automations active
            </span>
            <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-cyan-300">
              Budget in view
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-50">What Neyraq did for you today</p>
            <span className="text-xs text-zinc-500">Timeline</span>
          </div>
          <div className="mt-3 space-y-3">
            {data.activity.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2"
              >
                <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-400">{item.time}</p>
                  <p className="text-sm font-semibold text-zinc-50">{item.title}</p>
                  {item.detail && <p className="text-xs text-zinc-500">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">Security check</p>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                  data.security.status === "ok"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-amber-500/10 text-amber-300"
                }`}
              >
                {data.security.status === "ok" ? "All good" : "Attention"}
              </span>
            </div>
            <ul className="mt-2 space-y-2 text-xs text-zinc-300">
              {data.security.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-50">Trust controls</p>
              <span className="text-xs text-zinc-400">
                {data.trust.strictMode ? "Strict mode" : "Full control"}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Sensitive skills: {data.trust.sensitiveSkills.join(", ")}
            </p>
            <button className="mt-3 w-full rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400">
              {data.trust.strictMode ? "Enable full control" : "Enable strict mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCountdown(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return "0:00:00";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function InfoCard({
  title,
  badge,
  badgeTone,
  body,
}: {
  title: string;
  badge: string;
  badgeTone: "emerald" | "cyan" | "amber";
  body: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-300",
    cyan: "bg-cyan-500/10 text-cyan-300",
    amber: "bg-amber-500/10 text-amber-300",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{title}</span>
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${toneMap[badgeTone]}`}>
          {badge}
        </span>
      </div>
      {body}
    </div>
  );
}
