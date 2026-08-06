import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import type { Car } from "@/lib/types";

export function PriceDrops({ cars }: { cars: Car[] }) {
  if (cars.length === 0) return null;

  return (
    <section className="px-4 md:px-8 max-w-[1600px] mx-auto mb-24">
      <div className="bg-white text-black rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
              Just reduced
            </h2>
            <p className="text-xs text-neutral-500 max-w-xs">
              Price drops on inspected Simcogy Motors stock — same cars, better
              value.
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
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
