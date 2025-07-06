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
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </Link>
  ) : (
    content
  );
}

export function WorkEx() {
  return (
    <div className="h-screen">
      <p className="text-4xl text-center font-semibold lg:text-5xl">
        Work Experience
      </p>
      <Accordion type="multiple" className="mt-10">
        <AccordionItem value="2">
          <AccordionTrigger>
            <ExperienceTile
              title="Software Engineer - I"
              company="Genuin Inc."
              duration="August 2023 - Present"
            />
          </AccordionTrigger>
          <ExContent>
            <p className="mb-2">
              &nbsp;&nbsp;&nbsp;&nbsp;Lead multiple projects from start to
              finish ensuring timely delivery with focus on performance and
              scalability.
            </p>
            <ProjectTitle
              href="https://begenuin.com/home"
              text="Genuin's Web-application"
            />
            <div className="pl-4 md:pl-6">
              <p className="my-2">
                Genuin&apos;s web-application is short form video based social
                media platform where user come on the platform and watch short
                form videos as well as engage with each other in communities.
              </p>
              <p className="my-1">
                - Refactored code of legacy project to improve performance and
                maintainability. Overall, improving the performance and reducing
                load time by 50%.
              </p>
              <p className="my-1">
                - As Genuin provides white-label solutions to it&apos;s clients,
                platform needs hightly customizable theme support. So worked
                closely with design team to ensure implementation of pixel
                perfect designs into platform.
              </p>
              <p className="my-1">
                - Worked with hls.js to ensure smooth streaming of the videos on
                platform.
              </p>
            </div>
            <ProjectTitle text="Genuin's Web-sdk" className="mt-6" />
            <div>
              <p className="my-2">
                Genuin&apos;s web-sdk is used to integrate Genuin&apos;s various
                component into client&apos;s web-site through which customers
                engage with short-form videos.
              </p>
            </div>
          </ExContent>
        </AccordionItem>
        <AccordionItem value="1">
          <AccordionTrigger>
            <ExperienceTile
              title="Software Engineering Intern"
              company="Genuin Inc."
              duration="Jan 2023 - August 2023"
            />
          </AccordionTrigger>
          <ExContent>
            <p>
              - Learnt about the basics of Web development and software
              engineering.
            </p>
            <p>
              - Worked on building a web application using React and Node.js.
            </p>
          </ExContent>
        </AccordionItem>
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
