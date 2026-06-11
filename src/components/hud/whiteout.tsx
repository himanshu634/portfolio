"use client";

import { useEffect, useRef } from "react";
import { useTravelStore } from "@/lib/store";

/** Wormhole exit flash: 2 frames of hard white, then a fast physics-timed fade. */
export function Whiteout() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;
      const w = useTravelStore.getState().sim.whiteout;
      el.style.opacity = String(w);
      el.style.display = w > 0.001 ? "block" : "none";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 hidden bg-white"
    />
  );
}
