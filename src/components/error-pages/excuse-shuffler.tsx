"use client";

import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * The one playful touch: a self-deprecating excuse that you can re-roll.
 * Starts deterministic (index 0) to keep SSR + hydration happy, then picks a
 * random one on mount so every visit feels a little different.
 */
export function ExcuseShuffler({ excuses }: { excuses: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (excuses.length > 1) {
      setIndex(Math.floor(Math.random() * excuses.length));
    }
  }, [excuses.length]);

  function shuffle() {
    if (excuses.length < 2) return;
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * excuses.length);
    }
    setIndex(next);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        key={index}
        className="text-muted italic max-w-md text-base sm:text-lg leading-relaxed animate-[fadeIn_0.3s_ease-in]"
      >
        “{excuses[index]}”
      </p>
      {excuses.length > 1 && (
        <button
          onClick={shuffle}
          className="group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-foreground transition-colors"
        >
          <RotateCw
            className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180"
            strokeWidth={1.5}
          />
          blame something else
        </button>
      )}
    </div>
  );
}
