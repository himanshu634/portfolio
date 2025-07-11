import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OpenSourceContri } from "@/components/open-source-contri";
import { WorkEx } from "@/components/work-ex";
import { Metadata } from "next";
import SplashCursor from "@/components/ui/splash-cursor";

export default function Home() {
  return (
    <main className="min-h-screen space-y-20 pb-20 h-full lg:max-w-[1024px] mx-auto px-4 md:px-8 overflow-auto transition-colors duration-300">
      <Header />
      <About />
      <WorkEx />
      <OpenSourceContri />
      <Footer />
      <SplashCursor
        BACK_COLOR={{ r: 0.5, g: 0, b: 0 }}
        COLOR_UPDATE_SPEED={1}
        TRANSPARENT
      />
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
