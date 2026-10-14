import Link from "next/link";
import { viewingLink } from "@/lib/contact";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/cars", label: "All inventory" },
      { href: "/cars?bodyType=suv", label: "SUVs" },
      { href: "/cars?bodyType=sedan", label: "Sedans" },
      { href: "/cars?sort=price_asc", label: "Best prices" },
    ],
  },
  {
    title: "Buying",
    links: [
      { href: "/#financing", label: "Financing" },
      { href: "/#trade-in", label: "Trade-in" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About us" },
      { href: "/#contact", label: "Contact" },
      { href: "/admin/login", label: "Staff login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-paper">
      <div className="page-container grid grid-cols-2 gap-x-8 gap-y-12 border-t border-concrete py-section md:grid-cols-5">
        <div className="col-span-2">
          <p className="mb-4 text-[15px] font-medium uppercase tracking-[0.32em] text-graphite">
            Simcogy
          </p>
          <p className="mb-6 max-w-xs text-body text-steel">
            We sell our own inspected used cars in Kenya — clear pricing and
            direct showroom support. Not a marketplace.
          </p>
          <a
            href={viewingLink("Hi Simcogy Motors, I'm interested in your inventory.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-graphite underline underline-offset-4 hover:no-underline"
          >
            WhatsApp us
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-semibold text-graphite">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-steel transition-colors hover:text-graphite"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="page-container flex flex-col gap-3 border-t border-concrete py-6 text-xs text-steel md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Simcogy Motors. All rights reserved.</p>
        <p>Nairobi, Kenya</p>
      </div>
    </footer>
  );
}
