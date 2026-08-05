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

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={`min-w-[320px] md:min-w-[400px] w-full md:w-[400px] h-[520px] relative rounded-4xl overflow-hidden group cursor-pointer shrink-0 snap-center block ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 320px, 400px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase">
          {car.make}
        </span>
        {car.previous_price && Number(car.previous_price) > Number(car.price) && (
          <span className="bg-accent text-background text-xs px-3 py-1 rounded-full font-medium">
            Just reduced
          </span>
        )}
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col">
        <h3 className="text-3xl font-medium tracking-tight mb-4">{title}</h3>
        <div className="glass-panel bg-card/80 rounded-2xl p-4 flex flex-col gap-3 border-none">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-xs text-muted font-light">
              {car.negotiable ? "Negotiable" : "Fixed price"}
            </span>
            <span className="text-lg font-medium tracking-tight">
              {formatKes(car.price)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-light text-white/80">
            <span>{car.year}</span>
            <span>{car.mileage_km.toLocaleString()} km</span>
            <span className="capitalize">{car.transmission || "—"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
