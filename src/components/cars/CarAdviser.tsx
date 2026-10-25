"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

type Props = {
  carId: string;
  carTitle: string;
};

export function CarAdviser({ carId, carTitle }: Props) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSend() {
    if (!message.trim() || status === "loading") return;
    setStatus("loading");
    setReply(null);
    try {
      const res = await fetch(`/api/cars/${carId}/adviser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      setReply(data.reply);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
    } finally {
      setMessage("");
    }
  }

  return (
    <section
      id="adviser"
      className="section scroll-mt-20 border-t border-concrete bg-paper"
    >
      <div className="page-container">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-2 text-heading-lg md:text-heading-xl">
                Car adviser
              </h2>
              <p className="max-w-md text-body-lg text-steel">
                Ask anything about this vehicle. The adviser is run by the
                dealership, not a chatbot on the page.
              </p>
            </div>
            <a
              href="#pricing"
              className={buttonClass("solar", "md")}
            >
              Check pricing
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div
              id="adviser-panel"
              className="rounded-card border border-concrete bg-chalk lg:col-span-3"
            >
              <div className="space-y-4 p-6">
                <h3 className="text-subheading">Ask about this car</h3>
                <p className="text-sm text-steel">
                  {carTitle} · {message ? "Send a question to the dealership." : "The adviser will answer in plain English."}
                </p>

                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSend();
                  }}
                >
                  <label className="flex flex-col gap-2">
                    <span className="eyebrow">Question</span>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      placeholder="e.g. Is the paint condition ok? Does it come with service history?"
                      className="field resize-none"
                      disabled={status === "loading"}
                    />
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={buttonClass("solar", "md", "w-full")}
                    >
                      {status === "loading" ? "Waiting..." : "Ask"}
                    </button>
                  </div>
                </form>

                {status === "error" && (
                  <p className="text-sm text-destructive">
                    {reply || "The adviser is not available right now. Please try again."}
                  </p>
                )}

                {status === "ok" && reply && (
                  <div className="space-y-3">
                    <p aria-live="polite" className="text-body text-graphite">
                      {reply}
                    </p>
                    <p className="text-xs text-steel">
                      Answered by Simcogy Motors. For a booking or a viewing,
                      use Reserve or Book a viewing in the card.
                    </p>
                  </div>
                )}

                {status === "idle" && (
                  <p className="text-xs text-steel">
                    Responses are demo-style: short, plain English, and no
                    invented prices, phones, or documents.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-card border border-concrete bg-chalk p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-graphite" />
                  <div>
                    <p className="text-subheading">Reserve this car</p>
                    <p className="text-sm text-steel">
                      Showroom in Nairobi, usually ready within 48 hours.
                      Direct from Simcogy Motors — no third parties.
                    </p>
                  </div>
                </div>

                <a
                  href={`/cars/${carId}/#checkout`}
                  className={buttonClass("graphite", "lg", "mt-6 w-full")}
                >
                  Reserve vehicle
                </a>

                <a
                  href={`/cars/${carId}/#checkout`}
                  className={`${buttonClass("light", "lg")} mt-3 w-full`}
                >
                  Book test drive
                </a>

                <div className="mt-6 space-y-3 text-sm text-steel">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    Inspected in-house
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    Clear pricing
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-graphite" />
                    48-hour hold
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
