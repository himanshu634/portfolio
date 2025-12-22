import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blogs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import SplashCursor from "@/components/ui/splash-cursor";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.metadata.title} - Himanshu Mendapara`,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Dynamically import the MDX file
  const MDXContent = (await import(`@/../../content/blogs/${slug}.mdx`))
    .default;

  return (
    <div>
      <SplashCursor />
      <header className="mb-8 pb-8 border-b border-accent-2">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {post.metadata.title}
        </h1>
        <div className="flex items-center gap-4 text-accent-2">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.metadata.readTime && (
            <>
              <span>•</span>
              <span>{post.metadata.readTime}</span>
            </>
          )}
        </div>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.metadata.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-accent-1/30 text-accent-2 rounded-full border border-accent-2/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="mdx-content">
        <MDXContent />
      </div>
    </div>
  );
}
