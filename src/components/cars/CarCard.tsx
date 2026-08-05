import Image from "next/image";
import Link from "next/link";
import { carTitle, formatKes } from "@/lib/format";
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
  const reduced =
    car.previous_price && Number(car.previous_price) > Number(car.price);

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={`group flex flex-col min-w-[300px] md:min-w-[380px] w-full md:w-[380px] shrink-0 snap-center rounded-4xl overflow-hidden bg-card text-card-foreground border border-border shadow-sm hover:border-foreground/20 transition-colors ${className}`}
    >
      {/* Image only — no theme wash over the photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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
            {reduced && (
              <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-[11px] px-2.5 py-1 rounded-full font-medium">
                <span aria-hidden>↓</span>
                Just reduced
              </span>
            )}
            {car.status === "reserved" && (
              <span className="inline-flex items-center bg-success text-success-foreground text-[11px] px-2.5 py-1 rounded-full font-medium">
                Reserved
              </span>
            )}
            {car.status === "sold" && (
              <span className="inline-flex items-center bg-destructive text-destructive-foreground text-[11px] px-2.5 py-1 rounded-full font-medium">
                Sold
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 md:p-6">
        <h3 className="text-xl md:text-2xl font-medium tracking-tight leading-snug">
          {title}
        </h3>
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-xs text-muted-foreground font-light">
            {car.negotiable ? "Negotiable" : "Fixed price"}
          </span>
          <span className="text-lg font-medium tracking-tight text-accent">
            {formatKes(car.price)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs font-light text-muted-foreground pt-3 border-t border-border">
          <span>{car.year}</span>
          <span>{car.mileage_km.toLocaleString()} km</span>
          <span className="capitalize">{car.transmission || "—"}</span>
        </div>
      </div>
    </Link>
  );
}
