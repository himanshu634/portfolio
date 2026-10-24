import type { Metadata } from "next";
import { Archivo, Fira_Code, Noto_Sans_Gujarati } from "next/font/google";
import "./globals.css";

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
  title: "Himanshu Mendapara",
  description:
    "Tech lead at Bull Agritech in Ahmedabad. I build AI for money and markets.",
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
      </body>
    </html>
  );
}
