import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  badgeClass,
  carTitle,
  formatKes,
  getCarBadges,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

type Props = {
  car: Car;
  className?: string;
};

/** Inventory storefront card — Exery-style product tile */
export function ShopCarCard({ car, className = "" }: Props) {
  const title = carTitle(car);
  const image =
    car.cover_url ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop";
  const badges = getCarBadges(car);
  const subtitle = [
    String(car.year),
    car.fuel_type,
    `${car.mileage_km.toLocaleString()} km`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn(
        "group flex flex-col min-w-[260px] md:min-w-[280px] w-full md:w-[280px] shrink-0 snap-center",
        "rounded-2xl border border-border bg-card text-card-foreground p-3",
        "shadow-sm hover:shadow-md hover:border-foreground/15 transition-all duration-300",
        "dark:shadow-none dark:hover:border-border dark:hover:bg-muted/40",
        className
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 260px, 280px"
        />
        {badges[0] && (
          <span
            className={cn(
              "absolute top-3 left-3 z-10 inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wide shadow-sm",
              badgeClass(badges[0].tone)
            )}
          >
            {badges[0].label}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4 px-1 pb-1">
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground capitalize line-clamp-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatKes(car.price)}
          </span>
          <span
            aria-hidden
            className="w-8 h-8 shrink-0 rounded-lg bg-brand/30 group-hover:bg-brand flex items-center justify-center text-neutral-900 transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
