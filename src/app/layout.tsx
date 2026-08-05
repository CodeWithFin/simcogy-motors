import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: {
    default: "Simcogy Motors",
    template: "%s | Simcogy Motors",
  },
  description:
    "Verified used cars in Kenya. Inspected stock, transparent pricing, and easy test drive booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${figtree.variable} font-sans`}>{children}</body>
    </html>
  );
}
