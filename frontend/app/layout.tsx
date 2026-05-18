import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-uspot-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "USpot",
  description: "Explora contextos y spots con onboarding contextual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
