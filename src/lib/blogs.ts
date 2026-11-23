import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime?: string;
  tags?: string[];
  /** Off the main thread: listed under "Earlier" on the home index and /blogs. */
  earlier?: boolean;
}

const contentDirectory = path.join(process.cwd(), "content", "blogs");

/**
 * `draft: true` keeps a post off the production site: no listing, no page.
 * Local dev and Vercel preview deployments still show it, so a draft can be read before it ships.
 */
function isHidden(data: { draft?: unknown }): boolean {
  return data.draft === true && process.env.VERCEL_ENV === "production";
}

export function getAllBlogPosts(): BlogPost[] {
  // Ensure the directory exists
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      if (isHidden(data)) return null;

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        readTime: data.readTime,
        tags: data.tags || [],
        earlier: data.earlier === true,
      } as BlogPost;
    })
    .filter((post): post is BlogPost => post !== null);

  // Most recent first
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getBlogPostBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  if (isHidden(data)) return null;

  return {
    slug,
    metadata: {
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || "",
      readTime: data.readTime,
      tags: data.tags || [],
    },
    content,
  };
}

/**
 * The post's h2s, with the ids rehype-slug gives them. Every heading is slugged
 * in order (as rehype-slug does) so repeated titles get the same "-1" suffixes.
 */
export function getPostSections(content: string): { id: string; title: string }[] {
  const slugger = new GithubSlugger();
  const sections: { id: string; title: string }[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const title = match[2].replace(/[*_`]/g, "");
    const id = slugger.slug(title);
    if (match[1].length === 2) sections.push({ id, title });
  }
  return sections;
}
