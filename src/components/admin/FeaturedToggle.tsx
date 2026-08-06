"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  carId: string;
  featured: boolean;
  disabled?: boolean;
};

export function FeaturedToggle({ carId, featured, disabled }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(featured);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending || disabled) return;

    const next = !value;
    setValue(next);
    setPending(true);
    try {
      const res = await fetch(`/api/admin/cars/${carId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next }),
      });
      if (!res.ok) {
        setValue(!next);
        return;
      }
      router.refresh();
    } catch {
      setValue(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending || disabled}
      aria-pressed={value}
      aria-label={value ? "Remove from featured" : "Mark as featured"}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        value
          ? "bg-accent text-accent-foreground"
          : "border border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {pending ? "…" : value ? "Featured" : "Feature"}
    </button>
  );
}
