import SplitText from "./ui/split-text";

const techStack = [
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Next.js",
  "Tanstack Query",
  "ShadCN",
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
      <SplitText
        className="text-3xl font-semibold lg:text-5xl break-words"
        text="Hey, Himanshu here."
        delay={10}
        duration={2}
        ease="elastic.out(1, 0.5)"
        splitType="chars"
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />
      <p className="text-base sm:text-lg md:text-xl mt-1 italic">
        Software Engineer. OSS Contributor.
      </p>
      <p className="text-sm sm:text-base md:text-lg max-w-xl mt-4">
        I crave quality.
        <br /> Dumb enough to learn new things.
        <br />I build, break, and fix things. Mostly in that order.
      </p>
      <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full text-background bg-foreground hover:bg-foreground text-sm transition-all hover:-translate-y-0.5 cursor-pointer hover:-translate-x-0.5"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
