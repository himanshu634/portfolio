"use client";

import { ArrowRight, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ExcuseShuffler } from "@/components/error-pages/excuse-shuffler";

const EXCUSES = [
  "There's a solid chance I pushed straight to main again.",
  "It worked on my machine, I swear.",
  "The server panicked. Same, honestly.",
  "Something threw an error and I've chosen not to read the logs yet.",
  "I'd blame the framework, but we both know it was me.",
  "This wasn't supposed to happen. It's happening anyway.",
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Future me will thank present me for this.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="font-mono text-sm text-muted mb-4">Error 500</p>

      <h1 className="font-mono text-7xl sm:text-8xl font-semibold tracking-tight mb-6 photo-wiggle cursor-default select-none">
        500
      </h1>

      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
        Okay, that one&apos;s on me.
      </h2>

      <ExcuseShuffler excuses={EXCUSES} />

      <div className="flex flex-wrap gap-8 justify-center mt-12">
        <button
          onClick={() => reset()}
          className="group inline-flex items-center gap-2 font-mono text-foreground hover:text-muted transition-colors"
        >
          <RotateCw
            className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
            strokeWidth={1.5}
          />
          Try that again
        </button>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-foreground hover:text-muted transition-colors"
        >
          Escape to home
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-45"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </main>
  );
}
