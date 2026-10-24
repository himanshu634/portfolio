import Image from "next/image";
import { Metadata } from "next";
import { ContactLinks } from "@/components/footer";
import { IndexTable } from "@/components/index-table";
import { Shell } from "@/components/shell";
import { getAllBlogPosts } from "@/lib/blogs";
import { getIndexItems } from "@/lib/index-items";

export const metadata: Metadata = {
  title: "Himanshu Mendapara",
  description:
    "Tech lead at Bull Agritech in Ahmedabad. I build AI for money and markets.",
  keywords: [
    "Himanshu Mendapara",
    "Portfolio",
    "Tech Lead",
    "Full Stack Engineer",
    "AI Engineer",
    "LLM Engineering",
    "AI Agents",
    "Knowledge Graphs",
    "FalkorDB",
    "Fintech",
    "Agritech",
    "Next.js",
    "Rust",
  ],
  authors: [{ name: "Himanshu Mendapara" }],
  openGraph: {
    title: "Himanshu Mendapara",
    description: "Tech lead at Bull Agritech. I build AI for money and markets.",
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
          Tech lead at Bull Agritech. I build AI for money and markets.
        </p>
        <ContactLinks className="text-base" />
      </div>
      <IndexTable items={items} />
    </Shell>
  );
}
