import type { BlogPost } from "@/lib/blogs";

export type Kind = "work" | "project" | "writing" | "oss";

export interface IndexItem {
  kind: Kind;
  title: string;
  description?: string;
  /** Shown in the year column; `now` items show "Now" instead. */
  year: number;
  now?: boolean;
  /** A featured post: pinned to the top with the year cell lit, like `now`. */
  featured?: boolean;
  href: string;
  /** Where the row goes: "GitHub", "Live site", "Work page"… */
  linkLabel: string;
}

/** The home page's sections, in the header's order. `label` names one item, `section` the group. */
export const KINDS: { kind: Kind; label: string; section: string; hash: string }[] = [
  { kind: "work", label: "Role", section: "Work", hash: "work" },
  { kind: "project", label: "Project", section: "Projects", hash: "projects" },
  { kind: "writing", label: "Writing", section: "Writing", hash: "writing" },
  { kind: "oss", label: "Open source", section: "Open source", hash: "open-source" },
];

// Everything except blog posts, which come from content/blogs. Sources: the
// work page and github.com/himanshu634 (repo creation years, PR and talk dates).
const ITEMS: IndexItem[] = [
  {
    kind: "project",
    title: "Maester",
    description:
      "Open-source portfolio manager that suggests your next move, with evidence. Pre-alpha.",
    year: 2026,
    now: true,
    href: "https://github.com/himanshu634/maester",
    linkLabel: "GitHub",
  },
  {
    kind: "work",
    title: "Tech Lead, Bull Agritech",
    description: "Farmer-to-processor supply chain, an agent-run CRM, and Koshi.",
    // TODO: start year unknown; the row shows "Now" so it isn't displayed.
    year: 2026,
    now: true,
    href: "/work",
    linkLabel: "Work page",
  },
  {
    kind: "project",
    title: "coin-launch",
    description: "Token launch platform on Solana.",
    year: 2026,
    href: "https://github.com/himanshu634/coin-launch",
    linkLabel: "GitHub",
  },
  {
    kind: "project",
    title: "Secrin",
    description: "Answers why code was written, from commits, issues and docs.",
    year: 2025,
    href: "https://github.com/himanshu634/secrin",
    linkLabel: "GitHub",
  },
  {
    kind: "project",
    title: "Banking CLI",
    description: "A banking ledger in Rust, written to learn ownership and lifetimes.",
    year: 2025,
    href: "https://github.com/himanshu634/simple-banking-cli",
    linkLabel: "GitHub",
  },
  {
    kind: "project",
    title: "Konekt",
    description: "Random video chat with two-player games built in.",
    year: 2025,
    href: "https://konekt-web.vercel.app",
    linkLabel: "Live site",
  },
  {
    kind: "oss",
    title: "Trino Community Broadcast 66",
    description: "Featured for the Trino connector I built for WrenAI.",
    year: 2024,
    href: "https://www.youtube.com/watch?v=pUh7DIaznPg&t=574s",
    linkLabel: "Video",
  },
  {
    kind: "oss",
    title: "WrenAI: Trino connector",
    description: "Unified SQL and NoSQL queries in Wren's engine. Merged.",
    year: 2024,
    href: "https://github.com/Canner/WrenAI/pull/535",
    linkLabel: "PR #535",
  },
  {
    kind: "work",
    title: "Software Engineer, Genuin",
    description: "Web app, web SDK and marketing site for a short-form video platform.",
    year: 2023,
    href: "/work",
    linkLabel: "Work page",
  },
  {
    kind: "work",
    title: "Software Engineering Intern, Genuin",
    description: "React and TypeScript fixes across the web app.",
    year: 2023,
    href: "/work",
    linkLabel: "Work page",
  },
];

/** Every item, newest first: live items, then by year, posts ahead of the rest within a year. */
export function getIndexItems(posts: BlogPost[]): IndexItem[] {
  const postItems: IndexItem[] = posts.map((post) => ({
    kind: "writing",
    title: post.title,
    year: new Date(post.date).getFullYear(),
    href: `/blog/${post.slug}`,
    linkLabel: post.readTime ? `Post, ${post.readTime.replace(" read", "")}` : "Post",
  }));

  const rank = (item: IndexItem) => [item.now ? 1 : 0, item.year, item.kind === "writing" ? 1 : 0];

  return [...postItems, ...ITEMS].sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)];
    for (let i = 0; i < ra.length; i++) {
      if (ra[i] !== rb[i]) return rb[i] - ra[i];
    }
    return 0;
  });
}
