import { Suspense } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
import { Subheading } from "@/components/ui/Subheading";
import { getFilterOptions, getPublishedCars } from "@/lib/cars";

export const revalidate = 60;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = Math.max(1, Number(get("page") || 1));
  const limit = 12;
  const offset = (page - 1) * limit;

  let cars: Awaited<ReturnType<typeof getPublishedCars>>["cars"] = [];
  let total = 0;
  let makes: string[] = [];
  let bodyTypes: string[] = [];

  try {
    const [result, options] = await Promise.all([
      getPublishedCars({
        make: get("make"),
        model: get("model"),
        yearMin: get("yearMin") ? Number(get("yearMin")) : undefined,
        yearMax: get("yearMax") ? Number(get("yearMax")) : undefined,
        priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
        priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
        mileageMax: get("mileageMax") ? Number(get("mileageMax")) : undefined,
        transmission: get("transmission"),
        fuelType: get("fuelType"),
        bodyType: get("bodyType"),
        condition: get("condition"),
        importType: get("importType"),
        sort: get("sort") || "newest",
        q: get("q"),
        limit,
        offset,
      }),
      getFilterOptions(),
    ]);
    cars = result.cars;
    total = result.total;
    makes = options.makes;
    bodyTypes = options.bodyTypes;
  } catch {
    // DB unavailable — show empty state
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative pt-24 pb-8 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
          <div className="pointer-events-auto relative h-16">
            <Navbar />
          </div>
        </div>

        <Subheading text="Our stock" />
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
          Shop our cars
        </h1>
        <p className="text-muted-foreground font-light text-sm md:text-base max-w-2xl mb-10">
          Every vehicle is from Simcogy Motors retail inventory — inspected,
          priced clearly, and ready to reserve. Filter and browse like a
          storefront, not a classifieds board.
        </p>

        <Suspense fallback={<p className="text-muted-foreground text-sm">Loading filters…</p>}>
          <CarFilters makes={makes} bodyTypes={bodyTypes} total={total} />
        </Suspense>

        {cars.length === 0 ? (
          <p className="mt-16 text-muted-foreground font-light">
            No cars match these filters. Try clearing some filters.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} className="!min-w-0 !w-full md:!w-full" />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && (
              <PageLink page={page - 1} params={params}>
                Previous
              </PageLink>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <PageLink page={page + 1} params={params}>
                Next
              </PageLink>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function PageLink({
  page,
  params,
  children,
}: {
  page: number;
  params: Record<string, string | string[] | undefined>;
  children: React.ReactNode;
}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (k === "page") return;
    if (typeof v === "string") qs.set(k, v);
  });
  qs.set("page", String(page));
  return (
    <Link
      href={`/cars?${qs.toString()}`}
      className="text-sm font-light hover:text-accent transition-colors"
    >
      {children}
    </Link>
  );
}
