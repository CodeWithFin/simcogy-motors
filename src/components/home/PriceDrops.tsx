import { CarCard } from "@/components/cars/CarCard";
import { ButtonLink } from "@/components/ui/Button";
import type { Car } from "@/lib/types";

export function PriceDrops({ cars }: { cars: Car[] }) {
  if (cars.length === 0) return null;

  return (
    <section className="section bg-chalk">
      <div className="page-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-3 text-heading-lg md:text-heading-xl">
              Just reduced
            </h2>
            <p className="max-w-md text-body-lg text-steel">
              Price drops on inspected Simcogy Motors stock — same cars, better
              value.
            </p>
          </div>
          <ButtonLink href="/cars?sort=price_asc" variant="ghost-dark">
            Shop by price
          </ButtonLink>
        </div>
        <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              className="w-[300px] shrink-0 snap-start md:w-[380px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
