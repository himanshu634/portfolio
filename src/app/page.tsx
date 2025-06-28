import { Metadata } from "next";
import Header from "@/components/header";
import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
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
