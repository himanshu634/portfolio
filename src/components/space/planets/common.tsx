"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import {
  createAtmosphereMaterial,
  createPlanetMaterial,
  type PlanetMaterialOptions,
} from "@/shaders/materials";
import type { PlanetId, Waypoint } from "@/lib/flight/path";

/** Click/tap any planet from anywhere -> wormhole jump. */
export function useWarpHandlers(id: PlanetId) {
  const requestWarp = useTravelStore((s) => s.requestWarp);
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    handlers: {
      onClick: (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        requestWarp(id);
      },
      onPointerOver: (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      },
      onPointerOut: () => {
        setHovered(false);
        document.body.style.cursor = "auto";
      },
    },
  };
}

/**
 * A planet body: terminator-shaded sphere + fresnel atmosphere shell,
 * spinning on its own axis (`spin` rad/s — negative = retrograde, the
 * contrarian). Children rotate with the body (geostationary frame).
 */
export function PlanetBody({
  waypoint,
  material,
  spin = 0.05,
  axisTilt = 0.18,
  atmosphere,
  segments = 48,
  children,
  fixedChildren,
}: {
  waypoint: Waypoint;
  material: PlanetMaterialOptions | THREE.ShaderMaterial;
  spin?: number;
  axisTilt?: number;
  atmosphere: string;
  segments?: number;
  children?: ReactNode; // rotates with the planet
  fixedChildren?: ReactNode; // anchored to the planet, not spinning
}) {
  const spinGroup = useRef<THREE.Group>(null);
  const mat = useMemo(
    () =>
      material instanceof THREE.ShaderMaterial
        ? material
        : createPlanetMaterial(material),
    [material]
  );
  const atmoMat = useMemo(() => createAtmosphereMaterial(atmosphere), [atmosphere]);
  const { handlers } = useWarpHandlers(waypoint.id);

  useFrame((state, delta) => {
    if (spinGroup.current) spinGroup.current.rotation.y += spin * delta;
    if (mat.uniforms.uTime) mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group position={waypoint.position} rotation={[axisTilt, 0, 0]}>
      <group ref={spinGroup}>
        <mesh material={mat} {...handlers}>
          <sphereGeometry args={[waypoint.radius, segments, segments / 2]} />
        </mesh>
        {children}
      </group>
      <mesh material={atmoMat} scale={1.14} raycast={() => null}>
        <sphereGeometry args={[waypoint.radius, 32, 16]} />
      </mesh>
      {fixedChildren}
    </group>
  );
}

/** Small blinking beacon (satellites, antennae). */
export function Beacon({
  position,
  color = "#67e8f9",
  speed = 2.2,
  size = 0.07,
}: {
  position: [number, number, number];
  color?: string;
  speed?: number;
  size?: number;
}) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  const phase = useMemo(() => Math.random() * 10, []);
  useFrame((state) => {
    if (!ref.current) return;
    const v = Math.sin(state.clock.elapsedTime * speed + phase);
    // HDR push when lit so beacons catch the bloom pass.
    ref.current.color.set(color).multiplyScalar(v > 0.3 ? 2.4 : 0.25);
  });
  return (
    <mesh position={position} raycast={() => null}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial ref={ref} color={color} toneMapped={false} />
    </mesh>
  );
}
