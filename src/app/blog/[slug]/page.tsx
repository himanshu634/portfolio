import { getAllBlogPosts, getBlogPostBySlug, getPostSections } from "@/lib/blogs";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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

  const sections = getPostSections(post.content);
  const tags = post.metadata.tags ?? [];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-wrap border-b-2 border-border text-sm font-semibold md:grid md:h-10 md:grid-cols-[150px_200px_150px_minmax(0,1fr)]">
        <span className="flex items-center py-2 pr-4 md:border-r md:border-border md:py-0">Writing</span>
        <time
          dateTime={post.metadata.date}
          className="flex items-center py-2 pr-4 tabular-nums md:border-r md:border-border md:py-0 md:pl-3.5"
        >
          {new Date(post.metadata.date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.metadata.readTime && (
          <span className="flex items-center py-2 pr-4 md:border-r md:border-border md:py-0 md:pl-3.5">
            {post.metadata.readTime}
          </span>
        )}
        {tags.length > 0 && (
          <span className="hidden items-center pl-3.5 md:flex">{tags.join(", ")}</span>
        )}
      </div>
      <h1 className="type-display border-b-2 border-border pt-5 pb-4 text-[clamp(2.75rem,7vw,5.5rem)]">
        {post.metadata.title}
      </h1>
      <div className="flex gap-[60px] pt-7">
        {sections.length > 1 && (
          <nav aria-label="In this post" className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-6 flex flex-col border-t-2 border-border">
              <span className="border-b border-border py-2.5 text-sm font-bold">In this post</span>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="border-b border-border py-2 hover:bg-now"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>
        )}
        <div className="mdx-content min-w-0 max-w-[680px] flex-1">
          <MDXContent />
        </div>
      </div>
    </article>
  );
}
