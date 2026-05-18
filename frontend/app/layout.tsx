import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-uspot-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "USpot",
  description: "Explora espacios y spots con onboarding contextual.",
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
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
