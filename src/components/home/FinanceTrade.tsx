"use client";

import { useState } from "react";
import { ButtonLink, buttonClass } from "@/components/ui/Button";

export function FinanceTrade() {
  return (
    <section id="financing" className="section scroll-mt-20 bg-chalk">
      <div className="page-container grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-card bg-paper p-8 md:p-12">
          <h2 className="mb-4 text-heading-md md:text-heading-lg">
            Estimate monthly payments
          </h2>
          <p className="mb-10 flex-1 text-body-lg text-steel">
            Every listing has a financing calculator — adjust down payment,
            term, and rate to see an indicative monthly figure before you visit.
          </p>
          <dl className="mb-10 grid grid-cols-3 gap-4 border-t border-concrete pt-8">
            {[
              ["30%", "Example deposit"],
              ["36 mo", "Example term"],
              ["14%", "Example rate"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-heading-sm">{value}</dd>
                <dd className="mt-1 text-xs text-steel">{label}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/cars" variant="graphite" className="self-start">
            Browse cars with calculator
          </ButtonLink>
        </div>

        <div id="trade-in" className="scroll-mt-20">
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
    <div className="h-full rounded-card bg-paper p-8 md:p-12">
      <h2 className="mb-4 text-heading-md md:text-heading-lg">
        Trade in toward our stock
      </h2>
      <p className="mb-8 text-body-lg text-steel">
        Have a car to put toward one of ours? Share the details — we&apos;ll
        estimate a trade-in value within 24 hours.
      </p>

      {status === "ok" ? (
        <p className="rounded-card bg-chalk p-6 text-body-lg font-medium text-graphite">
          Request received. We&apos;ll get back to you on {phone} within 24 hours.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            className="field"
            placeholder="Make"
            aria-label="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
          <input
            required
            className="field"
            placeholder="Model"
            aria-label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            required
            type="number"
            className="field"
            placeholder="Year"
            aria-label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            required
            type="number"
            className="field"
            placeholder="Mileage (km)"
            aria-label="Mileage in kilometres"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <input
            required
            type="tel"
            className="field sm:col-span-2"
            placeholder="Phone / WhatsApp"
            aria-label="Phone or WhatsApp number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="field resize-none sm:col-span-2"
            rows={3}
            placeholder="Condition notes (optional)"
            aria-label="Condition notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && (
            <p className="text-body text-destructive sm:col-span-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className={buttonClass("graphite", "md", "sm:col-span-2")}
          >
            {status === "loading" ? "Sending…" : "Request estimate"}
          </button>
        </form>
      )}
    </div>
  );
}
