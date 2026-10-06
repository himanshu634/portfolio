import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExcuseShuffler } from "@/components/error-pages/excuse-shuffler";

export const metadata: Metadata = {
  title: "404 — this page wandered off",
  description: "The page you're after doesn't exist. Honestly, could be my fault.",
};

const EXCUSES = [
  "You typed it right. I built it wrong.",
  "I might've deleted this page and forgotten. Classic me.",
  "This link worked when I last checked. I have not last checked.",
  "404: the page went for coffee and never came back.",
  "Either you're lost or I'm lazy. Honestly, coin flip.",
  "Pretty sure this is a 'me' problem, not a 'you' problem.",
];

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-sm font-semibold mb-4">Error 404</p>

      <h1 className="type-display mb-6 text-[9rem] sm:text-[12rem] select-none">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
        Well, this is awkward.
      </h2>

      <ExcuseShuffler excuses={EXCUSES} />

      <div className="flex flex-wrap gap-8 justify-center mt-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 py-3 font-bold underline decoration-2 underline-offset-4 hover:bg-now"
        >
          Take me home
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-45"
            strokeWidth={1.5}
          />
        </Link>
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 py-3 font-bold underline decoration-2 underline-offset-4 hover:bg-now"
        >
          Read something instead
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-45"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </main>
  );
}
