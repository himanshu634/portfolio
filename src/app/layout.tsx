import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  weight: "500",
  subsets: ["latin"],
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "Himanshu Mendapara - Portfolio",
  description:
    "Full Stack Developer passionate about creating amazing web experiences. Dumb enough to learn new things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} font-fira-code antialiased dark`}>
        {children}
      </body>
    </html>
  );
}
