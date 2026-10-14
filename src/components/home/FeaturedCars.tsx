import { CarCard } from "@/components/cars/CarCard";
import { ButtonLink } from "@/components/ui/Button";
import type { Car } from "@/lib/types";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  const items = cars.slice(0, 6);

  return (
    <section className="section bg-paper">
      <div className="page-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-3 text-heading-lg md:text-heading-xl">
              Latest arrivals
            </h2>
            <p className="max-w-md text-body-lg text-steel">
              Fresh stock from Simcogy Motors — inspected, priced, and ready to
              reserve.
            </p>
          </div>
          <ButtonLink href="/cars" variant="ghost-dark">
            View all stock
          </ButtonLink>
        </div>

        {items.length === 0 ? (
          <p className="rounded-card bg-chalk p-10 text-center text-body-lg text-steel">
            New stock is on the way. Check back soon or contact us for arrivals.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
