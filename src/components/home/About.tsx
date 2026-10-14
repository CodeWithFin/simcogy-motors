import { ButtonLink } from "@/components/ui/Button";

const stats = [
  { value: "100%", label: "In-house inspected" },
  { value: "48h", label: "Reservation hold" },
  { value: "1", label: "Dealer — no third parties" },
  { value: "KE", label: "Kenya-focused stock" },
];

const features = [
  {
    title: "Inspection scorecard",
    body: "Engine, body, tyres, electronics, interior, and brakes — rated and shown on every listing.",
  },
  {
    title: "Financing clarity",
    body: "Estimate monthly payments on the listing page before you visit the showroom.",
  },
  {
    title: "WhatsApp-first support",
    body: "Enquire or book a test drive in under two minutes from your phone.",
  },
];

export function About() {
  return (
    <section id="about" className="section scroll-mt-20 bg-paper">
      <div className="page-container">
        <div className="mx-auto mb-section max-w-4xl text-center">
          <h2 className="mb-6 text-heading-lg md:text-display">
            Verified cars, clear pricing, less back-and-forth
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-body-lg text-steel">
            Simcogy Motors sells only its own inspected stock — not a
            marketplace. Third parties cannot list cars here. Every vehicle
            comes with a condition scorecard, transparent specs, and a direct
            path to enquire, book a test drive, or reserve.
          </p>
          <ButtonLink href="/cars" variant="graphite" size="lg">
            Browse inventory
          </ButtonLink>
        </div>

        <dl className="grid grid-cols-2 gap-px border-y border-concrete bg-concrete md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-paper px-4 py-10 text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-heading-xl md:text-display">{stat.value}</dd>
              <dd className="mt-2 text-body text-steel">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-section grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <h3 className="mb-3 text-subheading">{feature.title}</h3>
              <p className="text-body-lg text-steel">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
