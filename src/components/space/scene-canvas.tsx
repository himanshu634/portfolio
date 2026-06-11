"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import type { PostShard } from "@/lib/content";
import { FlightController } from "./flight/flight-controller";
import { CameraRig } from "./flight/camera-rig";
import { ShipRig } from "./flight/ship-rig";
import { Starfield } from "./starfield";
import { Nebula, SceneMood } from "./nebula";
import { PlanetSystem } from "./planets";
import { Wormhole } from "./warp/wormhole";
import { Effects } from "./warp/effects";
import { KonamiDuck } from "../easter-eggs/konami-duck";

/**
 * The universe is the UI: a fixed full-screen canvas that owns all content
 * rendering on the home route. Planets are clickable (warp targets), so the
 * canvas receives pointer events; the few HUD widgets float above it.
 *
 * frameloop stays "always" — the physics needs continuous stepping, coasting
 * ships keep coasting whether or not you're scrolling.
 */
export default function SceneCanvas({ posts }: { posts: PostShard[] }) {
  const quality = useTravelStore((s) => s.quality);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 60, near: 0.1, far: 700, position: [0, 4, 24] }}
        frameloop="always"
      >
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 40, 260]} />
        {/* Low ambient floor only — the sun owns the lighting. */}
        <ambientLight intensity={0.05} />
        <Suspense fallback={null}>
          <SceneMood />
          <Starfield quality={quality} />
          <Nebula />
          <PlanetSystem posts={posts} />
          <FlightController />
          <ShipRig quality={quality} />
          <CameraRig />
          <Wormhole />
          <KonamiDuck />
          <Effects quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
