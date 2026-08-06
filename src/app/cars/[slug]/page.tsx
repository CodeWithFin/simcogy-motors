import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FinancingCalculator } from "@/components/cars/FinancingCalculator";
import { InspectionRating } from "@/components/cars/InspectionRating";
import { PurchaseForm } from "@/components/cars/PurchaseForm";
import { Subheading } from "@/components/ui/Subheading";
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
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254711812043";
  const waMessage = `Hi Simcogy Motors, I want to reserve the ${title} (${process.env.NEXT_PUBLIC_SITE_URL || ""}/cars/${car.slug})`;
  const cover =
    images[0]?.url ||
    car.cover_url ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative">
        <Navbar overlay />
        <div className="pt-20 px-2 md:px-4">
          <div className="relative w-full h-[50vh] md:h-[70vh] rounded-4xl overflow-hidden photo-surface ring-1 ring-border dark:ring-0">
            <Image
              src={cover}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1440px] mx-auto w-full -mt-24 relative z-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1">
            <Subheading text="Our stock" />
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground max-w-2xl">
                {title}
              </h1>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-light mb-1">
                  Cash price
                </p>
                <p className="text-3xl md:text-4xl font-medium tracking-tight text-accent">
                  {formatKes(car.price)}
                </p>
                {reduced && (
                  <p className="text-sm text-muted-foreground line-through font-light">
                    {formatKes(car.previous_price!)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-2 font-light">
                  Est. {formatKes(monthly)}/mo
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {badges.map((b) => (
                <span
                  key={b.key}
                  className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium ${badgeClass(b.tone)}`}
                >
                  {b.label}
                </span>
              ))}
              {score != null && (
                <span className="inline-flex items-center gap-2 glass-panel rounded-full px-3 py-1 text-xs">
                  <span className="text-accent font-medium">{score}/100</span>
                  <span className="text-muted-foreground">Inspected</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#checkout"
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium"
              >
                {available ? "Reserve vehicle" : "Join waitlist enquiry"}
              </a>
              <a
                href="#checkout"
                className="inline-flex items-center px-6 py-3 rounded-full border border-border font-light hover:border-accent transition-colors"
              >
                Book test drive
              </a>
              <a
                href={whatsappLink(whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-whatsapp text-white font-medium"
              >
                WhatsApp support
              </a>
            </div>

            {images.length > 1 && (
              <div className="mb-12">
                <h2 className="text-2xl font-medium tracking-tight mb-2 text-foreground">
                  Gallery
                </h2>
                <p className="text-sm text-muted-foreground font-light mb-4">
                  Photos of this vehicle from our stock. Cosmetic notes are
                  called out in the description and inspection below.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.slice(0, 8).map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden photo-surface ring-1 ring-border"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text || title}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-2xl font-medium tracking-tight mb-6 text-foreground">
              Specs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {specs.map((s) => (
                <div key={s.label} className="border-b border-border pb-3">
                  <p className="text-xs text-muted-foreground font-light mb-1">
                    {s.label}
                  </p>
                  <p className="text-sm capitalize text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <>
                <h2 className="text-2xl font-medium tracking-tight mb-4 text-foreground">
                  Condition & notes
                </h2>
                <p className="text-muted-foreground font-light text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {car.description}
                </p>
                <p className="text-xs text-muted-foreground font-light mb-12 border border-border rounded-2xl p-4 bg-muted/40">
                  Flaw transparency: we disclose known cosmetic and mechanical
                  notes here and in the inspection scorecard. What you see in
                  writing is what we stand behind at viewing.
                </p>
              </>
            )}

            <section className="mb-12">
              <h2 className="text-2xl font-medium tracking-tight mb-4 text-foreground">
                Inspection & certification
              </h2>
              {inspection ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-end gap-4 mb-2">
                    {score != null && (
                      <p className="text-4xl font-light tracking-tighter text-accent">
                        {score}
                        <span className="text-lg text-muted-foreground">
                          /100
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground font-light">
                      Inspected
                      {inspection.inspector_name
                        ? ` by ${inspection.inspector_name}`
                        : ""}{" "}
                      on{" "}
                      {new Date(inspection.inspected_at).toLocaleDateString(
                        "en-KE"
                      )}
                    </p>
                  </div>
                  {inspection.notes && (
                    <p className="text-sm text-muted-foreground font-light">
                      {inspection.notes}
                    </p>
                  )}
                  {inspection.items.length > 0 ? (
                    <div className="space-y-3">
                      {inspection.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"
                        >
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {item.category}
                            </p>
                            <p className="text-sm font-medium">{item.item}</p>
                            {item.remarks && (
                              <p className="text-xs text-muted-foreground font-light mt-1">
                                {item.remarks}
                              </p>
                            )}
                          </div>
                          <InspectionRating
                            rating={
                              item.rating as
                                | "good"
                                | "fair"
                                | "needs_attention"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-light">
                      Overall score recorded. Itemized checklist appears here
                      when completed.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-light border border-border rounded-2xl p-5 bg-muted/40">
                  This vehicle is part of our retail stock. An in-house
                  inspection scorecard is attached when available — there is no
                  third-party seller to contact.
                </p>
              )}
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-medium tracking-tight mb-4 text-foreground">
                Vehicle history
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                Kenya lacks a reliable CARFAX-style database for most imports. We
                replace that with our own inspection, ownership paperwork review,
                and disclosed condition notes. Ask for logbook and import
                documents during reservation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-medium tracking-tight mb-4 text-foreground">
                Pickup & delivery
              </h2>
              <ul className="space-y-3 text-sm font-light text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">◆</span>
                  Showroom pickup in Nairobi — typically ready within 24–48
                  hours after reservation confirmation.
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">◆</span>
                  Local delivery available on request; timing confirmed when you
                  reserve.
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">◆</span>
                  Logbook transfer assistance included with purchase.
                </li>
              </ul>
            </section>

            <section className="border border-border rounded-4xl p-6 md:p-8 bg-card mb-8">
              <h2 className="text-xl font-medium tracking-tight mb-4">
                Buyer protection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-light text-muted-foreground">
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Condition match guarantee
                  </p>
                  <p>
                    If disclosed condition doesn&apos;t match at viewing, we
                    resolve it before you complete purchase.
                  </p>
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Limited warranty
                  </p>
                  <p>
                    Complimentary limited cover on major mechanicals where
                    offered — scope confirmed at reservation.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:w-[400px] space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card border border-border rounded-4xl p-6 shadow-sm dark:shadow-none">
              <p className="text-xs text-muted-foreground font-light mb-1">
                From our retail stock
              </p>
              <p className="text-2xl font-medium tracking-tight text-accent tabular-nums mb-1">
                {formatKes(car.price)}
              </p>
              <p className="text-sm text-muted-foreground font-light mb-4">
                or ~{formatKes(monthly)}/mo (indicative)
              </p>
              <a
                href="#checkout"
                className="flex w-full items-center justify-center py-3 rounded-full bg-accent text-accent-foreground font-medium mb-3"
              >
                {available ? "Reserve vehicle" : "Not available — enquire"}
              </a>
              <p className="text-[11px] text-muted-foreground font-light text-center leading-relaxed">
                Direct from Simcogy Motors — no third-party sellers. Reserve to
                hold this car while we finalize paperwork.
              </p>
            </div>
            <FinancingCalculator price={Number(car.price)} />
            <PurchaseForm
              carId={car.id}
              carTitle={title}
              available={available}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
