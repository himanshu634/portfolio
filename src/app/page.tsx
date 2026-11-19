import { Metadata } from "next";
import { IndexTable } from "@/components/index-table";
import { Lede } from "@/components/lede";
import { Shell } from "@/components/shell";
import { getAllBlogPosts } from "@/lib/blogs";
import { getIndexItems } from "@/lib/index-items";

export const metadata: Metadata = {
  title: "Himanshu Mendapara",
  description:
    "Product engineer and tech lead at Bull Agritech, India. I build AI products end to end, from the agent to the app it ships in.",
  keywords: [
    "Himanshu Mendapara",
    "Portfolio",
    "Tech Lead",
    "Product Engineering",
    "Product Engineer",
    "AI Engineer",
    "AI Agents",
    "LangGraph",
    "LLM Engineering",
    "Evals",
    "Human-in-the-loop",
    "Knowledge Graphs",
    "Agritech",
    "React Native",
    "Next.js",
  ],
  authors: [{ name: "Himanshu Mendapara" }],
  openGraph: {
    title: "Himanshu Mendapara",
    description:
      "Product engineer and tech lead. I build AI products end to end, from the agent to the app it ships in.",
    type: "website",
  },
};

export default function Home() {
  const items = getIndexItems(getAllBlogPosts());

  return (
    <Shell current="home">
      <h1 className="type-display pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Himanshu Mendapara
      </h1>
      <Lede />
      <IndexTable items={items} />
    </Shell>
  );
}
