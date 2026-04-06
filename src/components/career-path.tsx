"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Project {
  name: string;
  href?: string;
}

interface CareerEntry {
  title: string;
  company: string;
  duration: string;
  summary: string;
  projects?: Project[];
}

const career: CareerEntry[] = [
  {
    title: "Software Engineer - I",
    company: "Genuin Inc.",
    duration: "July 2023 — Present",
    summary:
      "Led multiple projects end-to-end with a focus on performance, scalability, and white-label delivery.",
    projects: [
      { name: "Web App", href: "https://begenuin.com/home" },
      { name: "Web SDK" },
      { name: "Marketing Site", href: "https://begenuin.com" },
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "Genuin Inc.",
    duration: "Feb 2023 — July 2023",
    summary:
      "Transitioned from academics to production — debugging, shipping, and learning component-driven architecture.",
  },
];

export function CareerPath() {
  return (
    <div>
      <p className="text-4xl text-center font-semibold lg:text-5xl mb-16">
        Career Path
      </p>
      <div className="relative ml-4 md:ml-8">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-accent-2/50" />

        <div className="space-y-12">
          {career.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative pl-8"
            >
              {/* Dot on the line */}
              <div className="absolute left-0 top-2 -translate-x-1/2 size-3 rounded-full bg-foreground border-2 border-background" />

              <p className="text-sm text-accent-2">{entry.duration}</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-1">
                {entry.title}
              </h3>
              <p className="text-accent-2 text-sm">{entry.company}</p>
              <p className="mt-2 text-foreground/80 max-w-xl">
                {entry.summary}
              </p>

              {entry.projects && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.projects.map((project) =>
                    project.href ? (
                      <Link
                        key={project.name}
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-accent-2/50 text-accent-2 hover:border-foreground hover:text-foreground transition-colors"
                      >
                        {project.name}
                        <ExternalLink className="size-3" />
                      </Link>
                    ) : (
                      <span
                        key={project.name}
                        className="text-xs px-3 py-1 rounded-full border border-accent-2/50 text-accent-2"
                      >
                        {project.name}
                      </span>
                    )
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
