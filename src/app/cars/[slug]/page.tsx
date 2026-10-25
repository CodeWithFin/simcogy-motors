import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FinancingCalculator } from "@/components/cars/FinancingCalculator";
import { InspectionRating } from "@/components/cars/InspectionRating";
import { PurchaseForm } from "@/components/cars/PurchaseForm";
import { CarAdviser } from "@/components/cars/CarAdviser";
import { LegalNote } from "@/components/layout/LegalNote";
import { buttonClass } from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { placeholderCarPhoto } from "@/lib/photos";
import {
  getCarBySlug,
  getCarImages,
  getInspectionForCar,
} from "@/lib/cars";
import {
  badgeClass,
  carTitle,
  estimateMonthly,
  formatKes,
  getCarBadges,
  whatsappLink,
} from "@/lib/format";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const car = await getCarBySlug(slug);
    if (!car) return { title: "Car not found" };
    return {
      title: carTitle(car),
      description:
        car.description?.slice(0, 160) ||
        `${carTitle(car)} for sale from Simcogy Motors stock`,
    };
  } catch {
    return { title: "Car" };
  }
}

export default async function CarDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  let car = null;
  let images: Awaited<ReturnType<typeof getCarImages>> = [];
  let inspection: Awaited<ReturnType<typeof getInspectionForCar>> = null;

  try {
    car = await getCarBySlug(slug);
    if (car) {
      [images, inspection] = await Promise.all([
        getCarImages(car.id),
        getInspectionForCar(car.id),
      ]);
    }
  } catch {
    notFound();
  }

  if (!car) notFound();

  const title = carTitle(car);
  const waMessage = `Hi Simcogy Motors, I want to reserve the ${title} (${process.env.NEXT_PUBLIC_SITE_URL || ""}/cars/${car.slug})`;
  const cover = images[0]?.url || car.cover_url || placeholderCarPhoto;
  const reduced =
    car.previous_price != null &&
    Number(car.previous_price) > Number(car.price);
  const badges = getCarBadges(car);
  const monthly = estimateMonthly(car.price);
  const available = car.status === "published";
  const score = inspection?.overall_score ?? car.overall_score;

  const specs = [
    { label: "Year", value: String(car.year) },
    { label: "Mileage", value: `${car.mileage_km.toLocaleString()} km` },
    { label: "Transmission", value: car.transmission || "—" },
    { label: "Fuel", value: car.fuel_type || "—" },
    { label: "Body", value: car.body_type || "—" },
    { label: "Drivetrain", value: car.drivetrain?.toUpperCase() || "—" },
    {
      label: "Engine",
      value: car.engine_capacity_cc ? `${car.engine_capacity_cc} cc` : "—",
    },
    { label: "Color", value: car.color || "—" },
    { label: "Seats", value: car.seats ? String(car.seats) : "—" },
    { label: "Condition", value: car.condition.replace("_", " ") },
    {
      label: "Import",
      value: car.import_type?.replace("_", " ") || "—",
    },
    { label: "VIN", value: car.vin || "—" },
  ];

  const mark = car.model.toUpperCase();
  const monogramVw = (88 / (Math.max(mark.length, 3) * 0.62)).toFixed(2);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main>
        <section className="bg-chalk pb-section pt-32 md:pt-36">
          <h1 className="sr-only">{title}</h1>
          <p
            aria-hidden
            className="monogram select-none overflow-hidden text-center"
            style={{ fontSize: `min(360px, ${monogramVw}vw)` }}
          >
            {mark}
          </p>

          <div className="page-container -mt-[3%]">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[1100px] overflow-hidden rounded-image bg-ash">
              <Image
                src={cover}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1100px"
              />
            </div>
          </div>

          <div className="page-container mt-10 flex flex-col items-center text-center">
            {(badges.length > 0 || score != null) && (
              <div className="mb-5 flex flex-wrap justify-center gap-2">
                {badges.map((b) => (
                  <span
                    key={b.key}
                    className={`inline-flex items-center rounded-chip px-3 py-1 text-xs font-medium ${badgeClass(b.tone)}`}
                  >
                    {b.label}
                  </span>
                ))}
                {score != null && (
                  <span className="chip bg-paper">Inspected · {score}/100</span>
                )}
              </div>
            )}
            <p className="mb-2 text-subheading font-medium text-graphite">{title}</p>
            <p className="mb-8 text-body text-steel">
              {formatKes(car.price)}
              {reduced && (
                <>
                  {" "}
                  <span className="text-fog line-through">
                    {formatKes(car.previous_price!)}
                  </span>
                </>
              )}{" "}
              · Est. {formatKes(monthly)}/mo · {car.mileage_km.toLocaleString()} km
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#checkout" className={buttonClass("graphite", "lg")}>
                {available ? "Reserve vehicle" : "Enquire"}
              </a>
              <a href="#checkout" className={buttonClass("light", "lg")}>
                Book test drive
              </a>
            </div>
            <a
              href={whatsappLink(WHATSAPP_NUMBER, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-sm font-semibold text-graphite underline underline-offset-4 hover:no-underline"
            >
              Ask on WhatsApp
            </a>
          </div>
        </section>

        {images.length > 1 && (
          <section className="section bg-paper">
            <div className="page-container">
              <h2 className="mb-3 text-heading-lg">Gallery</h2>
              <p className="mb-10 max-w-xl text-body-lg text-steel">
                Photos of this vehicle from our stock. Cosmetic notes are called
                out in the description and inspection below.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.slice(0, 9).map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative overflow-hidden rounded-image bg-chalk ${
                      i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text || title}
                      fill
                      className="object-cover"
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section border-t border-concrete bg-paper">
          <div className="page-container flex flex-col gap-16 lg:flex-row lg:gap-20">
            <div className="min-w-0 flex-1 space-y-section">
              <div>
                <h2 className="mb-8 text-heading-lg">Specifications</h2>
                <dl className="grid grid-cols-2 gap-x-8 md:grid-cols-3">
                  {specs.map((s) => (
                    <div key={s.label} className="border-t border-concrete py-4">
                      <dt className="eyebrow mb-1">{s.label}</dt>
                      <dd className="text-body-lg font-medium capitalize text-graphite">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {car.description && (
                <div>
                  <h2 className="mb-6 text-heading-lg">Condition &amp; notes</h2>
                  <p className="mb-6 whitespace-pre-wrap text-body-lg text-graphite">
                    {car.description}
                  </p>
                  <p className="rounded-card bg-chalk p-6 text-body text-steel">
                    Flaw transparency: we disclose known cosmetic and mechanical
                    notes here and in the inspection scorecard. What you see in
                    writing is what we stand behind at viewing.
                  </p>
                </div>
              )}

              <div>
                <h2 className="mb-6 text-heading-lg">Inspection</h2>
                {inspection ? (
                  <div>
                    <div className="mb-8 flex flex-wrap items-end gap-6">
                      {score != null && (
                        <p className="text-display">
                          {score}
                          <span className="text-heading-sm text-steel">/100</span>
                        </p>
                      )}
                      <p className="pb-2 text-body text-steel">
                        Inspected
                        {inspection.inspector_name
                          ? ` by ${inspection.inspector_name}`
                          : ""}{" "}
                        on{" "}
                        {new Date(inspection.inspected_at).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    {inspection.notes && (
                      <p className="mb-8 text-body-lg text-graphite">{inspection.notes}</p>
                    )}
                    {inspection.items.length > 0 ? (
                      <ul>
                        {inspection.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 border-t border-concrete py-4"
                          >
                            <div>
                              <p className="eyebrow capitalize">{item.category}</p>
                              <p className="text-body-lg font-medium">{item.item}</p>
                              {item.remarks && (
                                <p className="mt-1 text-body text-steel">{item.remarks}</p>
                              )}
                            </div>
                            <InspectionRating
                              rating={item.rating as "good" | "fair" | "needs_attention"}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body text-steel">
                        Overall score recorded. The itemised checklist appears here
                        when completed.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="rounded-card bg-chalk p-6 text-body-lg text-steel">
                    This vehicle is part of our retail stock. An in-house
                    inspection scorecard is attached when available — there is no
                    third-party seller to contact.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-heading-sm">Vehicle history</h2>
                  <p className="text-body-lg text-steel">
                    Kenya lacks a reliable CARFAX-style database for most imports.
                    We replace that with our own inspection, ownership paperwork
                    review, and disclosed condition notes. Ask for logbook and
                    import documents during reservation.
                  </p>
                </div>
                <div>
                  <h2 className="mb-4 text-heading-sm">Pickup &amp; delivery</h2>
                  <ul className="space-y-3 text-body-lg text-steel">
                    <li>
                      Showroom pickup in Nairobi — typically ready within 24–48
                      hours after reservation is confirmed.
                    </li>
                    <li>Local delivery available on request.</li>
                    <li>Logbook transfer assistance included with purchase.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-card bg-chalk p-8 md:p-10">
                <h2 className="mb-6 text-heading-sm">Buyer protection</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-body-lg font-semibold">
                      Condition match guarantee
                    </p>
                    <p className="text-body text-steel">
                      If the disclosed condition doesn&apos;t match at viewing, we
                      resolve it before you complete the purchase.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-body-lg font-semibold">Limited warranty</p>
                    <p className="text-body text-steel">
                      Complimentary limited cover on major mechanicals where
                      offered — scope confirmed at reservation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:w-[400px] lg:self-start">
              <div className="rounded-card bg-chalk p-8">
                <p className="eyebrow mb-2">From our retail stock</p>
                <p className="mb-1 text-heading-md tabular-nums">{formatKes(car.price)}</p>
                <p className="mb-6 text-body text-steel">
                  or about {formatKes(monthly)}/mo (indicative)
                </p>
                <a href="#checkout" className={buttonClass("graphite", "md", "w-full")}>
                  {available ? "Reserve vehicle" : "Not available — enquire"}
                </a>
                <p className="mt-4 text-center text-xs text-steel">
                  Direct from Simcogy Motors — no third-party sellers.
                </p>
              </div>
              <FinancingCalculator price={Number(car.price)} />
              <PurchaseForm carId={car.id} carTitle={title} available={available} />
              <CarAdviser carId={car.id} carTitle={title} />
            </aside>
          </div>
        </section>
      </main>

      <LegalNote />
      <Footer />
    </div>
  );
}
