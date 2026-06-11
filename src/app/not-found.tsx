import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExcuseShuffler } from "@/components/error-pages/excuse-shuffler";

export const metadata: Metadata = {
  title: "404 — this page wandered off",
  description: "The page you're after doesn't exist. Honestly, could be my fault.",
};

const EXCUSES = [
  "You've drifted into uncharted space. Even Voyager knows where it is.",
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
      <p className="font-mono text-sm text-muted mb-4">Error 404</p>

      <h1 className="font-mono text-7xl sm:text-8xl font-semibold tracking-tight mb-6 photo-wiggle cursor-default select-none">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
        Well, this is awkward.
      </h2>

      <ExcuseShuffler excuses={EXCUSES} />

      <div className="flex flex-wrap gap-8 justify-center mt-12 items-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-accent border border-accent/40 rounded-full px-5 py-2 hover:bg-accent/10 transition-colors"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 group-hover:rotate-[360deg]"
          >
            ◎
          </span>
          Open emergency wormhole home
        </Link>
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 font-mono text-foreground hover:text-muted transition-colors"
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
