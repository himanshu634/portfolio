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

function Project({ name, children }: { name: ReactNode; children: ReactNode }) {
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
    // TODO: start date unknown.
    duration: "Now",
    now: true,
    content: (
      <>
        <p>
          Seed-stage agritech in Ahmedabad. Small team, so I work across the
          whole product, from the UI down to the database.
        </p>
        <Project name="Supply-chain platform">
          <li>
            Connects farmers directly to commodity processors, and handles
            price discovery, logistics, quality checks and payment protection
            in between.
          </li>
        </Project>
        <Project name="Agent-run CRM">
          <li>
            Our internal CRM, where several agents, each with its own job,
            manage the lead pipeline.
          </li>
        </Project>
        <Project name="Koshi">
          <li>
            Next up: an AI app for agro retailers, the shops that sell farmers
            seeds, fertiliser and crop protection.
          </li>
        </Project>
      </>
    ),
  },
  {
    title: "Software Engineer I",
    company: "Genuin Inc.",
    // TODO: end date unknown.
    duration: "Joined July 2023",
    content: (
      <>
        <p>
          Led multiple projects from start to finish, with a focus on
          performance and scalability.
        </p>
        <Project name={<Ext href="https://begenuin.com/home">Genuin&apos;s web app</Ext>}>
          <li>Short-form video social media platform.</li>
          <li>Refactored legacy code, reducing load time by 50%.</li>
          <li>Implemented pixel-perfect white-label theming for clients.</li>
          <li>Integrated hls.js for smooth video streaming.</li>
          <li>Lazy loading and code-splitting to improve TTI on low-end devices.</li>
          <li>TanStack Query for optimized API fetching and caching.</li>
          <li>Google IMA SDK for pre-roll and mid-roll VAST video ads.</li>
          <li>
            Deployed for <Ext href="https://community.ogonuts.com/home">Ogonuts</Ext> and{" "}
            <Ext href="https://community.carlist.my/">Carlist</Ext>.
          </li>
        </Project>
        <Project name="Genuin's web SDK">
          <li>Embeds Genuin components into client websites via short-form video.</li>
          <li>Code-splitting with Rollup reduced initial bundle size by 40%.</li>
          <li>Automated unit and integration suites reduced QA cycles from 3 to 2.</li>
          <li>Simple integration API hiding implementation complexity.</li>
          <li>
            Live at <Ext href="https://www.indiafoodnetwork.in/community">India Food Network</Ext> and{" "}
            <Ext href="https://www.ogonuts.com/pages/community">Ogonuts</Ext>.
          </li>
        </Project>
        <Project name={<Ext href="https://begenuin.com">Genuin&apos;s marketing website</Ext>}>
          <li>Built with Next.js, Tailwind and headless Sanity CMS.</li>
          <li>ISR and SSG to reduce unnecessary API calls and backend costs.</li>
          <li>CMS-driven blog for the marketing team, no developer involvement needed.</li>
          <li>Dynamic blog templates and static product feature pages.</li>
        </Project>
      </>
    ),
  },
  {
    title: "Software Engineering Intern",
    company: "Genuin Inc.",
    duration: "Feb 2023 – July 2023",
    content: (
      <>
        <p>
          Moved from academic knowledge to production-grade development, with a
          focus on code quality, debugging and scalable design systems.
        </p>
        <ul className="mt-4 list-[square] space-y-1 pl-5">
          <li>Debugged and resolved issues across the web app using React and TypeScript.</li>
          <li>Identified performance bottlenecks with browser dev tools.</li>
          <li>Took part in agile sprint planning and daily stand-ups.</li>
        </ul>
      </>
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
