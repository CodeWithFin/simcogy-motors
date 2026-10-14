"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";

type Props = {
  makes: string[];
  bodyTypes: string[];
  total: number;
};

export function CarFilters({ makes, bodyTypes, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

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

  const fields = (
    <div className="flex flex-col gap-4">
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

      <div className="grid grid-cols-2 gap-3">
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
      </div>

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
    </div>
  );

  const count = pending ? "Updating…" : `${total} car${total === 1 ? "" : "s"}`;

  return (
    <aside className="w-full shrink-0 lg:w-[280px]">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={buttonClass("light", "md", "w-full justify-between")}
        >
          <span>Filters</span>
          <span className="font-normal text-steel">{count}</span>
        </button>
        {open && (
          <div className="mt-3 rounded-card bg-chalk p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-body font-semibold">Refine stock</p>
              <button
                type="button"
                onClick={clear}
                className="text-xs font-medium text-steel underline underline-offset-4 hover:text-graphite"
              >
                Clear all
              </button>
            </div>
            {fields}
          </div>
        )}
      </div>

      <div className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-1 lg:block">
        <div className="mb-6 flex items-end justify-between gap-2 border-b border-concrete pb-4">
          <div>
            <p className="text-subheading font-semibold">Filters</p>
            <p className="mt-0.5 text-xs text-steel">{count}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-steel underline underline-offset-4 hover:text-graphite"
          >
            Clear all
          </button>
        </div>
        {fields}
      </div>
    </aside>
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
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}
