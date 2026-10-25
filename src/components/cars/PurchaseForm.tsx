"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

type Mode = "reserve" | "test_drive" | "enquiry";

type Props = {
  carId: string;
  carTitle: string;
  defaultMode?: Mode;
  available?: boolean;
};

const copy: Record<
  Mode,
  { heading: string; submit: string; success: string; channel: string; message: string }
> = {
  reserve: {
    heading: "Reserve this vehicle",
    submit: "Start reservation",
    success: "Reservation request received. We’ll confirm your hold shortly.",
    channel: "form",
    message: "I’d like to reserve this vehicle and start the purchase process.",
  },
  test_drive: {
    heading: "Book a test drive",
    submit: "Request test drive",
    success: "Test drive request received. We’ll confirm a slot shortly.",
    channel: "test_drive",
    message: "I’d like to book a test drive for this vehicle.",
  },
  enquiry: {
    heading: "Ask a question",
    submit: "Send message",
    success: "Message sent. We’ll get back to you shortly.",
    channel: "form",
    message: "I have a question about this vehicle.",
  },
};

export function PurchaseForm({
  carId,
  carTitle,
  defaultMode = "reserve",
  available = true,
}: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `${copy[defaultMode].message} (${carTitle})`
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(`${copy[next].message} (${carTitle})`);
    setStatus("idle");
    setError("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!available && mode === "reserve") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          name,
          phone,
          email: email || undefined,
          message,
          channel: copy[mode].channel,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div id="checkout" className="scroll-mt-24 rounded-card bg-graphite p-8 text-paper">
        <h3 className="mb-2 text-subheading">Request received</h3>
        <p className="text-body text-paper/80">
          {copy[mode].success} We’ll contact you on {phone}.
        </p>
      </div>
    );
  }

  return (
    <div
      id="checkout"
      className="scroll-mt-24 space-y-5 rounded-card border border-concrete bg-paper p-8"
    >
      <div className="flex gap-1 rounded-full bg-chalk p-1" role="tablist">
        {(
          [
            ["reserve", "Reserve"],
            ["test_drive", "Test drive"],
            ["enquiry", "Ask"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => switchMode(key)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
              mode === key ? "bg-paper text-graphite" : "text-steel hover:text-graphite"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <h3 className="text-subheading">{copy[mode].heading}</h3>
      {!available && mode === "reserve" && (
        <p className="text-body text-destructive">
          This vehicle is not available to reserve right now.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="field"
        />
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="Phone / WhatsApp"
          className="field"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className="field"
        />
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="field resize-none"
        />
        {error && <p className="text-body text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={status === "loading" || (!available && mode === "reserve")}
          className={buttonClass("graphite", "md", "w-full")}
        >
          {status === "loading" ? "Sending…" : copy[mode].submit}
        </button>
      </form>

      <div className="space-y-2 border-t border-concrete pt-5 text-xs text-steel">
        <p>
          <span className="font-semibold text-graphite">7-day viewing comfort:</span>{" "}
          If the car&apos;s disclosed condition doesn&apos;t match at pickup, we
          make it right before you commit.
        </p>
        <p>
          <span className="font-semibold text-graphite">Warranty:</span> Limited
          dealer cover on major mechanicals — details confirmed at reservation.
        </p>
      </div>
    </div>
  );
}
