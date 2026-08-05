import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { EnquiryForm } from "@/components/cars/EnquiryForm";
import { FinancingCalculator } from "@/components/cars/FinancingCalculator";
import { Subheading } from "@/components/ui/Subheading";
import { getCarBySlug, getCarImages } from "@/lib/cars";
import { carTitle, formatKes, whatsappLink } from "@/lib/format";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const car = await getCarBySlug(slug);
    if (!car) return { title: "Car not found" };
    return {
      title: carTitle(car),
      description: car.description?.slice(0, 160) || `${carTitle(car)} for sale`,
    };
  } catch {
    return { title: "Car" };
  }
}

export default async function CarDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  let car = null;
  let images: Awaited<ReturnType<typeof getCarImages>> = [];

  try {
    car = await getCarBySlug(slug);
    if (car) images = await getCarImages(car.id);
  } catch {
    notFound();
  }

  if (!car) notFound();

  const title = carTitle(car);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254700000000";
  const waMessage = `Hi Simcogy Motors, I'm interested in the ${title} (${process.env.NEXT_PUBLIC_SITE_URL || ""}/cars/${car.slug})`;
  const cover =
    images[0]?.url ||
    car.cover_url ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop";

  const specs = [
    { label: "Year", value: String(car.year) },
    { label: "Mileage", value: `${car.mileage_km.toLocaleString()} km` },
    { label: "Transmission", value: car.transmission || "—" },
    { label: "Fuel", value: car.fuel_type || "—" },
    { label: "Body", value: car.body_type || "—" },
    { label: "Drivetrain", value: car.drivetrain?.toUpperCase() || "—" },
    {
      label: "Engine",
      value: car.engine_capacity_cc
        ? `${car.engine_capacity_cc} cc`
        : "—",
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
        <Navbar />
        <div className="pt-20 px-2 md:px-4">
          <div className="relative w-full h-[50vh] md:h-[70vh] rounded-4xl overflow-hidden">
            <Image
              src={cover}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1440px] mx-auto w-full -mt-24 relative z-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1">
            <Subheading text={car.make} />
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
                {title}
              </h1>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-medium tracking-tight text-accent">
                  {formatKes(car.price)}
                </p>
                {car.previous_price &&
                  Number(car.previous_price) > Number(car.price) && (
                    <p className="text-sm text-muted line-through font-light">
                      {formatKes(car.previous_price)}
                    </p>
                  )}
                <p className="text-xs text-muted mt-1 font-light">
                  {car.negotiable ? "Negotiable" : "Fixed price"}
                  {car.status === "reserved" ? " · Reserved" : ""}
                </p>
              </div>
            </div>

            {car.overall_score != null && (
              <div className="inline-flex items-center gap-3 glass-panel rounded-full px-4 py-2 mb-8">
                <span className="text-accent font-medium">
                  {car.overall_score}/100
                </span>
                <span className="text-xs text-muted">
                  Verified by Simcogy Motors
                </span>
              </div>
            )}

            {images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
                {images.slice(0, 8).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border"
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
            )}

            <h2 className="text-2xl font-medium tracking-tight mb-6">
              Specs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="border-b border-border pb-3"
                >
                  <p className="text-xs text-muted font-light mb-1">
                    {s.label}
                  </p>
                  <p className="text-sm capitalize">{s.value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <>
                <h2 className="text-2xl font-medium tracking-tight mb-4">
                  Description
                </h2>
                <p className="text-muted font-light text-sm leading-relaxed whitespace-pre-wrap mb-12">
                  {car.description}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href={whatsappLink(whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-background font-medium"
              >
                WhatsApp enquire
              </a>
              <Link
                href="#enquiry"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 font-light hover:border-accent transition-colors"
              >
                Book test drive
              </Link>
            </div>
          </div>

          <div className="lg:w-[400px] space-y-6" id="enquiry">
            <FinancingCalculator price={Number(car.price)} />
            <EnquiryForm carId={car.id} carTitle={title} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
