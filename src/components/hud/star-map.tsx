"use client";

import { useEffect, useRef, useState } from "react";
import { useTravelStore } from "@/lib/store";
import { PATH_LENGTH, WAYPOINTS } from "@/lib/flight/path";
import { PLANET_THEMES } from "@/lib/content";

/**
 * The one persistent piece of 2D chrome: a minimal star map showing the
 * route and current position. Tab-navigable; Enter on a planet = warp.
 */
export function StarMap() {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const targetPlanet = useTravelStore((s) => s.targetPlanet);
  const mode = useTravelStore((s) => s.mode);
  const requestWarp = useTravelStore((s) => s.requestWarp);
  const [shipFrac, setShipFrac] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    let last = 0;
    const tick = (t: number) => {
      raf.current = requestAnimationFrame(tick);
      if (t - last < 100) return; // 10Hz is plenty for a map dot
      last = t;
      setShipFrac(useTravelStore.getState().sim.s / PATH_LENGTH);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <nav
      aria-label="Star map — warp navigation"
      className="hud-panel fixed bottom-4 left-4 z-40 px-4 py-3"
    >
      <p className="hud-kicker mb-2">STAR MAP</p>
      <div className="relative flex items-center gap-0">
        {/* route line */}
        <div className="absolute left-2 right-2 top-1/2 h-px bg-border" />
        {/* ship position */}
        <div
          className="absolute -top-1.5 h-2 w-2 -translate-x-1/2 transition-[left] duration-300 ease-linear"
          style={{ left: `${8 + shipFrac * 84}%` }}
          aria-hidden="true"
        >
          <span className="block h-0 w-0 border-x-4 border-x-transparent border-t-[7px] border-t-accent" />
        </div>
        {WAYPOINTS.map((w) => {
          const isHere = currentPlanet === w.id;
          const isTarget = targetPlanet === w.id && mode !== "ORBIT";
          return (
            <button
              key={w.id}
              onClick={() => requestWarp(w.id)}
              aria-label={`Warp to ${w.label}${isHere ? " (current location)" : ""}`}
              aria-current={isHere ? "location" : undefined}
              title={w.label}
              className="group relative flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all ${
                  isHere
                    ? "h-3 w-3 shadow-[0_0_10px_currentColor]"
                    : isTarget
                      ? "h-2.5 w-2.5 animate-pulse"
                      : "h-2 w-2 opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
                style={{ background: PLANET_THEMES[w.id].accent, color: PLANET_THEMES[w.id].accent }}
              />
              <span className="hud-tooltip">{w.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
