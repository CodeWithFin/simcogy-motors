"use client";

import { useState } from "react";

type Props = {
  carId: string;
  carTitle: string;
};

export function EnquiryForm({ carId, carTitle }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${carTitle}. Please get in touch.`
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          channel: "form",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send enquiry");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-card border border-border rounded-4xl p-6 md:p-8">
        <h3 className="text-xl font-medium tracking-tight mb-2">
          Enquiry sent
        </h3>
        <p className="text-muted text-sm font-light">
          We&apos;ll get back to you shortly on {phone}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card border border-border rounded-4xl p-6 md:p-8 space-y-4"
    >
      <h3 className="text-xl font-medium tracking-tight mb-2">Send enquiry</h3>
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
        rows={4}
        className="field resize-none"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-full bg-accent text-background font-medium disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit enquiry"}
      </button>
      <style jsx>{`
        .field {
          width: 100%;
          background: #080805;
          border: 1px solid #2a2a2a;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 300;
          color: white;
          outline: none;
        }
        .field:focus {
          border-color: rgba(212, 212, 20, 0.5);
        }
      `}</style>
    </form>
  );
}
