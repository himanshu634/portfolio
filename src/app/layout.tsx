import type { Metadata } from "next";
import { Archivo, Fira_Code, Noto_Sans_Gujarati } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-archivo",
  axes: ["wdth"],
  subsets: ["latin"],
  fallback: ["Arial Narrow", "sans-serif"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  weight: "500",
  subsets: ["latin"],
  fallback: ["monospace"],
});

// Archivo and Fira Code have no Gujarati. Listed after them, this one only
// draws Gujarati glyphs, and its unicode-range keeps it off pages without any.
const notoGujarati = Noto_Sans_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
  preload: false,
});

export const metadata: Metadata = {
  // Share images and canonical paths are written relative; this makes them absolute.
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "Product engineer at Bull Agritech, India, curious about AI and how to implement it well.",
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${firaCode.variable} ${notoGujarati.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
