"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { WAYPOINTS } from "@/lib/journey";

/**
 * Cockpit HUD overlay: a thin voyage progress bar along the right edge
 * with waypoint dots that double as section anchors, plus a mono
 * readout of the current stop. Hidden on small screens.
 */
export function Hud() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  const [active, setActive] = useState(0);
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        let idx = 0;
        WAYPOINTS.forEach((w, i) => {
          if (v >= w.range[0]) idx = i;
        });
        setActive(idx);
      }),
    [scrollYProgress]
  );

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 font-mono">
      <span className="text-[10px] tracking-widest text-muted [writing-mode:vertical-rl]">
        VOYAGE
      </span>
      <div className="relative h-48 w-px bg-border">
        <motion.div
          className="absolute inset-x-0 top-0 w-px bg-accent origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>
      <nav className="flex flex-col gap-3" aria-label="Voyage sections">
        {WAYPOINTS.map((w, i) => (
          <a
            key={w.id}
            href={`#${w.id}`}
            aria-label={w.label}
            className="group relative flex items-center"
          >
            <span
              className={`block h-2 w-2 rounded-full border transition-all duration-300 ${
                i === active
                  ? "bg-accent border-accent shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                  : "bg-transparent border-muted group-hover:border-accent"
              }`}
            />
            <span className="absolute right-5 whitespace-nowrap text-[10px] tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              {w.label.toUpperCase()}
            </span>
          </a>
        ))}
      </nav>
      <span className="text-[10px] tracking-widest text-accent">
        {String(active + 1).padStart(2, "0")}/{String(WAYPOINTS.length).padStart(2, "0")}
      </span>
    </div>
  );
}
