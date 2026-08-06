"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/cars", label: "Inventory" },
  { href: "/#financing", label: "Financing" },
  { href: "/#trade-in", label: "Trade-in" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  /** Force light text/glass for use over dark photo heroes */
  overlay?: boolean;
};

export function Navbar({ overlay = false }: Props) {
  const [open, setOpen] = useState(false);

  // Brand must stay dark on light pages — never wash out against cream/white
  const brand = overlay
    ? "text-white"
    : "text-neutral-900 dark:text-white";

  const panel = overlay
    ? "rounded-full bg-black/35 backdrop-blur-md border border-white/15"
    : "rounded-full bg-neutral-900 dark:bg-white/10 dark:border dark:border-white/15";

  const item = "text-white/80 hover:text-white transition-colors";
  const itemMuted = "text-white/60 hover:text-white transition-colors";
  const bar = "bg-white";

  return (
    <nav className="absolute top-4 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 w-full max-w-[1440px] mx-auto">
      <Link
        href="/"
        className={`tracking-tighter font-medium text-lg uppercase ${brand}`}
      >
        Simcogy Motors
      </Link>

      <div
        className={`hidden md:flex ${panel} px-6 py-2.5 items-center space-x-6`}
      >
        {links.map((itemLink) => (
          <Link
            key={itemLink.href}
            href={itemLink.href}
            className={`text-sm font-light ${item}`}
          >
            {itemLink.label}
          </Link>
        ))}
        <div className="text-white/25">|</div>
        <Link href="/cars" className={itemMuted} aria-label="Search cars">
          <SearchIcon />
        </Link>
        <ThemeToggle className="text-white/70 hover:text-white hover:bg-white/10" />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle
          className={
            overlay
              ? "text-white/70 hover:text-white hover:bg-white/10"
              : undefined
          }
        />
        <button
          type="button"
          className={`${panel} w-10 h-10 flex flex-col justify-center items-center space-y-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <div className={`w-4 h-[1px] ${bar} rounded-full`} />
          <div className={`w-4 h-[1px] ${bar} rounded-full`} />
          <div className={`w-4 h-[1px] ${bar} rounded-full`} />
        </button>
      </div>

      {open && (
        <div className="absolute top-14 right-4 left-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden bg-card/95">
          {links.map((itemLink) => (
            <Link
              key={itemLink.href}
              href={itemLink.href}
              className="text-sm font-light text-foreground"
              onClick={() => setOpen(false)}
            >
              {itemLink.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 20l-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
