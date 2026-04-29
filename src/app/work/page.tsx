import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WorkEx } from "@/components/work-ex";
import { OpenSourceContri } from "@/components/open-source-contri";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Himanshu Mendapara",
  description: "Work experience and projects by Himanshu Mendapara.",
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="max-w-[680px] mx-auto px-4 pb-20">
        <section className="pt-16 pb-12">
          <h1 className="text-2xl font-semibold mb-2">Work</h1>
          <p className="text-muted text-sm mb-12">Experience and projects.</p>
          <WorkEx />
        </section>
        <OpenSourceContri />
        <Footer />
      </main>
    </>
  );
}
