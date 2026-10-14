"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

const steps = [
  {
    tab: "Browse",
    title: "Browse our stock",
    body: "Filter by make, budget, and specs. Every car we list is from our own inventory — with clear pricing and condition details.",
    image: photos.suvRoad,
    alt: "Silver SUV parked on a quiet road",
    cta: { href: "/cars", label: "Browse inventory" },
  },
  {
    tab: "Test drive",
    title: "Enquire or book a test drive",
    body: "WhatsApp us, send an enquiry, or schedule a visit — it usually takes under two minutes.",
    image: photos.windingRoad,
    alt: "Car driving along a winding road",
    cta: { href: "/#contact", label: "Contact us" },
  },
  {
    tab: "Reserve",
    title: "Reserve and drive home",
    body: "Hold a car with a deposit when you're ready, then finish the paperwork and logbook transfer at the showroom.",
    image: photos.dusk,
    alt: "Car parked on a hill at dusk",
    cta: { href: "/cars", label: "Find your car" },
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section id="how-it-works" className="section scroll-mt-20 bg-paper">
      <div className="page-container">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl text-heading-lg md:text-display">
            Buying made simple
          </h2>
          <div
            role="tablist"
            aria-label="How buying works"
            className="flex gap-1 self-start rounded-full bg-chalk p-1 lg:self-auto"
          >
            {steps.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                role="tab"
                id={`step-tab-${i}`}
                aria-selected={i === active}
                aria-controls="step-panel"
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  i === active ? "bg-paper text-graphite" : "text-steel hover:text-graphite"
                )}
              >
                {s.tab}
              </button>
            ))}
          </div>
        </div>

        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${active}`}
          className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:items-end"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-image bg-chalk">
            <Image
              key={step.image}
              src={step.image}
              alt={step.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
          <div className="lg:pb-4">
            <p className="eyebrow mb-4">
              Step {active + 1} of {steps.length}
            </p>
            <h3 className="mb-4 text-heading-sm">{step.title}</h3>
            <p className="mb-8 text-body-lg text-steel">{step.body}</p>
            <ButtonLink href={step.cta.href} variant="graphite">
              {step.cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
