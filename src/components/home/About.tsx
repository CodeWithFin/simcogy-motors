import Link from "next/link";
import { Subheading } from "@/components/ui/Subheading";

const stats = [
  { number: "100", suffix: "%", label: "In-house inspected" },
  { number: "48", suffix: "h", label: "Reservation hold" },
  { number: "1", suffix: "", label: "Trusted dealer" },
  { number: "KE", suffix: "", label: "Kenya-focused stock" },
];

export function About() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <Subheading text="About us" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-8 max-w-2xl text-foreground">
            Verified cars, clear pricing, and less back-and-forth.
          </h2>
          <div className="flex items-center space-x-6 border-b border-border pb-8 max-w-md">
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              Simcogy Motors lists its own inspected stock — not a marketplace.
              Every car comes with a condition scorecard, transparent specs, and
              a direct path to enquire, book a test drive, or reserve.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center space-x-4 mt-8 group"
          >
            <span className="text-lg font-light group-hover:text-accent transition-colors">
              Browse inventory
            </span>
            <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground group-hover:scale-105 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="lg:w-1/2 grid grid-cols-2 gap-y-12 gap-x-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div className="flex items-end mb-2">
                <span className="text-5xl md:text-6xl font-light tracking-tighter text-foreground">
                  {stat.number}
                </span>
                {stat.suffix && (
                  <span className="text-accent text-4xl md:text-5xl font-light tracking-tighter mb-1 ml-1">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground font-light text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
