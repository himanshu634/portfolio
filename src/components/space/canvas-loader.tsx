"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { SpaceFallback } from "./space-fallback";

const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Mounts the 3D voyage only when the device can handle it; otherwise
 * renders a static CSS space backdrop. Decided after mount so SSR markup
 * stays identical for every client.
 */
export function CanvasLoader() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState<"pending" | "webgl" | "fallback">(
    "pending"
  );

  useEffect(() => {
    setReady(supportsWebGL() ? "webgl" : "fallback");
  }, []);

  if (ready === "pending") return null;
  if (ready === "fallback" || reducedMotion) return <SpaceFallback />;
  return <SceneCanvas />;
}
