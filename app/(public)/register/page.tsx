"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const countries = ["United States", "Germany", "Austria", "Switzerland", "France", "United Kingdom"];
const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState(years[0]);
  const [birthMonth, setBirthMonth] = useState(months[0]);
  const [birthDay, setBirthDay] = useState(days[0]);
  const [verifyMode, setVerifyMode] = useState<"text" | "call">("text");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const displayName = useMemo(() => `${firstName} ${lastName}`.trim(), [firstName, lastName]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!firstName || !lastName) {
      setError("First und Last Name sind Pflicht.");
      return;
    }
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwoerter stimmen nicht ueberein.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName: displayName || email,
          metadata: { country, phone, birthday: `${birthYear}-${birthMonth}-${birthDay}`, verifyMode },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Create your Neyraq Account</p>
            <h1 className="text-3xl font-semibold text-zinc-50">One Neyraq Account is all you need</h1>
            <p className="text-sm text-zinc-400">
              Sichere Identitaet fuer Portal, Agents und Tickets - keine Dummies, echte Daten.
            </p>
            <p className="text-xs text-zinc-500">
              Already have a Neyraq Account?{" "}
              <a className="text-emerald-300 underline" href="/login">
                Sign in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-6 space-y-2">
                <label className="sr-only">First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First Name"
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                />
              </div>
              <div className="col-span-12 sm:col-span-6 space-y-2">
                <label className="sr-only">Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last Name"
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="sr-only">Country/Region</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              >
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-xs text-zinc-400">
              <p className="text-sm font-semibold text-zinc-50">Birthday</p>
              <div className="grid grid-cols-12 gap-2">
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="col-span-4 rounded-2xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="col-span-4 rounded-2xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="col-span-4 rounded-2xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <p>Optional, fuer Verifizierung.</p>
            </div>

            <div className="space-y-2">
              <label className="sr-only">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="sr-only">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                placeholder="Password"
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-zinc-500">Mindestens 8 Zeichen.</p>
            </div>

            <div className="space-y-2">
              <label className="sr-only">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
                placeholder="Confirm Password"
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="sr-only">Phone</label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  value="+1 (United States)"
                  readOnly
                  className="col-span-4 rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-500 outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="col-span-8 rounded-2xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-zinc-500">
                Wird zur Identitaetspruefung genutzt. Messaging/Data Rates koennen anfallen.
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-400">
              <p className="text-sm font-semibold text-zinc-50">Verify with</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setVerifyMode("text")}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    verifyMode === "text"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-700 bg-black text-zinc-200"
                  }`}
                >
                  Text message
                </button>
                <button
                  type="button"
                  onClick={() => setVerifyMode("call")}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    verifyMode === "call"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-700 bg-black text-zinc-200"
                  }`}
                >
                  Phone call
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-black/40 p-5 text-center text-xs text-zinc-400">
              <p>Your Neyraq Account information is used to sign in securely and access your data.</p>
              <p>
                We may use your info for security, support, and reporting. By continuing, you agree to our data policy.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



