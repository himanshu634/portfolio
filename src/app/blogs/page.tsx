import { getAllBlogPosts, type BlogPost } from "@/lib/blogs";
import Link from "next/link";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Writing — Himanshu Mendapara",
    description:
      "Writing on agritech, software and what I'm learning.",
    path: "/blogs",
  }),
};

export default function BlogsPage() {
  const all = getAllBlogPosts();
  const posts = all.filter((post) => !post.earlier);
  const earlier = all.filter((post) => post.earlier);

  return (
    <Shell current="writing">
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Writing
      </h1>
      <p className="py-3 text-xl font-medium sm:text-[22px]">
        Thought experiments and things I&apos;ve learned.
      </p>

      {all.length === 0 ? (
        <p className="border-2 border-border p-4">No posts yet. Check back soon.</p>
      ) : (
        posts.length > 0 && <PostList posts={posts} />
      )}

      {earlier.length > 0 && (
        <section aria-labelledby="earlier-heading" className="mt-10">
          <h2 id="earlier-heading" className="type-display mb-3 text-[30px] md:text-[34px]">
            Earlier
          </h2>
          <PostList posts={earlier} />
        </section>
      )}
    </Shell>
  );
}

/** Date, title and read time per row; below md each row stacks. */
function PostList({ posts }: { posts: BlogPost[] }) {
  return (
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
  );
}
