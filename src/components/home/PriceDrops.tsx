import Link from "next/link";
import { Subheading } from "@/components/ui/Subheading";
import { CarCard } from "@/components/cars/CarCard";
import type { Car } from "@/lib/types";

export function PriceDrops({ cars }: { cars: Car[] }) {
  if (cars.length === 0) return null;

  return (
    <section className="py-16 md:py-24 overflow-hidden border-t border-border">
      <div className="px-6 md:px-12 max-w-[1440px] mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Subheading text="Deals" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground">
            Just reduced
          </h2>
        </div>
        <Link
          href="/cars"
          className="hidden md:inline-flex items-center space-x-3 text-sm font-light hover:text-accent transition-colors pb-2 border-b border-border hover:border-accent"
        >
          <span>See all inventory</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-4 snap-x snap-mandatory">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
