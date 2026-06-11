import type { PlanetId } from "@/lib/flight/path";

/**
 * Single source of truth for the portfolio content placed in 3D.
 * The Mission Log renders the same facts as semantic HTML.
 */

export const IDENTITY = {
  name: "Himanshu Mendapara",
  status: "Tech Lead @ Bull Agritech",
  tagline: "An engineer solving for agritech.",
  photo: "https://github.com/himanshu634.png",
  email: "himanshumendapra@gmail.com",
  github: "https://github.com/himanshu634",
  x: "https://x.com/himanshu_btw",
  linkedin: "https://www.linkedin.com/in/himanshu-mendapara-a732051aa/",
};

/** Forge-9: each skill is a geostationary satellite. */
export interface Skill {
  name: string;
  detail: string;
}
export const SKILLS: Skill[] = [
  { name: "React", detail: "Production UIs since 2023" },
  { name: "TypeScript", detail: "Strict mode, no regrets" },
  { name: "Next.js", detail: "App Router, ISR, SSG" },
  { name: "Node.js", detail: "APIs, tooling, scripts" },
  { name: "Three.js / R3F", detail: "You're flying through it" },
  { name: "Video / HLS.js", detail: "Streaming, VAST ads, IMA SDK" },
  { name: "TanStack Query", detail: "Caching done right" },
  { name: "Sanity CMS", detail: "Headless content pipelines" },
  { name: "Tailwind CSS", detail: "Utility-first, v4" },
  { name: "SQL / Trino", detail: "Federated query engines" },
  { name: "Rust", detail: "Experimental satellite. May deorbit." },
];

