import { ReactNode } from "react";
import { Header } from "@/components/header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-[680px] mx-auto px-4 pb-20">
        <article className="glass-panel px-6 py-2 sm:px-10 sm:py-4 mt-10 mb-4">
          {children}
        </article>
      </main>
    </>
  );
}
