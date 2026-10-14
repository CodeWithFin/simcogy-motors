import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { LegalNote } from "@/components/layout/LegalNote";
import { Navbar } from "@/components/layout/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="page-container flex-1 pb-section pt-32 md:pt-40">
        <div className="mb-12 md:mb-16">
          <h1 className="mb-4 text-heading-xl md:text-display">Our stock</h1>
          <p className="max-w-lg text-body-lg text-steel">
            Every vehicle is from Simcogy Motors retail inventory — inspected,
            priced clearly, and ready to reserve.
          </p>
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-14">
          <Suspense
            fallback={
              <aside className="w-full shrink-0 lg:w-[280px]">
                <p className="text-body text-steel">Loading filters…</p>
              </aside>
            }
          >
            <CarFilters makes={makes} bodyTypes={bodyTypes} total={total} />
          </Suspense>

          <div className="w-full min-w-0 flex-1">
            {cars.length === 0 ? (
              <div className="rounded-card bg-chalk p-10 text-center">
                <p className="mb-6 text-body-lg text-steel">
                  No cars match these filters. Try clearing some filters.
                </p>
                <ButtonLink href="/cars" variant="ghost-dark">
                  Clear filters
                </ButtonLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-section flex items-center justify-center gap-4"
              >
                {page > 1 && (
                  <PageLink page={page - 1} params={params}>
                    Previous
                  </PageLink>
                )}
                <span className="text-body text-steel">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <PageLink page={page + 1} params={params}>
                    Next
                  </PageLink>
                )}
              </nav>
            )}
          </div>
        </div>
      </main>
      <LegalNote />
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
    <ButtonLink href={`/cars?${qs.toString()}`} variant="ghost-dark">
      {children}
    </ButtonLink>
  );
}
