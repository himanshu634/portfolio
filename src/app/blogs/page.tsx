import { getAllBlogPosts } from "@/lib/blogs";
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Writing — Himanshu Mendapara",
  description: "Technical articles about web development, programming, and technology.",
};

export default function BlogsPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="max-w-[680px] mx-auto px-4 pb-20">
        <section className="pt-16 pb-12">
          <h1 className="text-2xl font-semibold mb-2">Writing</h1>
          <p className="text-muted text-sm mb-8">
            Thought experiments and learnings.
          </p>

          {posts.length === 0 ? (
            <p className="text-muted">No posts yet. Check back soon.</p>
          ) : (
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
          )}
        </section>
      </main>
    </>
  );
}
