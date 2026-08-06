import { Subheading } from "@/components/ui/Subheading";

const steps = [
  {
    n: "01",
    title: "Browse our stock",
    body: "Filter by make, budget, and specs. Every car we list is from our own inventory — clear pricing and condition details.",
  },
  {
    n: "02",
    title: "Enquire or book a test drive",
    body: "WhatsApp us, send an enquiry, or schedule a visit — usually under two minutes.",
  },
  {
    n: "03",
    title: "Reserve and complete purchase",
    body: "Hold a car with a deposit when you’re ready, then finish paperwork at the showroom.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto scroll-mt-8"
    >
      <div className="mb-14 max-w-2xl">
        <Subheading text="Process" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
          How buying works
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {steps.map((step) => (
          <div key={step.n} className="border-t border-border pt-8">
            <p className="text-accent text-sm tracking-wider mb-4">{step.n}</p>
            <h3 className="text-xl font-medium tracking-tight mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
