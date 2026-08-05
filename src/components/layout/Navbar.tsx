"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/cars", label: "Inventory" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-4 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 w-full max-w-[1440px] mx-auto">
      <Link
        href="/"
        className="tracking-tighter font-medium text-lg uppercase text-foreground"
      >
        Simcogy Motors
      </Link>

      <div className="hidden md:flex glass-panel rounded-full px-6 py-2.5 items-center space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-light text-foreground/80 hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <div className="text-foreground/20">|</div>
        <Link
          href="/cars"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Search cars"
        >
          <SearchIcon />
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          type="button"
          className="glass-panel rounded-full w-10 h-10 flex flex-col justify-center items-center space-y-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <div className="w-4 h-[1px] bg-foreground rounded-full" />
          <div className="w-4 h-[1px] bg-foreground rounded-full" />
          <div className="w-4 h-[1px] bg-foreground rounded-full" />
        </button>
      </div>

      {open && (
        <div className="absolute top-14 right-4 left-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden bg-card/95">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-light text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
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
