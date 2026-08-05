import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/home/About";
import { Benefits } from "@/components/home/Benefits";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { Hero } from "@/components/home/Hero";
import { getFeaturedCars } from "@/lib/cars";
import type { Car } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  let cars: Car[] = [];
  try {
    cars = await getFeaturedCars(6);
  } catch {
    cars = [];
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Hero />
      <About />
      <FeaturedCars cars={cars} />
      <Benefits />
      <ContactCta />
      <Footer />
    </div>
  );
}
