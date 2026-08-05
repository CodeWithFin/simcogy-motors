"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/cars", label: "Inventory" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  /** Force light text/glass for use over dark photo heroes */
  overlay?: boolean;
};

export function Navbar({ overlay = false }: Props) {
  const [open, setOpen] = useState(false);
  const brand = overlay ? "text-white" : "text-foreground";
  const link = overlay
    ? "text-white/80 hover:text-white"
    : "text-foreground/80 hover:text-foreground";
  const muted = overlay
    ? "text-white/60 hover:text-white"
    : "text-muted-foreground hover:text-foreground";
  const panel = overlay
    ? "rounded-full bg-black/35 backdrop-blur-md border border-white/15"
    : "glass-panel rounded-full";
  const bar = overlay ? "bg-white" : "bg-foreground";

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
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-light transition-colors ${link}`}
          >
            {item.label}
          </Link>
        ))}
        <div className={overlay ? "text-white/25" : "text-foreground/20"}>
          |
        </div>
        <Link href="/cars" className={muted} aria-label="Search cars">
          <SearchIcon />
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
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
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-light text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
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
