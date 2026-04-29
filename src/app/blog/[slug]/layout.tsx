import { ReactNode } from "react";
import { Header } from "@/components/header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-[680px] mx-auto px-4 pb-20">
        {children}
      </main>
    </>
  );
}
