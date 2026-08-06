"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Subheading } from "@/components/ui/Subheading";

const BODY_TYPES = [
  { label: "SUV", value: "suv" },
  { label: "Sedan", value: "sedan" },
  { label: "Pickup", value: "pickup" },
  { label: "Hatchback", value: "hatchback" },
];

type Props = {
  makes: string[];
};

export function QuickSearch({ makes }: Props) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [yearMin, setYearMin] = useState("");

  function go(extra?: Record<string, string>) {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (priceMax) params.set("priceMax", priceMax);
    if (yearMin) params.set("yearMin", yearMin);
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => params.set(k, v));
    }
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <section className="px-6 md:px-12 max-w-[1440px] mx-auto -mt-6 md:-mt-10 relative z-30">
      <div className="bg-card text-card-foreground border border-border rounded-4xl p-6 md:p-8 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <Subheading text="Find a car" />
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
              Search inventory
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-light max-w-sm">
            Filter by make, budget, or year — or jump straight into a body type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-light">Make</span>
            <select
              className="field"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            >
              <option value="">Any make</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-light">
              Max price (KES)
            </span>
            <input
              className="field"
              type="number"
              placeholder="e.g. 3000000"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground font-light">
              Year from
            </span>
            <input
              className="field"
              type="number"
              placeholder="e.g. 2018"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={() => go()}
            className="self-end w-full py-3 rounded-full bg-accent text-accent-foreground font-medium hover:scale-[1.01] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Search cars
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => go({ bodyType: b.value })}
              className="px-4 py-2 rounded-full border border-border text-sm font-light hover:border-accent hover:text-accent transition-colors"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
