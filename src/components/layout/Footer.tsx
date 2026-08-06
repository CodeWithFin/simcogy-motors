import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/cars", label: "Inventory" },
      { href: "/#financing", label: "Financing" },
      { href: "/#trade-in", label: "Trade-in" },
      { href: "/#about", label: "About" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/#contact", label: "Contact" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/admin/login", label: "Staff login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/#", label: "Privacy Policy" },
      { href: "/#", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254711812043";
  const wa = `https://wa.me/${whatsapp}`;

  return (
    <footer className="border-t border-border mt-8">
      <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <p className="tracking-tighter font-medium uppercase text-sm mb-4">
            Simcogy Motors
          </p>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs mb-6">
            Verified used cars in Kenya — inspected stock, clear pricing, and
            direct showroom support.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light hover:text-accent transition-colors"
          >
            WhatsApp us →
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              {col.title}
            </p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Simcogy Motors. All rights reserved.
        </p>
        <p>Nairobi, Kenya</p>
      </div>
    </footer>
  );
}
