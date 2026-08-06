"use client";

import { useState } from "react";

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
      <div className="bg-card text-card-foreground border border-border rounded-4xl p-6 md:p-8 shadow-sm dark:shadow-none">
        <h3 className="text-xl font-medium tracking-tight mb-2 text-success">
          Request received
        </h3>
        <p className="text-muted-foreground text-sm font-light">
          {copy[mode].success} We’ll contact you on {phone}.
        </p>
      </div>
    );
  }

  return (
    <div
      id="checkout"
      className="bg-card text-card-foreground border border-border rounded-4xl p-6 md:p-8 space-y-4 shadow-sm dark:shadow-none scroll-mt-8"
    >
      <div className="flex flex-wrap gap-2 mb-2">
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
            onClick={() => switchMode(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              mode === key
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted-foreground hover:border-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <h3 className="text-xl font-medium tracking-tight">{copy[mode].heading}</h3>
      {!available && mode === "reserve" && (
        <p className="text-sm text-destructive font-light">
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
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={status === "loading" || (!available && mode === "reserve")}
          className="w-full py-3 rounded-full bg-accent text-accent-foreground font-medium disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {status === "loading" ? "Sending…" : copy[mode].submit}
        </button>
      </form>

      <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground font-light">
        <p>
          <span className="text-foreground font-medium">7-day viewing comfort:</span>{" "}
          If the car&apos;s disclosed condition doesn&apos;t match at pickup, we
          make it right before you commit.
        </p>
        <p>
          <span className="text-foreground font-medium">Warranty:</span> Limited
          dealer cover on major mechanicals — details confirmed at reservation.
        </p>
      </div>
    </div>
  );
}
