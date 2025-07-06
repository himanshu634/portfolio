import { About } from "@/components/about";
import { Header } from "@/components/header";
import { WorkEx } from "@/components/work-ex";
import { Metadata } from "next";

export default function Home() {
  return (
    <main className="min-h-screen space-y-20 pb-20 h-full lg:max-w-[1024px] mx-auto px-4 md:px-8 overflow-auto transition-colors duration-300">
      <Header />
      <About />
      <WorkEx />
    </main>
  );
}

export function metadata(): Metadata {
  return {
    title: "Himanshu Mendapara - Portfolio",
    description:
      "Full Stack Developer passionate about creating amazing web experiences. Dumb enough to learn new things.",
    keywords: [
      "Himanshu Mendapara",
      "Portfolio",
      "Full Stack Developer",
      "Web Developer",
      "React",
      "Next.js",
      "Himanshu's github",
    ],
    authors: [{ name: "Himanshu Mendapara" }],
    openGraph: {
      title: "Himanshu Mendapara - Portfolio",
      description:
        "Full Stack Developer passionate about creating amazing web experiences",
      type: "website",
    },
  };
}
