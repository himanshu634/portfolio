import { getAllBlogPosts } from "@/lib/blogs";
import Link from "next/link";
import { Metadata } from "next";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Writing — Himanshu Mendapara",
  description: "Writing on agritech, software and what I'm learning.",
};

export default function BlogsPage() {
  const posts = getAllBlogPosts();

  return (
    <Shell current="writing">
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Writing
      </h1>
      <p className="py-3 text-xl font-medium sm:text-[22px]">
        Thought experiments and things I&apos;ve learned.
      </p>

      {posts.length === 0 ? (
        <p className="border-2 border-border p-4">No posts yet. Check back soon.</p>
      ) : (
        <ul className="border-2 border-border">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border last:border-b-0">
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-1 px-3 py-3 hover:bg-now md:grid md:grid-cols-[170px_minmax(0,1fr)_140px] md:gap-0 md:p-0"
              >
                <time
                  dateTime={post.date}
                  className="text-sm font-semibold tabular-nums md:flex md:items-center md:border-r md:border-border md:px-3.5 md:text-base md:font-normal"
                >
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="md:border-r md:border-border md:px-3.5 md:py-3.5">
                  <span className="block text-[19px] leading-snug font-bold">{post.title}</span>
                  {post.description && <span className="block text-muted">{post.description}</span>}
                </span>
                {post.readTime && (
                  <span className="text-sm md:flex md:items-center md:px-3.5 md:text-base">
                    {post.readTime}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
