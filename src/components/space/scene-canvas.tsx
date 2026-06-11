"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { isMobileViewport } from "@/lib/journey";
import { JourneyRig } from "./journey-rig";
import { Starfield } from "./starfield";
import { Planets } from "./planets";
import { Nebula } from "./nebula";

/**
 * Fixed full-screen 3D backdrop for the homepage voyage. Sits behind the
 * scrollable HTML content (z-0 vs z-10) and never intercepts pointer
 * events, so native scrolling, selection and a11y are untouched.
 */
export default function SceneCanvas() {
  const [quality] = useState<"high" | "low">(() =>
    isMobileViewport() ? "low" : "high"
  );

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, near: 0.1, far: 400, position: [0, 2.5, 18] }}
      >
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 30, 160]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[15, 20, 10]} intensity={1.2} color="#cfd8ff" />
        <Starfield quality={quality} />
        <Nebula />
        <Planets />
        <JourneyRig quality={quality} />
      </Canvas>
    </div>
  );
}
