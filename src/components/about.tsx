const techStack = [
  "Rust (learning)",
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
  "tRPC",
  "Prisma",
  "Node.js",
  "Bun",
  "pnpm",
  "PostgreSQL",
];

export function About() {
  return (
    <section className="pt-16 pb-12">
      <h1 className="text-3xl font-semibold mb-4">Hey, Himanshu here.</h1>
      <p className="text-foreground leading-relaxed mb-6">
        Software Engineer. Often found experimenting with new tech.
        <br />
        Currently exploring Rust.
      </p>
      <p className="text-sm text-muted leading-relaxed font-mono">
        {techStack.join(" · ")}
      </p>
    </section>
  );
}
