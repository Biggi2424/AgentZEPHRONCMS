"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Stage = "email" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("email");
  const [checking, setChecking] = useState(false);

  const checkEmail = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setChecking(true);
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.exists) {
        throw new Error(data.error || "E-Mail nicht gefunden");
      }
      setStage("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "E-Mail nicht gefunden");
    } finally {
      setChecking(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Sign in</p>
          <h1 className="text-3xl font-semibold text-zinc-50">Neyraq Account</h1>
          <p className="text-sm text-zinc-400">
            Erst E-Mail pruefen, dann Passwort eingeben. Keine Schnellschuesse.
          </p>
        </div>

        <div className="relative mt-6 min-h-[260px] overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-400 ${
              stage === "email" ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
            }`}
          >
            <form onSubmit={checkEmail} className="space-y-4">
              <div className="space-y-2">
                <label className="sr-only" htmlFor="email">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="E-Mail"
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={checking || !email}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {checking ? "Pruefe E-Mail..." : "Weiter"}
              </button>
              <p className="text-xs text-zinc-500">
                Kein Account?{" "}
                <a className="text-emerald-300 underline" href="/register">
                  Registrieren
                </a>
              </p>
            </form>
          </div>

          <div
            className={`absolute inset-0 transition-all duration-400 ${
              stage === "password" ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
            }`}
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-black/50 px-4 py-3 text-sm text-zinc-300">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">E-Mail</p>
                <p className="font-semibold text-zinc-100">{email}</p>
              </div>

              <div className="space-y-2">
                <label className="sr-only" htmlFor="password">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Passwort"
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500 transition-opacity duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Anmeldung..." : "Login"}
              </button>
              <p className="text-xs text-zinc-500">
                Kein Account?{" "}
                <a className="text-emerald-300 underline" href="/register">
                  Registrieren
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


