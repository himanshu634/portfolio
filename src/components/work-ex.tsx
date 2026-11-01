import Link from "next/link";
import { ReactNode } from "react";

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-2 underline-offset-[3px] hover:bg-now"
    >
      {children}
    </a>
  );
}

export function Project({ name, children }: { name: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h4 className="mb-2 text-lg font-bold">{name}</h4>
      <ul className="list-[square] space-y-1 pl-5">{children}</ul>
    </div>
  );
}

const experiences: {
  title: string;
  company: string;
  duration: string;
  now?: boolean;
  content: ReactNode;
}[] = [
  {
    title: "Tech Lead",
    company: "Bull Agritech",
    duration: "May 2026 – Now",
    now: true,
    content: (
      <>
        <p>
          Agri-commodity and agri-input company in India. I lead engineering
          for the procurement CRM, the AI agents and Koshi, and own each from
          the first requirement to the release.
        </p>
        <Project name="Procurement CRM">
          <li>
            Farm-to-factory procurement ran on WhatsApp and Telegram groups.
            Back-office staff pulled farmers&apos; documents out of chats by
            hand, and an order took about a day to process.
          </li>
          <li>
            I studied the process on the ground with the field team, then
            designed, built and deployed the CRM, and rolled it out to the
            field myself. Each of its six roles sees and moves only its own
            leads, in Gujarati, Hindi or English.
          </li>
          <li>Back-office order processing went from six people to one.</li>
        </Project>
        <Project
          name={
            <Link
              href="/projects/koshi"
              className="underline decoration-2 underline-offset-[3px] hover:bg-now"
            >
              Koshi
            </Link>
          }
        >
          <li>
            An app for agro retailers, the village shops that sell farmers
            seeds, fertiliser and crop protection. Many owners have limited
            literacy, so it keeps complex things, like a crop cycle, simple.
          </li>
          <li>
            Farmers, billing that works offline, a crop calendar, WhatsApp
            broadcasts and AI posters. Every poster is checked by OCR before a
            person approves it.
          </li>
          <li>
            Sole engineer on the app, its backend and its admin console.
            Shipped to the Play internal track and TestFlight.
          </li>
        </Project>
        <Project name="AI agents">
          <li>
            Three production agents, built with LangGraph: a retailer&apos;s
            voice note becomes a Gujarati poster, two pack photos become a
            catalogue entry, and a signboard photo becomes the shop&apos;s
            logo. A person approves or edits every result.
          </li>
          <li>
            Image models garble Gujarati, so every poster is read back with OCR
            and any wrong line is redrawn before a person sees it.{" "}
            <Link
              href="/blog/gujarati-image-harness"
              className="underline decoration-2 underline-offset-[3px] hover:bg-now"
            >
              How the harness works
            </Link>
            .
          </li>
          <li>
            I built evaluations around the product-onboarding agent, and its
            extraction accuracy rose from about 42% to about 80% on an 86-pack
            evaluation set.
          </li>
        </Project>
        <Project name="CRM agents">
          <li>
            LangGraph agents inside the CRM: one cleans duplicate and malformed
            records, one flags stalled and at-risk leads so sales can step in
            early, and one flags unusual field activity for operations
            managers.
          </li>
        </Project>
      </>
    ),
  },
  {
    title: "Software Engineer II",
    company: "Genuin Inc.",
    duration: "Jan 2026 – May 2026",
    content: (
      <>
        <p>
          Owned the Web SDK, which embeds Genuin&apos;s short-form video in
          client websites, and four client accounts that ran it.
        </p>
        <ul className="mt-4 list-[square] space-y-1 pl-5">
          <li>
            Cut the SDK&apos;s initial bundle from about 800 KB to about 40 KB
            with dynamic loading and code-splitting.
          </li>
          <li>Moved the player to Video.js: playback starts in 1 s instead of about 4 s.</li>
          <li>
            About 60% fewer bugs, from guardrails and automated tests aimed at
            client environments.
          </li>
          <li>
            Live at <Ext href="https://www.indiafoodnetwork.in/community">India Food Network</Ext> and{" "}
            <Ext href="https://www.ogonuts.com/pages/community">Ogonuts</Ext>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Software Engineer I",
    company: "Genuin Inc.",
    duration: "Aug 2023 – Jan 2026",
    content: (
      <>
        <p>
          Maintained <Ext href="https://begenuin.com/home">Genuin&apos;s web app</Ext>, a
          short-form video platform with communities.
        </p>
        <ul className="mt-4 list-[square] space-y-1 pl-5">
          <li>
            Laid the foundation of the Web SDK: video embedded in client sites
            without iframes.
          </li>
          <li>
            Built the monorepo and the shared component library behind the web
            app and the SDK, and the hls.js video player.
          </li>
          <li>
            White-label themes for clients including TED and Y Combinator;
            deployed for <Ext href="https://community.ogonuts.com/home">Ogonuts</Ext> and{" "}
            <Ext href="https://community.carlist.my/">Carlist</Ext>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Software Engineering Intern",
    company: "Genuin Inc.",
    duration: "Aug 2022 – Aug 2023",
    content: (
      <p>
        Rewrote the web app in TypeScript with modern React and Next.js
        patterns, and built the component library its UI runs on.
      </p>
    ),
  },
];

export function WorkEx() {
  return (
    <section>
      {experiences.map((exp) => (
        <ExperienceItem key={exp.title + exp.company} {...exp} />
      ))}
    </section>
  );
}

/** One role: company and dates in the left column, the detail in a readable column beside it. */
export function ExperienceItem({
  title,
  company,
  duration,
  now,
  content,
}: {
  title: string;
  company: string;
  duration: string;
  now?: boolean;
  content: ReactNode;
}) {
  return (
    <article className="grid gap-x-10 gap-y-3 border-b-2 border-border py-8 md:grid-cols-[260px_minmax(0,680px)]">
      <div className="text-[15px] font-semibold">
        <p>{company}</p>
        <p>{now ? <span className="bg-now px-1.5 font-bold">{duration}</span> : duration}</p>
      </div>
      <div className="text-lg leading-relaxed">
        <h3 className="mb-3 text-[28px] leading-tight font-extrabold">{title}</h3>
        {content}
      </div>
    </article>
  );
}
