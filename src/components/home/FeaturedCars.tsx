import Link from "next/link";
import { Subheading } from "@/components/ui/Subheading";
import HoverRevealCards, { type CardItem } from "@/components/ui/cards";
import { carTitle, formatKes } from "@/lib/format";
import type { Car } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  const items: CardItem[] = cars.slice(0, 4).map((car) => ({
    id: car.id,
    title: carTitle(car),
    subtitle: formatKes(car.price),
    imageUrl: car.cover_url || FALLBACK_IMAGE,
    href: `/cars/${car.slug}`,
  }));

  return (
    <section className="py-24">
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

      {items.length === 0 ? (
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <p className="text-muted-foreground font-light">
            New stock is on the way. Check back soon or contact us for arrivals.
          </p>
        </div>
      ) : (
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <HoverRevealCards items={items} />
        </div>
      )}
    </section>
  );
}
