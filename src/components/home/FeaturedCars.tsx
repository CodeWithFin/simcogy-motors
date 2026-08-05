import Link from "next/link";
import { Subheading } from "@/components/ui/Subheading";
import { CarCard } from "@/components/cars/CarCard";
import type { Car } from "@/lib/types";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  return (
    <section className="py-24 overflow-hidden">
      <div className="px-6 md:px-12 max-w-[1440px] mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Subheading text="Inventory" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground">
            Featured cars
          </h2>
        </div>
        <Link
          href="/cars"
          className="hidden md:inline-flex items-center space-x-3 text-sm font-light hover:text-accent transition-colors pb-2 border-b border-border hover:border-accent"
        >
          <span>See all cars</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <p className="text-muted-foreground font-light">
            New stock is on the way. Check back soon or contact us for arrivals.
          </p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-12 snap-x snap-mandatory">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </section>
  );
}
