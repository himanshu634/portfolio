import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { About } from "./about";
import { WorkEx } from "./work-ex";
import { OpenSourceContri } from "./open-source-contri";
import { Writing } from "./writing";
import { SKILLS, IDENTITY } from "@/lib/content";

/**
 * The Mission Log: the entire portfolio as a clean semantic document.
 * Always server-rendered — crawlers, no-JS visitors and anyone who toggles
 * it ("for travelers who get space-sick") read everything here. In flight
 * mode it's hidden via body[data-mode="flight"] CSS.
 */
export function MissionLog() {
  return (
    <div id="mission-log">
      <Header />
      <main className="relative z-10 mx-auto max-w-[680px] px-4 pb-8">
        <section aria-label="Introduction" className="pt-14 pb-4">
          <About />
        </section>

        <section aria-label="Skills" className="pb-12">
          <h2 className="text-2xl font-semibold mb-5">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <li
                key={s.name}
                title={s.detail}
                className="rounded-full border border-border px-3 py-1 text-sm font-mono text-foreground"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </section>

        <WorkEx />
        <OpenSourceContri />
        <Writing />

        <section aria-label="Contact" className="pb-4">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="text-muted mb-6">
            End of the tour — but every voyage starts a new one. If you want to
            build something together, send a transmission.
          </p>
          <Link
            href={`mailto:${IDENTITY.email}`}
            className="inline-block font-mono text-accent border border-accent/40 rounded-full px-6 py-2 hover:bg-accent/10 transition-colors"
          >
            {IDENTITY.email}
          </Link>
          <Footer />
        </section>
      </main>
    </div>
  );
}
