import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

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
      </body>
    </html>
  );
}
