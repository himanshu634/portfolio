import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen pb-20 lg:max-w-[900px] mx-auto px-4 md:px-8">
      <Header />
      <div className="pt-20 md:pt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-accent-2 hover:text-accent-blue transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          <span>Back to all blogs</span>
        </Link>
      </div>
      <article className="prose prose-invert max-w-none">{children}</article>
    </main>
  );
}
