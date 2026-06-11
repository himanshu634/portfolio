import type { Metadata, Viewport } from "next";
import { Fira_Code, Lora } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  weight: "500",
  subsets: ["latin"],
  fallback: ["monospace"],
});

const lora = Lora({
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Himanshu Mendapara",
  description:
    "Software Engineer. Often found experimenting with new tech. Currently exploring Rust.",
};

export const viewport: Viewport = {
  themeColor: "#050510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaCode.variable} ${lora.variable} antialiased space-static`}
      >
        {children}
      </body>
    </html>
  );
}
