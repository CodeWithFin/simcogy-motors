"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type Props = {
  makes: string[];
  bodyTypes: string[];
  total: number;
};

export function CarFilters({ makes, bodyTypes, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      startTransition(() => {
        router.push(`/cars?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clear = () => {
    startTransition(() => router.push("/cars"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-light">
          {pending ? "Updating…" : `${total} car${total === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 md:p-5 rounded-2xl bg-muted/60 border border-border">
        <Field label="Make">
          <select
            className="field"
            value={searchParams.get("make") || ""}
            onChange={(e) => update("make", e.target.value)}
          >
            <option value="">Any</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Body type">
          <select
            className="field"
            value={searchParams.get("bodyType") || ""}
            onChange={(e) => update("bodyType", e.target.value)}
          >
            <option value="">Any</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Transmission">
          <select
            className="field"
            value={searchParams.get("transmission") || ""}
            onChange={(e) => update("transmission", e.target.value)}
          >
            <option value="">Any</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </Field>

        <Field label="Fuel">
          <select
            className="field"
            value={searchParams.get("fuelType") || ""}
            onChange={(e) => update("fuelType", e.target.value)}
          >
            <option value="">Any</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </Field>

        <Field label="Year from">
          <input
            className="field"
            type="number"
            placeholder="2015"
            value={searchParams.get("yearMin") || ""}
            onChange={(e) => update("yearMin", e.target.value)}
          />
        </Field>

        <Field label="Year to">
          <input
            className="field"
            type="number"
            placeholder="2024"
            value={searchParams.get("yearMax") || ""}
            onChange={(e) => update("yearMax", e.target.value)}
          />
        </Field>

        <Field label="Max price (KES)">
          <input
            className="field"
            type="number"
            placeholder="3000000"
            value={searchParams.get("priceMax") || ""}
            onChange={(e) => update("priceMax", e.target.value)}
          />
        </Field>

        <Field label="Max mileage">
          <input
            className="field"
            type="number"
            placeholder="100000"
            value={searchParams.get("mileageMax") || ""}
            onChange={(e) => update("mileageMax", e.target.value)}
          />
        </Field>

        <Field label="Condition">
          <select
            className="field"
            value={searchParams.get("condition") || ""}
            onChange={(e) => update("condition", e.target.value)}
          >
            <option value="">Any</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_preowned">Certified</option>
          </select>
        </Field>

        <Field label="Import">
          <select
            className="field"
            value={searchParams.get("importType") || ""}
            onChange={(e) => update("importType", e.target.value)}
          >
            <option value="">Any</option>
            <option value="locally_used">Locally used</option>
            <option value="foreign_used">Foreign used</option>
            <option value="brand_new">Brand new</option>
          </select>
        </Field>

        <Field label="Sort">
          <select
            className="field"
            value={searchParams.get("sort") || "newest"}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="year_desc">Year: newest</option>
            <option value="mileage_asc">Mileage: lowest</option>
          </select>
        </Field>

        <Field label="Search">
          <input
            className="field"
            type="search"
            placeholder="Make or model"
            defaultValue={searchParams.get("q") || ""}
            onBlur={(e) => update("q", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update("q", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground font-light">{label}</span>
      {children}
    </label>
  );
}
