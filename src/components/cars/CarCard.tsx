import Image from "next/image";
import Link from "next/link";
import {
  badgeClass,
  carTitle,
  estimateMonthly,
  formatKes,
  getCarBadges,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

type Props = {
  car: Car;
  className?: string;
};

/** Homepage / scroll-row card — original dual-price layout */
export function CarCard({ car, className = "" }: Props) {
  const title = carTitle(car);
  const image =
    car.cover_url ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop";
  const badges = getCarBadges(car);
  const monthly = estimateMonthly(car.price);

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn(
        "group flex h-full flex-col min-w-[300px] md:min-w-[380px] w-full md:w-[380px] shrink-0 snap-center rounded-4xl overflow-hidden bg-card text-card-foreground border border-border shadow-sm hover:border-foreground/20 transition-colors",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 300px, 380px"
        />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-2 z-10">
          <span className="rounded-full bg-black/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium tracking-widest uppercase text-white">
            {car.make}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {badges.map((b) => (
              <span
                key={b.key}
                className={`inline-flex items-center text-[11px] px-2.5 py-1 rounded-full font-medium ${badgeClass(b.tone)}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="min-h-[3.5rem] md:min-h-[4rem] text-xl md:text-2xl font-medium tracking-tight leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-light mb-0.5">
                Cash price
              </p>
              <p className="text-lg font-medium tracking-tight text-accent tabular-nums">
                {formatKes(car.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-light mb-0.5">
                Est. monthly
              </p>
              <p className="text-lg font-medium tracking-tight tabular-nums">
                {formatKes(monthly)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 items-center border-t border-border pt-3 text-xs font-light text-muted-foreground">
            <span className="text-left">{car.year}</span>
            <span className="text-center tabular-nums">
              {car.mileage_km.toLocaleString()} km
            </span>
            <span className="text-right capitalize">
              {car.transmission || "—"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
