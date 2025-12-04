"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, type ReactNode, type SVGProps } from "react";
import type { SessionUser } from "@/lib/auth";

type Audience = "user" | "company";

type NavItem = {
  href: string;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  audiences: Audience[];
  labelForUser?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Cockpit", Icon: GaugeIcon, audiences: ["user", "company"] },
  {
    href: "/agents",
    label: "Fleet",
    labelForUser: "My Devices",
    Icon: MonitorIcon,
    audiences: ["user", "company"],
  },
  {
    href: "/software",
    label: "Software Distribution",
    Icon: PackageIcon,
    audiences: ["company"],
  },
  { href: "/store", label: "Service Store", Icon: StoreIcon, audiences: ["company"] },
  { href: "/tickets", label: "Tickets", Icon: TicketIcon, audiences: ["company"] },
];

export function Shell({ children, session }: { children: ReactNode; session: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const canSee = (item: NavItem) => {
    if (session.tenantType === "user") {
      return item.audiences.includes("user");
    }
    return item.audiences.includes("company");
  };

  const navHref = (href: string) => ({ pathname: href });

  const timeLeft = timeUntil(new Date(session.trialExpiresAt));

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const collapsed = navCollapsed;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside
        className={`hidden flex-col border-r border-zinc-800 bg-black/60 py-6 transition-all duration-200 md:flex ${
          collapsed ? "w-20 px-2 items-center" : "w-64 px-4"
        }`}
      >
        <Link
          href={navHref("/dashboard")}
          className={`mb-6 flex items-center gap-2 px-2 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {!collapsed && (
            <span className="text-xs font-semibold tracking-[0.24em] text-zinc-300">NEYRAQ CLOUD</span>
          )}
        </Link>
        <nav className="space-y-1 text-base">
          {navItems.filter(canSee).map((item) => {
            const active = pathname?.startsWith(item.href);
            const label = session.tenantType === "user" && item.labelForUser ? item.labelForUser : item.label;
            return (
              <Link
                key={item.href}
                href={navHref(item.href)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                  active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:-translate-y-0.5 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
                title={label}
              >
                <item.Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-emerald-700" : "text-emerald-300 group-hover:text-emerald-200"
                  }`}
                  aria-hidden
                />
                <span className={collapsed ? "sr-only" : ""}>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="relative mt-auto w-full border-t border-zinc-800 pt-4" ref={menuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-semibold text-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-900"
            title="Profile"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-emerald-950">
              {initials(session.displayName)}
            </span>
            {!collapsed && (
              <span className="flex flex-col text-xs text-zinc-300">
                <span className="text-sm font-semibold text-zinc-100">{session.displayName}</span>
                <span className="text-[11px] text-zinc-500">{session.email}</span>
              </span>
            )}
          </button>
          {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-100 shadow-lg">
              <Link
                href="/settings"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
              >
                Settings
              </Link>
              <Link
                href="/usage"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
              >
                Billing & Usage
              </Link>
              <Link
                href="/settings?section=language"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
              >
                Language: English
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/login");
                  router.refresh();
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-black/60 px-4 py-3">
          <button
            type="button"
            onClick={() => setNavCollapsed((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="flex flex-col" aria-hidden="true" />
        </header>
        <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4 py-6">
          <div className="mx-auto w-full max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}

function GaugeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 14a2 2 0 1 0-2-2" />
      <path d="M13.5 7.5 16 4" />
      <path d="M5.5 19.5A9 9 0 1 1 18.5 19.5" />
    </svg>
  );
}

function TicketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 9.5a2.5 2.5 0 0 1 0-5h7.5L14 7v10l-3.5 2.5H3a2.5 2.5 0 1 1 0-5" />
      <path d="M14 7h4.5a2.5 2.5 0 0 1 0 5H14" />
      <path d="M8 7v10" />
    </svg>
  );
}

function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3.5 7 8.5-4 8.5 4-8.5 4z" />
      <path d="M12 11v9.5" />
      <path d="M3.5 7v9.5l8.5 4 8.5-4V7" />
      <path d="m12 7.5 8.5-4" />
    </svg>
  );
}

function StoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 9V6.5l2-3h12l2 3V9" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function MonitorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 20h6" />
      <path d="M12 17v3" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15-.9-1.5.9-1.5-1.1-1.1-1.5.9-1.5-.9-.9-1.5.9-1.5-1.1-1.1-1.5.9-1.5-.9-.9 1.1.9 1.5-.9 1.5-1.5.9-1.1-1.1-.9 1.5.9 1.5-.9 1.5 1.1 1.1 1.5-.9 1.5.9.9 1.5-.9 1.5 1.1 1.1 1.5-.9 1.5.9.9-1.5-.9-1.5 1.5-.9z" />
    </svg>
  );
}

function UsageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="3" />
      <path d="M7 13v3" />
      <path d="M12 8v8" />
      <path d="M17 11v5" />
    </svg>
  );
}

function timeUntil(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "abgelaufen";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function initials(name: string) {
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last || "NA").toUpperCase();
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
