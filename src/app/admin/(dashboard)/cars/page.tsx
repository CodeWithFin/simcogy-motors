import Link from "next/link";
import Image from "next/image";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { getAllCarsAdmin } from "@/lib/cars";
import { carTitle, formatKes } from "@/lib/format";
import type { Car } from "@/lib/types";

export default async function AdminCarsPage() {
  let cars: Car[] = [];
  try {
    cars = await getAllCarsAdmin();
  } catch {
    cars = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-medium tracking-tight">Cars</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/featured"
            className="px-5 py-2.5 rounded-full border border-border text-sm font-light hover:border-accent transition-colors"
          >
            Featured
          </Link>
          <Link
            href="/admin/cars/new"
            className="px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
          >
            Add car
          </Link>
        </div>
      </div>

      {cars.length === 0 ? (
        <p className="text-muted-foreground font-light">No cars yet.</p>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-3"
            >
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
              <Link
                href={`/admin/cars/${car.id}`}
                className="flex-1 min-w-0 hover:text-accent transition-colors"
              >
                <p className="font-medium truncate">{carTitle(car)}</p>
                <p className="text-xs text-muted-foreground font-light">
                  {formatKes(car.price)} · {car.status}
                  {car.featured ? " · featured" : ""}
                </p>
              </Link>
              <FeaturedToggle carId={car.id} featured={car.featured} />
              <Link
                href={`/admin/cars/${car.id}`}
                className="text-muted-foreground text-sm shrink-0 hover:text-accent"
              >
                Edit →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
