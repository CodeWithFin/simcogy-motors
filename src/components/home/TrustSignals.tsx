import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/photos";

const points = [
  { value: "100%", label: "In-house inspected stock" },
  { value: "48h", label: "Reservation hold window" },
  { value: "6", label: "Areas rated on every scorecard" },
];

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
    <>
      <section className="relative overflow-hidden bg-charcoal">
        <Image
          src={photos.garage}
          alt="Car under lights in a workshop"
          fill
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="page-container relative flex min-h-[640px] flex-col justify-end py-section md:min-h-[760px]">
          <div className="max-w-2xl">
            <h2 className="mb-6 text-heading-lg text-paper md:text-display">
              Inspected in-house. Verified by us.
            </h2>
            <p className="mb-10 max-w-xl text-body-lg text-paper/85">
              Kenya doesn&apos;t have a CARFAX equivalent that works for most
              imports. We replace it with our own scorecard — engine, body,
              tyres, electronics, interior, and brakes — published on every
              listing. If the condition doesn&apos;t match at viewing, we make it
              right before you commit.
            </p>
            <ButtonLink href="/cars" variant="ghost-light" size="lg">
              See inspected cars
            </ButtonLink>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-8 border-t border-paper/25 pt-10 sm:grid-cols-3">
            {points.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="text-heading-lg text-paper">{p.value}</dd>
                <dd className="mt-1 text-body text-paper/75">{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="page-container">
          <h2 className="mb-12 text-heading-lg md:text-heading-xl">
            What buyers say
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote key={r.name} className="border-t border-graphite pt-8">
                <p className="mb-8 text-subheading font-medium text-graphite">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer>
                  <p className="text-body font-semibold">{r.name}</p>
                  <p className="text-body text-steel">{r.loc}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
