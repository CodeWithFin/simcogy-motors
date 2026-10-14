import { Footer } from "@/components/layout/Footer";
import { LegalNote } from "@/components/layout/LegalNote";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/home/About";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { FinanceTrade } from "@/components/home/FinanceTrade";
import { FindYourCar } from "@/components/home/FindYourCar";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PriceDrops } from "@/components/home/PriceDrops";
import { QuickSearch } from "@/components/home/QuickSearch";
import { TrustSignals } from "@/components/home/TrustSignals";
import {
  getFeaturedCars,
  getFilterOptions,
  getReducedCars,
} from "@/lib/cars";
import type { Car } from "@/lib/types";

// Rendered per request: the Docker build has no database, and admin changes should show immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let cars: Car[] = [];
  let reduced: Car[] = [];
  let makes: string[] = [];

  try {
    const [featured, drops, options] = await Promise.all([
      getFeaturedCars(6),
      getReducedCars(6),
      getFilterOptions(),
    ]);
    cars = featured;
    reduced = drops;
    makes = options.makes;
  } catch {
    // DB unavailable — show empty states
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main>
        <Hero />
        <FindYourCar cars={cars} />
        <QuickSearch makes={makes} />
        <FeaturedCars cars={cars} />
        <PriceDrops cars={reduced} />
        <HowItWorks />
        <TrustSignals />
        <FinanceTrade />
        <About />
        <ContactCta />
        <LegalNote />
      </main>
      <Footer />
    </div>
  );
}
