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

const BASE_URL = "https://himanshumendapara.com";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const url = `${BASE_URL}/blog/${slug}`;
  const { title, description, date, tags } = post.metadata;
  const fullTitle = `${title} - Himanshu Mendapara`;

  return {
    title: fullTitle,
    description,
    keywords: tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: fullTitle,
      description,
      publishedTime: date,
      authors: ["Himanshu Mendapara"],
      tags,
      siteName: "Himanshu Mendapara",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const MDXContent = (await import(`@/../../content/blogs/${slug}.mdx`)).default;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    datePublished: post.metadata.date,
    author: {
      "@type": "Person",
      name: "Himanshu Mendapara",
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${slug}`,
    keywords: post.metadata.tags?.join(", "),
  };

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
