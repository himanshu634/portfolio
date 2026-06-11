"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTravelStore } from "@/lib/store";
import { useThrustInput } from "@/lib/input/use-thrust-input";
import { isMobileViewport } from "@/lib/flight/path";
import { MISSION_LOG_LABEL } from "@/lib/jokes";
import type { PostShard } from "@/lib/content";
import { StarMap } from "./hud/star-map";
import { VelocityReadout } from "./hud/velocity-readout";
import { Advisory } from "./hud/advisory";
import { Whiteout } from "./hud/whiteout";
import { LoadingScreen } from "./hud/loading-screen";
import { SpaceFallback } from "./space/space-fallback";

const SceneCanvas = dynamic(() => import("./space/scene-canvas"), {
  ssr: false,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectLowQuality(): boolean {
  return (
    isMobileViewport() ||
    (typeof navigator !== "undefined" &&
      (navigator.hardwareConcurrency ?? 8) <= 4)
  );
}

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Client gate for the flight experience. SSR/no-JS/no-WebGL visitors read
 * the Mission Log (the semantic document below); capable browsers get the
 * universe. Reduced-motion users still fly — with crossfades instead of
 * wormholes and a stilled cockpit.
 */
export function Experience({ posts }: { posts: PostShard[] }) {
  const missionLog = useTravelStore((s) => s.missionLog);
  const setMissionLog = useTravelStore((s) => s.setMissionLog);
  const [capable, setCapable] = useState<"pending" | "yes" | "no">("pending");
  const konamiIdx = useRef(0);

  useEffect(() => {
    const webgl = supportsWebGL();
    setCapable(webgl ? "yes" : "no");
    if (!webgl) return;
    useTravelStore.setState({
      quality: detectLowQuality() ? "low" : "high",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    });
  }, []);

  const flying = capable === "yes" && !missionLog;

  // Flight mode hides the Mission Log + header via body[data-mode] CSS.
  useEffect(() => {
    document.body.dataset.mode = flying ? "flight" : "log";
    return () => {
      delete document.body.dataset.mode;
    };
  }, [flying]);

  useThrustInput(flying);

  // ↑↑↓↓←→←→BA
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konamiIdx.current = key === KONAMI[konamiIdx.current] ? konamiIdx.current + 1 : key === KONAMI[0] ? 1 : 0;
      if (konamiIdx.current === KONAMI.length) {
        konamiIdx.current = 0;
        useTravelStore.getState().spawnDuck();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (capable !== "yes") {
    return capable === "no" ? <SpaceFallback /> : null;
  }

  return (
    <>
      {flying && (
        <>
          <SceneCanvas posts={posts} />
          <StarMap />
          <VelocityReadout />
          <Advisory />
          <Whiteout />
          <LoadingScreen />
        </>
      )}
      {missionLog && <SpaceFallback />}
      <button
        onClick={() => setMissionLog(!missionLog)}
        aria-pressed={missionLog}
        title={MISSION_LOG_LABEL}
        className={`hud-panel fixed right-4 z-[60] px-3 py-1.5 font-mono text-xs tracking-wider text-muted hover:text-foreground transition-colors ${
          missionLog ? "top-16" : "top-4"
        }`}
      >
        {missionLog ? "◉ RETURN TO SHIP" : "▤ MISSION LOG"}
      </button>
    </>
  );
}
