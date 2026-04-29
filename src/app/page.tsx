import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Writing } from "@/components/writing";
import { Metadata } from "next";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[680px] mx-auto px-4 pb-20">
        <About />
        <Writing />
        <Footer />
      </main>
    </>
  );
}

export function metadata(): Metadata {
  return {
    title: "Himanshu Mendapara",
    description:
      "Software Engineer. Often found experimenting with new tech. Currently exploring Rust.",
    keywords: [
      "Himanshu Mendapara",
      "Portfolio",
      "Full Stack Developer",
      "Web Developer",
      "React",
      "Next.js",
    ],
    authors: [{ name: "Himanshu Mendapara" }],
    openGraph: {
      title: "Himanshu Mendapara",
      description: "Software Engineer. Currently exploring Rust.",
      type: "website",
    },
  };
}
