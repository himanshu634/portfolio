const techStack = [
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Next.js",
  "Tanstack Query",
  "Zustand",
  "Sanity",
  "GSAP",
  "motion",
  "Storybook",
  "RTL",
  "Playwright",
  "WebRTC",
  // "tRPC",
  // "Prisma",
  "Node.js",
  "Bun",
  "pnpm",
  "PostgreSQL",
];

export function About() {
  return (
    <div className="h-screen text-center flex flex-col items-center justify-center w-full ">
      <p className="text-4xl font-semibold lg:text-5xl">
        Hey, Himanshu Mendapara here.
      </p>
      <p className="text-base sm:text-lg md:text-xl mt-1 italic">
        Full Stack Developer. Vibe Coder. OSS Contributor.
      </p>
      <p className="text-sm sm:text-base md:text-lg max-w-xl mt-4">
        Dumb enough to learn new things. <br />
        Always up for a rewrite.
        <br /> I build, break, and fix things. Mostly in that order.
      </p>
      <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full text-background bg-accent-2 hover:bg-foreground text-sm transition-all hover:-translate-y-0.5 cursor-pointer hover:-translate-x-0.5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
