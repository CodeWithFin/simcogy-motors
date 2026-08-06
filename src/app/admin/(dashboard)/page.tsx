import Link from "next/link";
import { getAllCarsAdmin, getLeads } from "@/lib/cars";
import type { Car, Lead } from "@/lib/types";

export default async function AdminHomePage() {
  let cars: Car[] = [];
  let leads: Lead[] = [];
  try {
    [cars, leads] = await Promise.all([getAllCarsAdmin(), getLeads()]);
  } catch {
    // ignore
  }

  const published = cars.filter((c) => c.status === "published").length;
  const featured = cars.filter((c) => c.featured).length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8">
        Overview
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Stat label="Total cars" value={cars.length} />
        <Stat label="Published" value={published} />
        <Stat label="Featured" value={featured} accent />
        <Stat label="New leads" value={newLeads} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/cars/new"
          className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium"
        >
          Add car
        </Link>
        <Link
          href="/admin/featured"
          className="px-6 py-3 rounded-full border border-border font-light"
        >
          Manage featured
        </Link>
        <Link
          href="/admin/leads"
          className="px-6 py-3 rounded-full border border-border font-light"
        >
          View leads
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs text-muted-foreground font-light mb-2">{label}</p>
      <p
        className={`text-3xl font-light tracking-tighter ${
          accent ? "text-accent" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
