import { getAllBlogPosts } from "@/lib/blogs";
import Link from "next/link";

export function Writing() {
  const posts = getAllBlogPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="pb-12">
      <h2 className="text-2xl font-semibold mb-5">Writing</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="flex items-baseline gap-6">
            <time className="text-sm text-muted shrink-0 w-28">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <Link
              href={`/blog/${post.slug}`}
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-all"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href="/blogs"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          All posts →
        </Link>
      </div>
    </section>
  );
}
