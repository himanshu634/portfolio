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
          Seed-stage agritech in Ahmedabad. I lead engineering: I set the
          architecture, review and merge every pull request, and write much of
          the code myself, from the UI down to the database. In about nine
          weeks the team merged ~470 pull requests across the app, the API and
          the agents, covered by ~7,400 automated tests.
        </p>
        <Project name="Koshi">
          <li>
            Android-first app for agri-input retailers in Gujarat, the shops
            that sell farmers seed, fertiliser and crop protection. It helps a
            shop win the second and third sale of every crop season.
          </li>
          <li>
            Billing works fully offline on weak rural networks. Queued bills
            sync later with no duplicates and no gaps in invoice numbers.
          </li>
          <li>
            Crop calendars place each farmer on a crop stage, so the shop knows
            who needs what next. Reminders and posters go out on WhatsApp from
            the retailer&apos;s own phone.
          </li>
          <li>
            Gujarati first: 1,945 translated strings, and village data for all
            18,512 villages in the state.
          </li>
          <li>
            I built the Expo app, the Django and Postgres API, and the GCP
            infrastructure. First commit to v1.2.1 in seven weeks: 18
            releases, ~395 merged pull requests and ~5,400 tests.
          </li>
          <li>
            Model-checked the crop-calendar engine with TLA+. It found a
            database deadlock and three race conditions before launch.
          </li>
          <li>
            Deploys run through Cloud Build and roll back automatically when a
            health check fails.
          </li>
        </Project>
        <Project name="AI agent platform">
          <li>
            Four agents on one Pub/Sub and LangGraph runtime. A human approval
            step can send work back without paying again for the steps that
            already finished.
          </li>
          <li>
            Poster agent: Gujarati marketing posters on Gemini across 10
            templates. Every line is read back with OCR, so a wrong price or
            phone number can&apos;t ship.
          </li>
          <li>
            Product agent: two photos of a pack become a product listing and a
            clean packshot. Uses found on the web are kept only when the label
            confirms them.
          </li>
          <li>
            Logo agent: draws a shop logo from one photo, which the retailer
            approves or sends back for a redraw.
          </li>
          <li>
            The team built the first poster engine and the prototypes for label
            reading, voice notes and brand kits. I moved them onto the shared
            runtime and hardened them. ~2,000 tests run in CI on every pull
            request.
          </li>
        </Project>
        <Project name="Lead ingestion">
          <li>
            Farmers post castor and cotton sell offers in Telegram groups. An
            agent reads each one with Gemini and files it as a lead for the
            right procurement center in our CRM.
          </li>
          <li>
            A teammate built the first version. I moved it onto a Celery and
            Redis queue that recovers missed messages after a restart and never
            files the same lead twice.
          </li>
        </Project>
        <Project name="Koshi website">
          <li>
            Landing page in SvelteKit and GSAP, deployed to Firebase Hosting.
          </li>
          <li>
            A teammate built the sign-up form behind our Meta ads, which scores
            each lead out of 100 in a shared sheet.
          </li>
        </Project>
        <Project name="Supply-chain platform">
          <li>
            Connects farmers directly to commodity processors, and handles
            price discovery, logistics, quality checks and payment protection
            in between.
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
