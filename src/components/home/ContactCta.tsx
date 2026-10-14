import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { viewingLink } from "@/lib/contact";
import { photos } from "@/lib/photos";

export function ContactCta() {
  return (
    <section id="contact" className="section scroll-mt-20 bg-chalk">
      <div className="page-container">
        <div className="grid grid-cols-1 overflow-hidden rounded-card bg-paper lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
            <Image
              src={photos.showroom}
              alt="Car parked outside a showroom entrance"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p className="eyebrow mb-4">Visit us</p>
            <h2 className="mb-4 text-heading-lg">Nairobi, Kenya</h2>
            <p className="mb-2 text-body-lg text-graphite">
              Viewings and test drives by appointment.
            </p>
            <p className="mb-10 max-w-md text-body-lg text-steel">
              Message us on WhatsApp about any car in our stock, or send an
              enquiry from a listing — we&apos;ll set up a time that suits you.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={viewingLink("Hi Simcogy Motors, I'm interested in your inventory.")}
                external
                variant="graphite"
                size="lg"
              >
                WhatsApp us
              </ButtonLink>
              <ButtonLink href="/cars" variant="ghost-dark" size="lg">
                View cars
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
