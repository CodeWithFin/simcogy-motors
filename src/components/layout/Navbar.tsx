"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

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

  return (
    <nav className="absolute top-4 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 w-full max-w-[1440px] mx-auto">
      <Link
        href="/"
        className={cn(
          "tracking-tighter font-medium text-lg uppercase",
          overlay ? "text-white" : "text-foreground"
        )}
      >
        Simcogy Motors
      </Link>

      <div
        className={cn(
          "hidden md:flex px-6 py-2.5 items-center space-x-6 rounded-full",
          overlay
            ? "bg-black/35 backdrop-blur-md border border-white/15"
            : "bg-foreground text-background"
        )}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-light transition-colors",
              overlay
                ? "text-white/80 hover:text-white"
                : "text-background/80 hover:text-background"
            )}
          >
            {item.label}
          </Link>
        ))}
        <div
          className={overlay ? "text-white/25" : "text-background/25"}
          aria-hidden
        >
          |
        </div>
        <Link
          href="/cars"
          className={
            overlay
              ? "text-white/60 hover:text-white"
              : "text-background/60 hover:text-background"
          }
          aria-label="Search cars"
        >
          <SearchIcon />
        </Link>
        <ThemeToggle
          className={
            overlay
              ? "text-white/70 hover:text-white hover:bg-white/10 ring-offset-transparent"
              : "text-background/70 hover:text-background hover:bg-background/10 ring-offset-transparent"
          }
        />
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
          className={cn(
            "w-10 h-10 flex flex-col justify-center items-center space-y-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            overlay
              ? "bg-black/35 backdrop-blur-md border border-white/15"
              : "bg-foreground"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <div
            className={cn(
              "w-4 h-[1px] rounded-full",
              overlay ? "bg-white" : "bg-background"
            )}
          />
          <div
            className={cn(
              "w-4 h-[1px] rounded-full",
              overlay ? "bg-white" : "bg-background"
            )}
          />
          <div
            className={cn(
              "w-4 h-[1px] rounded-full",
              overlay ? "bg-white" : "bg-background"
            )}
          />
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
