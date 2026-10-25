import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { Analytics } from "@/components/ui/Analytics";

// Substitutes for Rivian's Adventure (UI text) and Liga (monograms).
const adventure = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-adventure",
});

const liga = Inter_Tight({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-liga",
});

export const metadata: Metadata = {
  title: {
    default: "Simcogy Motors",
    template: "%s | Simcogy Motors",
  },
  description:
    "Simcogy Motors sells its own verified used cars in Kenya. Inspected stock, transparent pricing, and easy test drive booking — not a marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${adventure.variable} ${liga.variable}`}>
        {children}
        <CookieConsent />
        <Analytics
          config={{
            provider: "ga4",
            ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
          }}
        />
      </body>
    </html>
  );
}
