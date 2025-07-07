import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { isValidElement } from "react";

// ProjectTitle component
function ProjectTitle({
  text,
  className,
  href,
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <div className={cn("flex items-center pt-2 group", className)}>
      <Sparkle className="inline mr-2 size-3" />
      <span className="text-lg md:text-xl font-semibold italic">{text}</span>
      {href && (
        <ExternalLink
          className="ml-2 size-4 duration-300 transition-all"
          aria-label="External link"
        />
      )}
    </div>
  );

  return href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline hover:underline-offset-4 hover:text-accent-blue"
    >
      {content}
    </Link>
  ) : (
    content
  );
}

const experiences = [
  {
    value: "1",
    title: "Software Engineer - I",
    company: "Genuin Inc.",
    duration: "July 2023 - Present",
    content: (
      <>
        <p className="mb-2">
          &nbsp;&nbsp;&nbsp;&nbsp;Led multiple projects from start to finish
          ensuring timely delivery with focus on performance and scalability.
        </p>
        <ProjectTitle
          href="https://begenuin.com/home"
          text="Genuin's Web-application"
        />
        <ProjectDetails
          className="pl-4 md:pl-6"
          description="Genuin's web-application is short form video based social media platform where users can watch short form videos as well as engage in communities."
          points={[
            "Refactored legacy project code to improve performance and maintainability, reducing load time by 50%.",
            {
              text: (
                <>
                  Since Genuin provides white-label solutions to its clients,
                  the platform required highly customizable theming
                  capabilities. I collaborated closely with the design and
                  product teams to implement pixel-perfect, client-specific
                  designs.
                </>
              ),
            },
            "Worked with hls.js to ensure smooth ans flawless video streaming on platform.",
            "Implemented lazy loading and code-splitting to further reduce TTI (Time to Interactive) and improve user experience on low-end devices.",
            "Used TanStack Query for optimized API fetching and caching, improving state handling across the application and developer experience.",
            "Integrated Google's IMA SDK to enable pre-roll and mid-roll video advertisements, supporting VAST-compliant ad formats and enhancing monetization capabilities within the platform.",
            {
              text: (
                <>
                  Delivered and deployed white-labeled versions for clients like{" "}
                  <Link
                    href="https://community.ogonuts.com/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue underline font-bold underline-offset-2"
                  >
                    Ogonuts
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://community.carlist.my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue underline font-bold underline-offset-2"
                  >
                    Carlist
                  </Link>
                  .
                </>
              ),
            },
          ]}
        />
        <ProjectTitle text="Genuin's Web-sdk" className="mt-6" />
        <ProjectDetails
          className="pl-4 md:pl-6"
          description="Genuin's web-sdk is used to integrate Genuin's various component into client's websites, enabling high engagement through short-form videos."
          points={[
            "Ensured all flows(positive/negative) worked correctly on client's websites without affecting performance on consumer websites. While maintaining scalability of the codebase.",
            "Implemented code-splitting and dynamic chunking using Rollup to reduce the SDK’s initial bundle size by 40%, significantly improving load performance on client websites without compromising functionality.",
            "Built automated testing (unit and integration) suites to ensure SDK's resilience and prevent regressions on client environments, reducing QA validation cycles from 3 to 2.",
            "Designed SDK to provide simple integration steps while hiding implementation complexity, enabling faster client onboarding.",
            {
              text: (
                <>
                  Examples:{" "}
                  <Link
                    className="text-accent-blue underline underline-offset-2 font-bold"
                    href="https://www.indiafoodnetwork.in/community"
                  >
                    India Food Network
                  </Link>
                  ,{" "}
                  <Link
                    className="text-accent-blue underline underline-offset-2 font-bold"
                    href="https://www.ogonuts.com/pages/community"
                  >
                    Ogonuts
                  </Link>
                  .
                </>
              ),
            },
          ]}
        />
        <ProjectTitle
          text="Genuin's Marketing Website"
          href="https://begenuin.com"
          className="mt-6"
        />
        <ProjectDetails
          className="pl-4 md:pl-6"
          points={[
            "Built Genuin’s marketing website using Next.js and Tailwind CSS with a headless Sanity CMS integration.",
            "Utilized Incremental Static Regeneration (ISR) and Static Site Generation (SSG) to reduce unnecessary API calls to the Sanity backend, effectively lowering backend usage and associated costs.",
            "Enabled the marketing team to manage and publish blogs for Genuin’s Resource Center by integrating a headless CMS, giving them full flexibility to update content without developer involvement.",
            "Developed dynamic blog templates and static pages to showcase company vision, updates, and key product features.",
          ]}
        />
      </>
    ),
  },
  {
    value: "2",
    title: "Software Engineering Intern",
    company: "Genuin Inc.",
    duration: "Feb 2023 - July 2023",
    content: (
      <>
        <p className="mb-4">
          &nbsp;&nbsp;&nbsp;&nbsp;Successfully transitioned from academic
          knowledge to practical software development by contributing to a
          production-grade web application, with a strong focus on code quality,
          debugging, and scalable design systems.
        </p>
        <ProjectDetails
          className="pl-4 md:pl-6"
          points={[
            "Worked closely with senior developers to debug and resolve issues across the web application, gaining hands-on experience with React, TypeScript, and component-driven architecture.",
            "Learned to identify performance bottlenecks and UI inconsistencies by analyzing user reports and browser dev tools, improving real - world debugging skills.",
            "Collaborated with cross-functional teams to understand product requirements and participated in agile development practices like sprint planning and daily stand-ups.",
          ]}
        />
      </>
    ),
  },
];

function ProjectDetails({
  description,
  points,
  className,
}: {
  description?: string;
  points: (string | { text: React.ReactNode; href?: string })[];
  className?: string;
}) {
  return (
    <div className={className}>
      {description && <p className="my-2">{description}</p>}
      {points.map((pt, i) => {
        if (typeof pt === "string") {
          return (
            <p className="my-1" key={i}>
              - {pt}
            </p>
          );
        }
        // If pt.text is a React element, render directly
        if (isValidElement(pt.text)) {
          return (
            <p className="my-1" key={i}>
              - {pt.text}
            </p>
          );
        }
        // Fallback to string with optional link
        return (
          <p className="my-1" key={i}>
            -{" "}
            {pt.href ? (
              <Link
                href={pt.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {pt.text}
              </Link>
            ) : (
              pt.text
            )}
          </p>
        );
      })}
    </div>
  );
}

export function WorkEx() {
  return (
    <div>
      <p className="text-4xl text-center font-semibold lg:text-5xl">
        Work Experience
      </p>
      <Accordion type="multiple" className="mt-10" defaultValue={["1"]}>
        {experiences.map((exp) => (
          <AccordionItem value={exp.value} key={exp.value}>
            <AccordionTrigger>
              <ExperienceTile
                title={exp.title}
                company={exp.company}
                duration={exp.duration}
              />
            </AccordionTrigger>
            <ExContent>{exp.content}</ExContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function ExperienceTile({
  title,
  company,
  duration,
}: {
  title: string;
  company: string;
  duration: string;
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
      <p className="text-sm text-accent-2">
        {company}&nbsp;({duration})
      </p>
    </div>
  );
}

function ExContent({ children }: { children: ReactNode }) {
  return (
    <AccordionContent className="py-4 px-4 md:px-8">
      {children}
    </AccordionContent>
  );
}
