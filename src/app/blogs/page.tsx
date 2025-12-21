import { getAllBlogPosts } from "@/lib/blogs";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Himanshu Mendapara",
  description: "Technical blog posts and articles about web development, programming, and technology.",
};

export default function BlogsPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen pb-20 lg:max-w-[1024px] mx-auto px-4 md:px-8">
      <div className="py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Blog
        </h1>
        <p className="text-accent-2 text-lg mb-12">
          Thoughts, tutorials, and insights about software development.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-accent-2 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="block group"
              >
                <article className="border border-accent-2 rounded-lg p-6 hover:border-accent-blue transition-colors duration-200">
                  <h2 className="text-2xl font-bold mb-2 text-foreground group-hover:text-accent-blue transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-accent-2 mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {post.readTime && (
                      <>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                  <p className="text-foreground/80 mb-4">{post.description}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-accent-1/30 text-accent-2 rounded-full border border-accent-2/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
