import Image from "next/image";
import { Metadata } from "next";
import { ContactLinks } from "@/components/footer";
import { IndexTable } from "@/components/index-table";
import { Principles } from "@/components/principles";
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
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Himanshu Mendapara
      </h1>
      <div
        id="contact"
        className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b-2 border-border py-3"
      >
        <Image
          src="/himanshu.jpeg"
          alt="Himanshu Mendapara"
          width={48}
          height={48}
          className="hidden size-12 border-2 border-border object-cover object-top grayscale sm:block"
          priority
        />
        <p className="min-w-[16rem] flex-1 text-xl leading-snug font-medium sm:text-[22px]">
          Product engineer and tech lead. I build AI products end to end, from the agent to the app it ships in.
        </p>
        <ContactLinks className="text-base" />
      </div>
      <Principles />
      <IndexTable items={items} />
    </Shell>
  );
}
