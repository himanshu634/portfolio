import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { CARD_SIZE, CARD_TYPE, renderShareCard } from "@/lib/share-card";

export const alt = "The post's title, by Himanshu Mendapara";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

// Rendered at build, one card per post, so the fonts and posts are only read then.
export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return renderShareCard({ title: "Writing" });

  const { title, date, readTime } = post.metadata;
  const published = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return renderShareCard({
    title,
    facts: ["Writing", published, ...(readTime ? [readTime] : [])],
  });
}
