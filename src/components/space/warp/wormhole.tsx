"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { createWormholeMaterial } from "@/shaders/materials";
import { PLANET_THEMES } from "@/lib/content";

/**
 * The FTL tunnel: an inverted, camera-parented cylinder running a polar-UV
 * fbm shader with in-shader chromatic streaking. Intensity ramps with the
 * warp clock; reduced-motion visitors get a crossfade instead (the whiteout
 * handles that — this never mounts hot for them).
 */
export function Wormhole() {
  const camera = useThree((s) => s.camera);
  const group = useRef<THREE.Group>(null);
  const material = useMemo(() => createWormholeMaterial(), []);

  useFrame((state) => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    const g = group.current;
    if (!g) return;

    const warping = store.mode === "WARP" && !store.reducedMotion;
    const charging = store.mode === "WARP_CHARGE" && !store.reducedMotion;
    g.visible = warping || charging;
    if (!g.visible) {
      material.uniforms.uIntensity.value = 0;
      return;
    }

    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Ramp in during charge, full in transit, ramp out at the end.
    let intensity = 0;
    if (charging) {
      intensity = (sim.warpT / 0.6) * 0.25;
    } else {
      const inRamp = Math.min(sim.warpT / 0.35, 1);
      const outRamp = Math.min(
        Math.max(sim.warpDuration - sim.warpT, 0) / 0.3,
        1
      );
      intensity = Math.min(inRamp, outRamp) * 1.0 + 0.1;
    }
    material.uniforms.uIntensity.value = intensity;

    // Tint the tunnel toward the destination's palette.
    const target = store.targetPlanet;
    if (target) {
      (material.uniforms.uColorB.value as THREE.Color).set(
        PLANET_THEMES[target].nebula
      );
    }
  });

  return (
    <group ref={group} visible={false}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -20]} raycast={() => null}>
        <cylinderGeometry args={[7, 7, 90, 48, 1, true]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}
