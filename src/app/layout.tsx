import type { Metadata } from "next";
import { Archivo, Fira_Code } from "next/font/google";
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
      <body className={`${archivo.variable} ${firaCode.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
