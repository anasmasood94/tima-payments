import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/language-context";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "B612 Tima Inc. — Warehouse Services",
    template: "%s · B612 Tima Inc.",
  },
  description: "Warehouse services, orders, invoices, and provider-hosted payments by B612 Tima Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-sans min-h-screen bg-white text-body antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
