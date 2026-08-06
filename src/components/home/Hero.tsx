import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Subheading } from "@/components/ui/Subheading";

export function Hero() {
  return (
    <div className="p-2 md:p-4 h-[95vh] md:h-[90vh]">
      <div className="relative w-full h-full rounded-4xl overflow-hidden ring-1 ring-border dark:ring-0">
        <Image
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop"
          alt="Premium car at Simcogy Motors"
          fill
          priority
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />

        <Navbar overlay />

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 z-20 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
          <div className="max-w-2xl">
            <Subheading text="Verified stock" />
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[1.1] mb-6 text-white">
              Find your next
              <br />
              car with confidence
            </h1>
            <p className="text-white/70 font-light text-sm md:text-base max-w-md">
              We sell our own inspected stock — clear pricing and easy test
              drives for Kenyan buyers. Not a marketplace.
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-12 w-full lg:w-auto">
            <Link
              href="/cars"
              className="group flex items-center space-x-3 text-lg font-light text-white hover:text-accent transition-colors justify-between"
            >
              <span>Shop used cars</span>
              <span className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:border-accent transition-colors">
                <ArrowIcon />
              </span>
            </Link>
            <Link
              href="/#trade-in"
              className="group flex items-center space-x-3 text-lg font-light text-white hover:text-accent transition-colors justify-between"
            >
              <span>Trade in your car</span>
              <span className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:border-accent transition-colors">
                <ArrowIcon />
              </span>
            </Link>
            <Link
              href="/#financing"
              className="group flex items-center space-x-3 text-lg font-light text-white/70 hover:text-accent transition-colors justify-between"
            >
              <span>Check financing</span>
              <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center group-hover:border-accent transition-colors">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