/** Genuin Prime: each project is a moon — bigger moon, closer orbit = more significant. */
export interface Moon {
  id: string;
  name: string;
  era: string;
  radius: number; // relative moon size
  orbit: number; // orbit radius around the gas giant
  speedScale: number; // v ∝ 1/√r is applied on top
  href?: string;
  bullets: string[];
  links?: { label: string; href: string }[];
}
export const WORK_MOONS: Moon[] = [
  {
    id: "webapp",
    name: "Genuin Web App",
    era: "2023 — present",
    radius: 1.5,
    orbit: 12.5,
    speedScale: 1,
    href: "https://begenuin.com/home",
    bullets: [
      "Short-form video social platform",
      "Refactored legacy code — load time down 50%",
      "Pixel-perfect white-label theming",
      "hls.js streaming + IMA SDK VAST ads",
      "Lazy loading & code-splitting for low-end devices",
    ],
    links: [
      { label: "Ogonuts", href: "https://community.ogonuts.com/home" },
      { label: "Carlist", href: "https://community.carlist.my/" },
    ],
  },
  {
    id: "sdk",
    name: "Genuin Web SDK",
    era: "2023 — present",
    radius: 1.1,
    orbit: 16.5,
    speedScale: 1,
    bullets: [
      "Embeds video communities into client sites",
      "Rollup code-splitting — bundle down 40%",
      "Automated test suites: QA cycles 3 → 2",
      "Integration API that hides the gnarly bits",
    ],
    links: [
      {
        label: "India Food Network",
        href: "https://www.indiafoodnetwork.in/community",
      },
      { label: "Ogonuts", href: "https://www.ogonuts.com/pages/community" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Website",
    era: "2023 — present",
    radius: 0.85,
    orbit: 20.5,
    speedScale: 1,
    href: "https://begenuin.com",
    bullets: [
      "Next.js + Tailwind + headless Sanity CMS",
      "ISR & SSG to cut backend costs",
      "CMS-driven blog — zero developer involvement",
    ],
  },
  {
    id: "internship",
    name: "Internship-1",
    era: "Feb – Jul 2023",
    radius: 0.55,
    orbit: 24.5,
    speedScale: 1,
    bullets: [
      "Academic → production-grade React + TS",
      "Perf profiling with browser dev tools",
      "Agile sprints, daily stand-ups, survived both",
    ],
  },
];

/** Chronos-style ring bands on Genuin Prime double as the tenure timeline. */
export const WORK_TIMELINE = [
  { label: "FEB 2023 · INTERN", band: 0 },
  { label: "JUL 2023 · SWE I", band: 1 },
  { label: "PRESENT · STILL SHIPPING", band: 2 },
];

export const WORK_HEADLINE = {
  title: "Genuin Inc.",
  role: "Software Engineer I · July 2023 – Present",
  summary:
    "Led multiple projects start to finish with a focus on performance and scalability.",
};

/** Glacius Commons: open-source contributions as satellites. */
export interface OssSat {
  id: string;
  name: string;
  detail: string;
  href: string;
  isDish?: boolean;
}
export const OSS_PROJECT = {
  name: "Wren-AI",
  org: "Canner.io",
  href: "https://github.com/Canner/WrenAI",
  summary:
    "Open-source AI-powered data analysis — natural language queries on databases.",
};
export const OSS_SATS: OssSat[] = [
  {
    id: "pr535",
    name: "PR #535 · merged ✓",
    detail: "Trino connector for the Wren engine — unified SQL + NoSQL queries",
    href: "https://github.com/Canner/WrenAI/issues/535",
  },
  {
    id: "pr746",
    name: "PR #746",
    detail: "UI improvements",
    href: "https://github.com/Canner/WrenAI/issues/746",
  },
  {
    id: "pr491",
    name: "PR #491",
    detail: "Bug fixes",
    href: "https://github.com/Canner/WrenAI/issues/491",
  },
  {
    id: "broadcast",
    name: "Trino Community Broadcast",
    detail: "Featured for the Trino connector work",
    href: "https://www.youtube-nocookie.com/embed/pUh7DIaznPg?start=574",
    isDish: true,
  },
];
export const OSS_YOUTUBE =
  "https://www.youtube-nocookie.com/embed/pUh7DIaznPg?si=XuR9mOueKEym7GFW&start=574";

/** Comet Scriptor: blog posts trail off the comet. Threaded from the server. */
export interface PostShard {
  slug: string;
  title: string;
  date: string;
  readTime?: string;
}

export const CONTACT = {
  heading: "Deep Space Relay",
  blurb:
    "End of the tour — but every voyage starts a new one. If you want to build something together, send a transmission.",
  email: IDENTITY.email,
  ports: [
    { label: "GitHub", href: IDENTITY.github },
    { label: "LinkedIn", href: IDENTITY.linkedin },
    { label: "X", href: IDENTITY.x },
  ],
};

/** Per-planet theme: palette + fonts (swapped during the wormhole). */
export interface PlanetTheme {
  accent: string;
  fog: string;
  nebula: string;
  displayFont: string;
  bodyFont: string;
}
export const PLANET_THEMES: Record<PlanetId, PlanetTheme> = {
  terra: {
    accent: "#7ee8a2",
    fog: "#06120c",
    nebula: "#2dd4bf",
    displayFont: "var(--font-fraunces)",
    bodyFont: "var(--font-grotesk)",
  },
  forge: {
    accent: "#fca5a5",
    fog: "#120808",
    nebula: "#f97316",
    displayFont: "var(--font-chakra)",
    bodyFont: "var(--font-jbmono)",
  },
  genuin: {
    accent: "#c4b5fd",
    fog: "#0b0716",
    nebula: "#a78bfa",
    displayFont: "var(--font-orbitron)",
    bodyFont: "var(--font-grotesk)",
  },
  glacius: {
    accent: "#7dd3fc",
    fog: "#051018",
    nebula: "#38bdf8",
    displayFont: "var(--font-orbitron)",
    bodyFont: "var(--font-jbmono)",
  },
  comet: {
    accent: "#fcd34d",
    fog: "#121006",
    nebula: "#fbbf24",
    displayFont: "var(--font-quicksand)",
    bodyFont: "var(--font-grotesk)",
  },
  relay: {
    accent: "#f0abfc",
    fog: "#0d0512",
    nebula: "#e879f9",
    displayFont: "var(--font-orbitron)",
    bodyFont: "var(--font-grotesk)",
  },
};
