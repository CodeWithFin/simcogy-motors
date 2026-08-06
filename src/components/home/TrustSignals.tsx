import { Subheading } from "@/components/ui/Subheading";

const reviews = [
  {
    name: "James K.",
    loc: "Nairobi",
    text: "The inspection notes matched what I saw at the yard. Bought my CX-5 within a week — no endless WhatsApp chasing.",
  },
  {
    name: "Amina W.",
    loc: "Westlands",
    text: "Clear pricing and a proper walkaround. Test drive was booked same day. Felt like a dealer that respects your time.",
  },
  {
    name: "David O.",
    loc: "Kilimani",
    text: "Used the payment estimator on the listing, then reserved the Prado. Process was straightforward from enquire to handover.",
  },
];

export function TrustSignals() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
        <div>
          <Subheading text="Trust" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
            Inspected in-house. Verified by us.
          </h2>
          <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-md mb-8">
            Kenya doesn’t have a CARFAX equivalent that works for most imports.
            We replace that with our own scorecard — engine, body, tires,
            electronics, interior, and brakes — published on the listing.
          </p>
          <ul className="space-y-3 text-sm font-light">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">◆</span>
              <span>Condition score shown on every inspected car</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">◆</span>
              <span>48-hour reservation hold with deposit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">◆</span>
              <span>Single-dealer stock — we own what we sell</span>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <div className="bg-card border border-border rounded-4xl p-6 sm:col-span-2">
            <p className="text-xs text-muted-foreground font-light mb-2 uppercase tracking-wider">
              Guarantee
            </p>
            <p className="text-xl font-medium tracking-tight mb-2">
              Transparent condition, or we talk
            </p>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              If the car’s disclosed condition doesn’t match the scorecard at
              viewing, we’ll make it right before you commit.
            </p>
          </div>
          <div className="bg-muted/60 border border-border rounded-4xl p-6">
            <p className="text-3xl font-light tracking-tighter text-accent mb-1">
              100%
            </p>
            <p className="text-sm text-muted-foreground font-light">
              In-house inspected stock
            </p>
          </div>
          <div className="bg-muted/60 border border-border rounded-4xl p-6">
            <p className="text-3xl font-light tracking-tighter text-accent mb-1">
              48h
            </p>
            <p className="text-sm text-muted-foreground font-light">
              Reservation hold window
            </p>
          </div>
        </div>
      </div>

      <div>
        <Subheading text="Reviews" />
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-10">
          What buyers say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <blockquote
              key={r.name}
              className="border-t border-border pt-6"
            >
              <p className="text-sm font-light text-foreground/90 leading-relaxed mb-6">
                “{r.text}”
              </p>
              <footer>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  {r.loc}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
