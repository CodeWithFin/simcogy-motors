import Image from "next/image";
import Link from "next/link";
import {
  badgeClass,
  carTitle,
  estimateMonthly,
  formatKes,
  getCarBadges,
} from "@/lib/format";
import { placeholderCarPhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

type Props = {
  car: Car;
  className?: string;
};

export function CarCard({ car, className = "" }: Props) {
  const title = carTitle(car);
  const image = car.cover_url || placeholderCarPhoto;
  const badges = getCarBadges(car);
  const reduced =
    car.previous_price != null && Number(car.previous_price) > Number(car.price);
  const specs = [
    `${car.mileage_km.toLocaleString()} km`,
    car.transmission,
    car.fuel_type,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn("group flex w-full flex-col", className)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-image bg-chalk">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {badges.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {badges.slice(0, 2).map((b) => (
              <span
                key={b.key}
                className={cn(
                  "inline-flex items-center rounded-chip px-3 py-1 text-xs font-medium",
                  badgeClass(b.tone)
                )}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-subheading font-semibold text-graphite">{title}</h3>
        <p className="mt-1 text-body capitalize text-steel">{specs}</p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-body-lg font-semibold tabular-nums text-graphite">
            {formatKes(car.price)}
          </span>
          {reduced && (
            <span className="text-body tabular-nums text-fog line-through">
              {formatKes(car.previous_price!)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-steel">
          Est. {formatKes(estimateMonthly(car.price))}/mo
        </p>
      </div>
    </Link>
  );
}
