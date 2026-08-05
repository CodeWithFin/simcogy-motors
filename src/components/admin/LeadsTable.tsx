"use client";

import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/types";

const statuses = [
  "new",
  "contacted",
  "test_drive_booked",
  "negotiating",
  "won",
  "lost",
];

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  if (leads.length === 0) {
    return <p className="text-muted font-light">No leads yet.</p>;
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-card border border-border rounded-2xl p-4 md:p-5"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <p className="font-medium">
                {lead.name}{" "}
                <span className="text-muted font-light text-sm">
                  · {lead.phone}
                </span>
              </p>
              <p className="text-sm text-muted font-light mt-1">
                {[lead.car_year, lead.car_make, lead.car_model]
                  .filter(Boolean)
                  .join(" ")}{" "}
                · {lead.channel}
              </p>
              {lead.message && (
                <p className="text-sm font-light mt-3 text-white/80">
                  {lead.message}
                </p>
              )}
              <p className="text-xs text-muted mt-2">
                {new Date(lead.created_at).toLocaleString("en-KE")}
              </p>
            </div>
            <select
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
