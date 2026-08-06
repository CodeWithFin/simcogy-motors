import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import type { Car } from "@/lib/types";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  const items = cars.slice(0, 4);

  return (
    <section className="px-4 md:px-8 max-w-[1600px] mx-auto mb-24">
      <div className="bg-white text-black rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              Last Arrivals
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs">
              Fresh stock from Simcogy Motors — inspected, priced, and ready to
              reserve.
            </p>
          </div>
          <Link
            href="/cars"
            className="px-6 py-3 rounded-full bg-brand/20 hover:bg-brand text-black font-semibold text-xs uppercase tracking-wide transition-all duration-300 flex items-center gap-2"
          >
            All products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="text-neutral-500 text-sm font-light">
            New stock is on the way. Check back soon or contact us for arrivals.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                className="!min-w-0 !w-full md:!w-full"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
