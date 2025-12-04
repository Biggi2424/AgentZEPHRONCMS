"use client";

import { FormEvent, useState } from "react";

export function PaymentMethodForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("/api/billing/payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Speichern fehlgeschlagen");
      setSuccess("");
    } else {
      setSuccess("Zahlungsmethode gespeichert.");
      setError("");
      setCardNumber("");
      setExpMonth("");
      setExpYear("");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-sm text-zinc-200">
      <p className="text-sm font-semibold text-zinc-50">Zahlungsmethode hinzufügen</p>
      <div className="grid grid-cols-12 gap-3">
        <input
          required
          name="cardNumber"
          placeholder="Kartennummer"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="col-span-12 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
        <input
          required
          name="expMonth"
          placeholder="MM"
          value={expMonth}
          onChange={(e) => setExpMonth(e.target.value)}
          className="col-span-6 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
        <input
          required
          name="expYear"
          placeholder="YYYY"
          value={expYear}
          onChange={(e) => setExpYear(e.target.value)}
          className="col-span-6 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {success && <p className="text-sm text-emerald-300">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        Speichern
      </button>
    </form>
  );
}
