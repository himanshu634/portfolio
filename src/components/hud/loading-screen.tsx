"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useTravelStore } from "@/lib/store";
import { LOADING_LINES } from "@/lib/jokes";

const MIN_SHOW_MS = 900;

/** Pre-flight check screen with rotating mission-log jokes. */
export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [lineIdx, setLineIdx] = useState(0);
  const [mountedAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setLineIdx((i) => (i + 1) % LOADING_LINES.length),
      1100
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done || (active && progress < 100)) return;
    const wait = Math.max(0, MIN_SHOW_MS - (Date.now() - mountedAt));
    const id = setTimeout(() => {
      setDone(true);
      useTravelStore.setState({ loaded: true });
      setTimeout(() => setGone(true), 650);
    }, wait);
    return () => clearTimeout(id);
  }, [active, progress, done, mountedAt]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-background transition-opacity duration-500 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading the spacecraft"
    >
      <p className="hud-kicker">PRE-FLIGHT CHECK</p>
      <div className="h-px w-48 overflow-hidden bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>
      <p className="hud-line min-h-5 text-center px-6">
        {LOADING_LINES[lineIdx]}
      </p>
    </div>
  );
}
