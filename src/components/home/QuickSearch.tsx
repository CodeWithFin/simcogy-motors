"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

const BODY_TYPES = [
  { label: "SUV", value: "suv" },
  { label: "Sedan", value: "sedan" },
  { label: "Pickup", value: "pickup" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Van", value: "van" },
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
    <section className="section bg-paper">
      <div className="page-container">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-heading-md md:text-heading-lg">
              Search our stock
            </h2>
            <p className="text-body-lg text-steel">
              Filter by make, budget, or year — or jump straight into a body type.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Make</span>
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
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Max price (KES)</span>
              <input
                className="field"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 3,000,000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="eyebrow">Year from</span>
              <input
                className="field"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 2018"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className={buttonClass("graphite", "md", "self-end lg:min-w-[160px]")}
            >
              Search cars
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {BODY_TYPES.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => go({ bodyType: b.value })}
                className="chip transition-colors hover:bg-ash"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
