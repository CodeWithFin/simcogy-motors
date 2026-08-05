"use client";

import { useMemo, useState } from "react";
import { formatKes } from "@/lib/format";

type Props = {
  price: number;
};

export function FinancingCalculator({ price }: Props) {
  const [downPercent, setDownPercent] = useState(30);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(14);

  const monthly = useMemo(() => {
    const down = price * (downPercent / 100);
    const principal = price - down;
    const r = rate / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }, [price, downPercent, months, rate]);

  return (
    <div className="bg-card border border-border rounded-4xl p-6 md:p-8">
      <h3 className="text-xl font-medium tracking-tight mb-2">
        Financing estimate
      </h3>
      <p className="text-muted text-sm font-light mb-6">
        Indicative only — final rates depend on your lender.
      </p>

      <div className="space-y-5">
        <Slider
          label="Down payment"
          value={downPercent}
          min={10}
          max={60}
          suffix="%"
          onChange={setDownPercent}
        />
        <Slider
          label="Term"
          value={months}
          min={12}
          max={60}
          step={6}
          suffix=" mo"
          onChange={setMonths}
        />
        <Slider
          label="Interest rate"
          value={rate}
          min={8}
          max={24}
          step={0.5}
          suffix="%"
          onChange={setRate}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-end">
        <div>
          <p className="text-xs text-muted font-light mb-1">Est. monthly</p>
          <p className="text-3xl font-medium tracking-tight text-accent">
            {formatKes(Math.round(monthly))}
          </p>
        </div>
        <p className="text-xs text-muted font-light text-right">
          Down {formatKes(Math.round(price * (downPercent / 100)))}
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted font-light">{label}</span>
        <span className="font-medium">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
