import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeads } from "@/lib/cars";
import type { Lead } from "@/lib/types";

export default async function AdminLeadsPage() {
  let leads: Lead[] = [];
  try {
    leads = await getLeads();
  } catch {
    leads = [];
  }

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Leads</h1>
      <LeadsTable leads={leads} />
    </div>
  );
}
