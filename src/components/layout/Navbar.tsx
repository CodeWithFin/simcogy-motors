"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { viewingLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cars", label: "Inventory" },
  { href: "/#financing", label: "Financing" },
  { href: "/#trade-in", label: "Trade-in" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 p-3">
      <header className="relative mx-auto flex h-14 max-w-page items-center justify-between rounded-nav border border-ash/50 bg-paper px-4 shadow-nav md:px-6">
        <Link
          href="/"
          className="text-[15px] font-medium uppercase tracking-[0.32em] text-graphite"
          onClick={() => setOpen(false)}
        >
          Simcogy
        </Link>

        <nav
          aria-label="Main"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-graphite transition-colors hover:bg-chalk"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={viewingLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("solar", "sm")}
          >
            Book a viewing
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-graphite transition-colors hover:bg-chalk lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto mt-2 max-w-page overflow-hidden rounded-nav border border-ash/50 bg-paper shadow-float transition-all lg:hidden",
          open ? "visible opacity-100" : "invisible h-0 border-0 opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col p-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-icon px-3 py-3 text-body-lg font-medium text-graphite hover:bg-chalk"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
