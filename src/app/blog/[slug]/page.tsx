import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.metadata.title} - Himanshu Mendapara`,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const MDXContent = (await import(`@/../../content/blogs/${slug}.mdx`)).default;

  return (
    <div className="pt-16">
      <div className="mb-6 pb-4 border-b border-border">
        <Link
          href="/blogs"
          className="text-sm text-muted hover:text-foreground transition-colors mb-6 block"
        >
          &larr; Writing
        </Link>
        <h1 className="text-2xl font-semibold mb-3">{post.metadata.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.metadata.readTime && (
            <>
              <span>&middot;</span>
              <span>{post.metadata.readTime}</span>
            </>
          )}
        </div>
      </div>
      <div className="mdx-content">
        <MDXContent />
      </div>
    </div>
  );
}
