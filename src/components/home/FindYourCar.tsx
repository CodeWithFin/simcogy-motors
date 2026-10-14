"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { carTitle, estimateMonthly, formatKes } from "@/lib/format";
import { placeholderCarPhoto } from "@/lib/photos";
import type { Car } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Shrinks long model names so the monogram always fits on one line. */
function monogramSize(text: string) {
  const vw = 88 / (Math.max(text.length, 3) * 0.62);
  return `min(360px, ${vw.toFixed(2)}vw)`;
}

export function FindYourCar({ cars }: { cars: Car[] }) {
  const items = cars.slice(0, 4);
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const car = items[index];
  const mark = car.model.toUpperCase();
  const go = (next: number) => setIndex((next + items.length) % items.length);

  return (
    <section className="bg-chalk pt-section-lg pb-section">
      <div className="page-container text-center">
        <h2 className="mb-4 text-heading-lg md:text-display">Find your car</h2>
        <p className="mx-auto max-w-md text-body-lg text-steel">
          Hand-picked from our own inspected stock — priced clearly and ready to
          view.
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden" aria-live="polite">
        <h3
          className="monogram select-none text-center"
          style={{ fontSize: monogramSize(mark) }}
        >
          {mark}
        </h3>

        <div className="page-container relative -mt-[3%]">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-[1000px] overflow-hidden rounded-image bg-ash">
            <Image
              key={car.id}
              src={car.cover_url || placeholderCarPhoto}
              alt={carTitle(car)}
              fill
              className="object-cover"
              sizes="(max-width: 1100px) 100vw, 1000px"
            />
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous car"
                className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-graphite transition-colors hover:bg-concrete md:left-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next car"
                className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-graphite transition-colors hover:bg-concrete md:right-10"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-container mt-10 flex flex-col items-center text-center">
        <p className="mb-2 text-subheading font-medium text-graphite">
          {carTitle(car)}
        </p>
        <p className="mb-8 text-body text-steel">
          {formatKes(car.price)} · Est. {formatKes(estimateMonthly(car.price))}/mo ·{" "}
          {car.mileage_km.toLocaleString()} km
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={`/cars/${car.slug}`} variant="graphite" size="lg">
            Explore
          </ButtonLink>
          <ButtonLink href={`/cars/${car.slug}#checkout`} variant="light" size="lg">
            Enquire
          </ButtonLink>
        </div>

        {items.length > 1 && (
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Featured cars">
            {items.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition-colors",
                  i === index
                    ? "bg-graphite text-paper"
                    : "bg-concrete text-graphite hover:bg-ash"
                )}
              >
                {c.model}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
