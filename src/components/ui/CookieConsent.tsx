"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CONSENT_KEY = "cookie_consent";
const CONSENT_VERSION = "1";

type ConsentData = {
  version: string;
  accepted: boolean;
  timestamp: number;
};

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      try {
        const data: ConsentData = JSON.parse(stored);
        if (data.version === CONSENT_VERSION && data.accepted) {
          setShow(false);
          return;
        }
      } catch {
        // Invalid data, show banner
      }
    }
    setShow(true);
  }, []);

  function accept() {
    const data: ConsentData = {
      version: CONSENT_VERSION,
      accepted: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    setShow(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: { accepted: true } }));
  }

  function decline() {
    const data: ConsentData = {
      version: CONSENT_VERSION,
      accepted: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    setShow(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: { accepted: false } }));
  }

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="page-container py-4 md:py-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-body text-steel">
              We use cookies to improve your experience, analyze site traffic, and
              personalize content. By clicking &ldquo;Accept&rdquo;, you consent to our use of
              cookies.{" "}
              <a href="/privacy" className="underline hover:no-underline text-graphite">
                Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            <button
              onClick={decline}
              className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-chalk transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 rounded-full bg-graphite text-paper text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}