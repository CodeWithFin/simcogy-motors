"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type AnalyticsProvider = "ga4" | "posthog" | "plausible" | "custom";

interface AnalyticsConfig {
  provider: AnalyticsProvider;
  ga4MeasurementId?: string;
  posthogKey?: string;
  posthogHost?: string;
  plausibleDomain?: string;
  customScript?: string;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("cookie_consent");
  if (!stored) return false;
  try {
    const data = JSON.parse(stored);
    return data.accepted === true;
  } catch {
    return false;
  }
}

export function Analytics({ config }: { config: AnalyticsConfig }) {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    setConsentGiven(hasConsent());
    const handleChange = () => setConsentGiven(hasConsent());
    window.addEventListener("cookie-consent-changed", handleChange);
    return () => window.removeEventListener("cookie-consent-changed", handleChange);
  }, []);

  if (!consentGiven) return null;

  switch (config.provider) {
    case "ga4": {
      if (!config.ga4MeasurementId) return null;
      return (
        <>
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.ga4MeasurementId}');
              `,
            }}
          />
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
        </>
      );
    }

    case "posthog": {
      if (!config.posthogKey) return null;
      const host = config.posthogHost || "https://app.posthog.com";
      return (
        <>
          <Script
            id="posthog-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2===o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var c=e;for(var u=a.length;u--;)c(c[a[u]]=c[a[u]]||{});e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                posthog.init('${config.posthogKey}', { api_host: '${host}', autocapture: true, persistence: 'localStorage' });
              `,
            }}
          />
        </>
      );
    }

    case "plausible": {
      if (!config.plausibleDomain) return null;
      return (
        <Script
          id="plausible"
          defer
          data-domain={config.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      );
    }

    case "custom": {
      if (!config.customScript) return null;
      return (
        <Script
          id="custom-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: config.customScript }}
        />
      );
    }

    default:
      return null;
  }
}

export function useAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(hasConsent());
    const handleChange = () => setConsent(hasConsent());
    window.addEventListener("cookie-consent-changed", handleChange);
    return () => window.removeEventListener("cookie-consent-changed", handleChange);
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (!consent) return;

    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", eventName, properties);
      }
      if (window.posthog) {
        window.posthog.capture(eventName, properties);
      }
      if (window.plausible) {
        window.plausible(eventName, { props: properties });
      }
    }
  };

  const trackPageView = (path: string) => {
    if (!consent) return;
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "page_view", { page_path: path });
      }
      if (window.posthog) {
        window.posthog.capture("$pageview", { $current_url: path });
      }
    }
  };

  return { trackEvent, trackPageView, hasConsent: consent };
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    posthog: {
      init: (key: string, config: Record<string, unknown>) => void;
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
    plausible: (event: string, options?: { props?: Record<string, unknown> }) => void;
    dataLayer: unknown[];
  }
}