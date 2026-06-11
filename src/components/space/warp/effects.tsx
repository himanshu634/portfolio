"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import type { ChromaticAberrationEffect } from "postprocessing";
import { useTravelStore } from "@/lib/store";

/**
 * Post chain. Bloom is "selective" the honest way: only HDR emitters
 * (sun, engines, beacons, accretion disc) exceed the luminance threshold.
 * Chromatic aberration is zero except during warp transit.
 */
export function Effects({ quality }: { quality: "high" | "low" }) {
  const chroma = useRef<ChromaticAberrationEffect>(null);

  useFrame(() => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    const effect = chroma.current;
    if (!effect) return;
    let amount = 0;
    if (store.mode === "WARP" && !store.reducedMotion) {
      const inRamp = Math.min(sim.warpT / 0.4, 1);
      const outRamp = Math.min(
        Math.max(sim.warpDuration - sim.warpT, 0) / 0.35,
        1
      );
      amount = Math.min(inRamp, outRamp) * 0.0042;
    }
    const offset = effect.offset as THREE.Vector2;
    if (Math.abs(offset.x - amount) > 1e-6) offset.set(amount, amount * 0.6);
  });

  const bloom = (
    <Bloom
      mipmapBlur
      luminanceThreshold={1}
      luminanceSmoothing={0.2}
      intensity={0.85}
    />
  );
  const aberration = (
    <ChromaticAberration
      ref={chroma}
      offset={[0, 0]}
      radialModulation
      modulationOffset={0.3}
    />
  );

  if (quality === "low") {
    return (
      <EffectComposer multisampling={0}>
        {bloom}
        {aberration}
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0}>
      {bloom}
      {aberration}
      <Noise opacity={0.055} />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
    </EffectComposer>
  );
}
