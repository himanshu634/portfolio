import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime?: string;
  tags?: string[];
}

const contentDirectory = path.join(process.cwd(), "content", "blogs");

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

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        readTime: data.readTime,
        tags: data.tags || [],
      } as BlogPost;
    });

  // Sort posts by date (most recent first)
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
