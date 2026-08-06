import Link from "next/link";
import Image from "next/image";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { getAllCarsAdmin } from "@/lib/cars";
import { carTitle, formatKes } from "@/lib/format";
import type { Car } from "@/lib/types";

export default async function AdminFeaturedPage() {
  let cars: Car[] = [];
  try {
    cars = await getAllCarsAdmin();
  } catch {
    cars = [];
  }

  const featured = cars.filter((c) => c.featured);
  const available = cars.filter(
    (c) => !c.featured && (c.status === "published" || c.status === "draft")
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight mb-2">
          Featured cars
        </h1>
        <p className="text-sm text-muted-foreground font-light max-w-xl">
          Featured cars appear in the homepage Last Arrivals section. Only our own stock
          can be featured — toggle cars on or off below.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium tracking-tight">
            On homepage ({featured.length})
          </h2>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            View site →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-sm text-muted-foreground font-light bg-card border border-border rounded-2xl p-6">
            No featured cars yet. Mark published cars as featured to show them
            on the homepage.
          </p>
        ) : (
          <div className="space-y-3">
            {featured.map((car) => (
              <FeaturedRow key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium tracking-tight mb-4">
          Add to featured
        </h2>
        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground font-light">
            All eligible cars are already featured, or none are published yet.
          </p>
        ) : (
          <div className="space-y-3">
            {available.map((car) => (
              <FeaturedRow key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedRow({ car }: { car: Car }) {
  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-3">
      <Link
        href={`/admin/cars/${car.id}`}
        className="relative w-20 h-16 rounded-xl overflow-hidden bg-background shrink-0"
      >
        {car.cover_url ? (
          <Image
            src={car.cover_url}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : null}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/admin/cars/${car.id}`}
          className="font-medium truncate block hover:text-accent transition-colors"
        >
          {carTitle(car)}
        </Link>
        <p className="text-xs text-muted-foreground font-light">
          {formatKes(car.price)} · {car.status}
        </p>
      </div>
      <FeaturedToggle carId={car.id} featured={car.featured} />
    </div>
  );
}
