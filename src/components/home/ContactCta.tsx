import Link from "next/link";
import { Subheading } from "@/components/ui/Subheading";

export function ContactCta() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254711812043";
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hi Simcogy Motors, I'm interested in your inventory."
  )}`;

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto"
    >
      <div className="rounded-4xl border border-border bg-card text-card-foreground p-10 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-10 shadow-sm dark:shadow-none">
        <div className="max-w-xl">
          <Subheading text="Contact" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">
            Ready to view a car?
          </h2>
          <p className="text-muted-foreground font-light text-sm leading-relaxed">
            Message us on WhatsApp or browse the full inventory and send an
            enquiry from any listing.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* WhatsApp green is a fixed brand color — intentionally not tokenized */}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-whatsapp text-white font-medium hover:scale-[1.02] transition-transform"
          >
            WhatsApp us
          </a>
          <Link
            href="/cars"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-border font-light hover:border-accent transition-colors"
          >
            View cars
          </Link>
        </div>
      </div>
    </section>
  );
}
