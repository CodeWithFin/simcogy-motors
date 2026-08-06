"use client";

import Link from "next/link";
import { useState } from "react";
import { Subheading } from "@/components/ui/Subheading";

export function FinanceTrade() {
  return (
    <section
      id="financing"
      className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto scroll-mt-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-card border border-border rounded-4xl p-8 md:p-10 flex flex-col">
          <Subheading text="Financing" />
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Estimate monthly payments
          </h2>
          <p className="text-muted-foreground font-light text-sm leading-relaxed mb-8 flex-1">
            Every listing has a financing calculator — adjust down payment, term,
            and rate to see an indicative monthly figure before you visit.
          </p>
          <Link
            href="/cars"
            className="inline-flex self-start items-center justify-center px-8 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:scale-[1.02] transition-transform"
          >
            Browse cars with calculator
          </Link>
        </div>

        <div id="trade-in" className="scroll-mt-8">
          <TradeInForm />
        </div>
      </div>
    </section>
  );
}

function TradeInForm() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make,
          model,
          year: Number(year),
          mileage_km: Number(mileage),
          phone,
          condition_notes: notes || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="bg-card border border-border rounded-4xl p-8 md:p-10">
      <Subheading text="Trade-in" />
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
        Trade in toward our stock
      </h2>
      <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6">
        Have a car to put toward one of ours? Share the details — we&apos;ll
        estimate a trade-in value within 24 hours. This is not a listing
        marketplace; we only sell vehicles we own.
      </p>

      {status === "ok" ? (
        <p className="text-success text-sm font-light">
          Request received. We’ll get back to you on {phone} within 24 hours.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            className="field"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
          <input
            required
            className="field"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            required
            type="number"
            className="field"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            required
            type="number"
            className="field"
            placeholder="Mileage (km)"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <input
            required
            className="field sm:col-span-2"
            placeholder="Phone / WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="field sm:col-span-2 resize-none"
            rows={3}
            placeholder="Condition notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && (
            <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="sm:col-span-2 py-3 rounded-full border border-border font-light hover:border-accent transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Request estimate"}
          </button>
        </form>
      )}
    </div>
  );
}
