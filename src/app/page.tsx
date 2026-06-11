import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Writing } from "@/components/writing";
import { WorkEx } from "@/components/work-ex";
import { OpenSourceContri } from "@/components/open-source-contri";
import { CanvasLoader } from "@/components/space/canvas-loader";
import { Hud } from "@/components/space/hud";
import { WaypointSection } from "@/components/space/waypoint-section";
import Link from "next/link";
import { Metadata } from "next";

function WaypointKicker({ index, label }: { index: number; label: string }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.3em] text-accent mb-6">
      WAYPOINT {String(index).padStart(2, "0")} — {label}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <CanvasLoader />
      <Header />
      <Hud />
      <main className="relative z-10 px-4">
        <WaypointSection id="intro">
          <About />
        </WaypointSection>

        <WaypointSection id="work" align="left">
          <WaypointKicker index={2} label="WORK" />
          <WorkEx />
        </WaypointSection>

        <WaypointSection id="oss" align="right">
          <WaypointKicker index={3} label="OPEN SOURCE" />
          <OpenSourceContri />
        </WaypointSection>

        <WaypointSection id="writing" align="left">
          <WaypointKicker index={4} label="WRITING" />
          <Writing />
        </WaypointSection>

        <WaypointSection id="contact">
          <WaypointKicker index={5} label="ARRIVAL" />
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="text-muted mb-6">
            End of the tour — but every voyage starts a new one. If you want
            to build something together, send a transmission.
          </p>
          <Link
            href="mailto:himanshumendapra@gmail.com"
            className="inline-block font-mono text-accent border border-accent/40 rounded-full px-6 py-2 hover:bg-accent/10 transition-colors"
          >
            himanshumendapra@gmail.com
          </Link>
          <Footer />
        </WaypointSection>
      </main>
    </>
  );
}

export const metadata: Metadata = {
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
