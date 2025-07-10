import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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

const contributions = [
  {
    value: "1",
    title: "Wren-ai",
    organization: "Canner.io",
    href: "https://github.com/Canner/WrenAI",
    content: (
      <>
        <p className="mb-2">
          &nbsp;&nbsp;&nbsp;&nbsp;An open-source AI-powered data analysis
          platform that enables natural language queries on databases.
        </p>
        <div className="pl-4 md:pl-6">
          <p className="my-1">
            - Developed the Trino connector for Wren-AI’s engine, enabling users
            to query both SQL and NoSQL databases through a unified interface. (
            <Link
              href="https://github.com/Canner/WrenAI/issues/535"
              className="text-accent-blue hover:underline"
            >
              Trino-integration. #535
            </Link>
            )
          </p>
          <div className="my-4">
            <p className="my-1">
              - As a result of the Trino connector development, I was featured
              on the Trino Community Broadcast. Watch the video below:
            </p>
            <div className="relative pb-[56.25%] h-0 mt-3 overflow-hidden rounded-2xl mx-auto">
              <iframe
                src="https://www.youtube-nocookie.com/embed/pUh7DIaznPg?si=XuR9mOueKEym7GFW&amp;start=574"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
              ></iframe>
            </div>
          </div>
          <p>
            - Improved the UI and fixed bugs in the Wren-AI. (
            <Link
              href="https://github.com/Canner/WrenAI/issues/746"
              className="text-accent-blue hover:underline"
            >
              #746
            </Link>
            ,{" "}
            <Link
              href="https://github.com/Canner/WrenAI/issues/491"
              className="text-accent-blue hover:underline"
            >
              #491
            </Link>
            )
          </p>
        </div>
      </>
    ),
  },
] as const;

export function OpenSourceContri() {
  return (
    <div>
      <p className="text-4xl text-center font-semibold lg:text-5xl mb-10">
        Open Source Contributions
      </p>
      <div className="space-y-8 text-md">
        {contributions.map((contri) => (
          <ContributionCard key={contri.value} {...contri} />
        ))}
      </div>
    </div>
  );
}

function ContributionCard({
  title,
  organization,
  content,
  href,
}: {
  title: string;
  organization: string;
  content: ReactNode;
  href?: string;
}) {
  return (
    <div className="border-dashed border rounded-lg p-4 md:p-6 shadow-sm bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
        <ProjectTitle text={title} href={href} className="pt-0" />
        <span className="text-sm text-accent-2 sm:inline">
          ({organization})
        </span>
      </div>
      <div className="">{content}</div>
    </div>
  );
}
