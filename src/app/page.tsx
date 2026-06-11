import { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blogs";
import { Experience } from "@/components/experience";
import { MissionLog } from "@/components/mission-log";

/**
 * Home: the universe is the UI. The Mission Log below is the always-SSR'd
 * semantic document (SEO/no-JS/screen readers); the Experience mounts the
 * physics-driven flight on capable browsers and hides the log.
 */
export default function Home() {
  const posts = getAllBlogPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    readTime: p.readTime,
  }));

  return (
    <>
      <Experience posts={posts} />
      <MissionLog />
    </>
  );
}

export const metadata: Metadata = {
  title: "Himanshu Mendapara",
  description:
    "Software Engineer. Often found experimenting with new tech. Currently exploring Rust.",
  keywords: [
    "Himanshu Mendapara",
    "Portfolio",
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Himanshu Mendapara" }],
  openGraph: {
    title: "Himanshu Mendapara",
    description: "Software Engineer. Currently exploring Rust.",
    type: "website",
  },
};
