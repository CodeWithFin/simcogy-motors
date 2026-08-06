import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  badgeClass,
  carTitle,
  formatKes,
  getCarBadges,
} from "@/lib/format";
import type { Car } from "@/lib/types";

type Props = {
  car: Car;
  className?: string;
};

export function CarCard({ car, className = "" }: Props) {
  const title = carTitle(car);
  const image =
    car.cover_url ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop";
  const badges = getCarBadges(car);
  const subtitle = [
    car.year,
    car.fuel_type,
    `${car.mileage_km.toLocaleString()} km`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={`group block min-w-[260px] md:min-w-[280px] w-full md:w-[280px] shrink-0 snap-center ${className}`}
    >
      <div className="bg-neutral-100 dark:bg-muted rounded-2xl p-4 mb-4 relative transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-none dark:group-hover:ring-1 dark:group-hover:ring-border">
        {badges[0] && (
          <span
            className={`absolute top-4 left-4 z-10 inline-flex items-center text-[10px] px-2.5 py-1 rounded-full font-medium ${badgeClass(badges[0].tone)}`}
          >
            {badges[0].label}
          </span>
        )}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 260px, 280px"
          />
        </div>
      </div>

      <div className="flex justify-between items-end gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-sm mb-1 text-neutral-900 dark:text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-muted-foreground capitalize line-clamp-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-neutral-900 dark:text-foreground tabular-nums whitespace-nowrap">
            {formatKes(car.price)}
          </span>
          <span
            aria-hidden
            className="w-8 h-8 rounded-lg bg-brand/20 group-hover:bg-brand flex items-center justify-center text-neutral-900 transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
