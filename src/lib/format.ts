import type { Car } from "./types";

export function formatKes(amount: number | string) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Indicative monthly payment — 30% down, 36 months, 14% APR */
export function estimateMonthly(
  price: number | string,
  {
    downPercent = 30,
    months = 36,
    annualRate = 14,
  }: { downPercent?: number; months?: number; annualRate?: number } = {}
) {
  const p = typeof price === "string" ? Number(price) : price;
  const principal = p * (1 - downPercent / 100);
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  const monthly =
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(monthly);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}

export function carTitle(car: Pick<Car, "year" | "make" | "model" | "trim">) {
  return [car.year, car.make, car.model, car.trim].filter(Boolean).join(" ");
}

export function whatsappLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export type CarBadge = {
  key: string;
  label: string;
  tone: "accent" | "success" | "destructive" | "muted";
};

export function getCarBadges(car: Car): CarBadge[] {
  const badges: CarBadge[] = [];
  const reduced =
    car.previous_price != null &&
    Number(car.previous_price) > Number(car.price);

  if (car.status === "reserved") {
    badges.push({ key: "pending", label: "Pending sale", tone: "success" });
  }
  if (car.status === "sold") {
    badges.push({ key: "sold", label: "Sold", tone: "destructive" });
  }
  if (reduced) {
    badges.push({ key: "deal", label: "Great deal", tone: "accent" });
  }

  const listed = car.listed_at ? new Date(car.listed_at).getTime() : null;
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  if (
    listed &&
    Date.now() - listed < fourteenDays &&
    car.status === "published"
  ) {
    badges.push({ key: "new", label: "New arrival", tone: "muted" });
  }

  return badges;
}

export function badgeClass(tone: CarBadge["tone"]) {
  switch (tone) {
    case "accent":
      return "bg-accent text-accent-foreground";
    case "success":
      return "bg-success text-success-foreground";
    case "destructive":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-black/55 text-white backdrop-blur-sm";
  }
}
