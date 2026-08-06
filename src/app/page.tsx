import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/home/About";
import { Benefits } from "@/components/home/Benefits";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { FinanceTrade } from "@/components/home/FinanceTrade";
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

export const revalidate = 60;

export default async function HomePage() {
  let cars: Car[] = [];
  let reduced: Car[] = [];
  let makes: string[] = [];

  try {
    const [featured, drops, options] = await Promise.all([
      getFeaturedCars(6),
      getReducedCars(4),
      getFilterOptions(),
    ]);
    cars = featured;
    reduced = drops;
    makes = options.makes;
  } catch {
    // DB unavailable — show empty states
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Hero />
      <QuickSearch makes={makes} />
      <FeaturedCars cars={cars} />
      <PriceDrops cars={reduced} />
      <HowItWorks />
      <TrustSignals />
      <FinanceTrade />
      <About />
      <Benefits />
      <ContactCta />
      <Footer />
    </div>
  );
}
