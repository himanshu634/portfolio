import Link from "next/link";
import { ReactNode } from "react";

const experiences = [
  {
    title: "Software Engineer — I",
    company: "Genuin Inc.",
    duration: "July 2023 – Present",
    content: (
      <>
        <p className="mb-4 text-foreground">
          Led multiple projects from start to finish ensuring timely delivery
          with focus on performance and scalability.
        </p>

        <div className="mb-5">
          <p className="font-medium mb-2">
            <Link
              href="https://begenuin.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              Genuin&apos;s Web-application
            </Link>
          </p>
          <ul className="space-y-1 text-sm text-foreground list-none pl-0">
            <li>— Short-form video social media platform.</li>
            <li>— Refactored legacy code, reducing load time by 50%.</li>
            <li>— Implemented pixel-perfect white-label theming for clients.</li>
            <li>— Integrated hls.js for smooth video streaming.</li>
            <li>— Lazy loading + code-splitting to improve TTI on low-end devices.</li>
            <li>— TanStack Query for optimized API fetching and caching.</li>
            <li>— Google IMA SDK for pre-roll and mid-roll VAST video ads.</li>
            <li>
              — Deployed for{" "}
              <Link
                href="https://community.ogonuts.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-70"
              >
                Ogonuts
              </Link>{" "}
              and{" "}
              <Link
                href="https://community.carlist.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-70"
              >
                Carlist
              </Link>
              .
            </li>
          </ul>
        </div>

        <div className="mb-5">
          <p className="font-medium mb-2">Genuin&apos;s Web-SDK</p>
          <ul className="space-y-1 text-sm text-foreground list-none pl-0">
            <li>— Embeds Genuin components into client websites via short-form video.</li>
            <li>— Code-splitting with Rollup reduced initial bundle size by 40%.</li>
            <li>— Automated unit and integration suites reduced QA cycles from 3 to 2.</li>
            <li>— Simple integration API hiding implementation complexity.</li>
            <li>
              — Live at{" "}
              <Link
                href="https://www.indiafoodnetwork.in/community"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-70"
              >
                India Food Network
              </Link>{" "}
              and{" "}
              <Link
                href="https://www.ogonuts.com/pages/community"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-70"
              >
                Ogonuts
              </Link>
              .
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-2">
            <Link
              href="https://begenuin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              Genuin&apos;s Marketing Website
            </Link>
          </p>
          <ul className="space-y-1 text-sm text-foreground list-none pl-0">
            <li>— Built with Next.js + Tailwind + headless Sanity CMS.</li>
            <li>— ISR and SSG to reduce unnecessary API calls and backend costs.</li>
            <li>— CMS-driven blog for marketing team, no developer involvement needed.</li>
            <li>— Dynamic blog templates and static product feature pages.</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    title: "Software Engineering Intern",
    company: "Genuin Inc.",
    duration: "Feb 2023 – July 2023",
    content: (
      <>
        <p className="mb-3 text-foreground">
          Transitioned from academic knowledge to production-grade development
          with focus on code quality, debugging, and scalable design systems.
        </p>
        <ul className="space-y-1 text-sm text-foreground list-none pl-0">
          <li>— Debugged and resolved issues across the web app using React and TypeScript.</li>
          <li>— Identified performance bottlenecks via browser dev tools.</li>
          <li>— Participated in agile sprint planning and daily stand-ups.</li>
        </ul>
      </>
    ),
  },
];

export function WorkEx() {
  return (
    <section className="pb-12">
      <h2 className="text-2xl font-semibold mb-8">Work Experience</h2>
      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <ExperienceItem key={i} {...exp} />
        ))}
      </div>
    </section>
  );
}

function ExperienceItem({
  title,
  company,
  duration,
  content,
}: {
  title: string;
  company: string;
  duration: string;
  content: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted">
          {company} · {duration}
        </p>
      </div>
      <div>{content}</div>
    </div>
  );
}
