import Link from "next/link";
import Image from "next/image";
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
        <Link
          href="/admin/cars/new"
          className="px-5 py-2.5 rounded-full bg-accent text-background text-sm font-medium"
        >
          Add car
        </Link>
      </div>

      {cars.length === 0 ? (
        <p className="text-muted font-light">No cars yet.</p>
      ) : (
        <div className="space-y-3">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/admin/cars/${car.id}`}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-3 hover:border-white/20 transition-colors"
            >
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-background shrink-0">
                {car.cover_url ? (
                  <Image
                    src={car.cover_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{carTitle(car)}</p>
                <p className="text-xs text-muted font-light">
                  {formatKes(car.price)} · {car.status}
                </p>
              </div>
              <span className="text-muted text-sm">Edit →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
