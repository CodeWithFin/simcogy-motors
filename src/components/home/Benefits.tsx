import { Subheading } from "@/components/ui/Subheading";

const features = [
  {
    title: "Inspection scorecard",
    body: "Engine, body, tires, electronics, interior, and brakes — rated and shown on every listing.",
  },
  {
    title: "Financing clarity",
    body: "Estimate monthly payments on the listing page before you visit the showroom.",
  },
  {
    title: "WhatsApp-first leads",
    body: "Enquire or book a test drive in under two minutes from your phone.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      <div className="text-center mb-16 flex flex-col items-center">
        <Subheading text="Why Simcogy" />
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight max-w-2xl leading-tight text-foreground">
          Built to cut friction from browse to buy
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-card text-card-foreground rounded-4xl p-8 md:p-10 border border-border hover:border-foreground/15 transition-colors shadow-sm dark:shadow-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-accent mb-8 text-xl">
              ◆
            </div>
            <h3 className="text-xl font-medium tracking-tight mb-4">
              {feature.title}
            </h3>
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
