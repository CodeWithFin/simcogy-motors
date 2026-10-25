"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Find your next car with confidence",
    body: "We sell our own inspected stock — clear pricing and easy test drives for Kenyan buyers. Not a marketplace.",
    image: photos.suvDesert,
    alt: "White SUV parked on a desert road",
    primary: { href: "/cars", label: "Shop our stock" },
    secondary: { href: "/#trade-in", label: "Trade in your car" },
  },
  {
    title: "Every car inspected in-house",
    body: "Engine, body, tyres, electronics and interior — rated and published on every listing before you visit.",
    image: photos.suvMist,
    alt: "White SUV on a wet road below snowy hills",
    primary: { href: "/cars", label: "See inspected cars" },
    secondary: { href: "/#how-it-works", label: "How it works" },
  },
  {
    title: "Know your monthly payment",
    body: "Every listing has a financing calculator, so you can plan your budget before you step into the showroom.",
    image: photos.coupeSunset,
    alt: "Grey coupe on a mountain road at sunset",
    primary: { href: "/#financing", label: "Estimate payments" },
    secondary: { href: "/cars", label: "Browse cars" },
  },
];

const INTERVAL_MS = 7000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative h-[88svh] min-h-[560px] w-full overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

          <div className="page-container relative flex h-full flex-col justify-center pt-16">
            <div className="max-w-[460px] md:ml-16">
              <h1 className="mb-6 text-heading-lg text-paper md:text-heading-xl">
                {slide.title}
              </h1>
              <p className="mb-10 text-body-lg font-medium text-paper/90">
                {slide.body}
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={slide.primary.href} variant="white" size="lg">
                  {slide.primary.label}
                </ButtonLink>
                <ButtonLink href={slide.secondary.href} variant="ghost-light" size="lg">
                  {slide.secondary.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-graphite transition-colors hover:bg-paper md:flex"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-graphite transition-colors hover:bg-paper md:flex"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-paper px-3 py-2.5">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-graphite" : "w-1.5 bg-ash hover:bg-fog"
            )}
          />
        ))}
      </div>
    </section>
  );
}
