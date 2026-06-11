"use client";

import { useMemo } from "react";

/**
 * Static space backdrop for no-WebGL / reduced-motion visitors:
 * the body's CSS nebula gradient plus a sprinkling of box-shadow stars.
 * Rendered client-side only (after the WebGL probe), so random star
 * placement can't cause a hydration mismatch.
 */
export function SpaceFallback() {
  const starShadows = useMemo(() => {
    const shadows: string[] = [];
    for (let i = 0; i < 150; i++) {
      const x = Math.round(Math.random() * 100);
      const y = Math.round(Math.random() * 100);
      const alpha = (0.3 + Math.random() * 0.7).toFixed(2);
      shadows.push(`${x}vw ${y}vh 0 rgba(232, 234, 246, ${alpha})`);
    }
    return shadows.join(", ");
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none space-static" aria-hidden="true">
      <div
        className="absolute w-px h-px rounded-full"
        style={{ boxShadow: starShadows }}
      />
    </div>
  );
}
