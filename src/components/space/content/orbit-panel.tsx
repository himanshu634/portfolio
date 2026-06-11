"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html, Text } from "@react-three/drei";
import { useTravelStore } from "@/lib/store";
import { createHologramMaterial } from "@/shaders/materials";
import { getOrbitPoint, type Waypoint } from "@/lib/flight/path";

/**
 * Diegetic content primitives. There are no DOM cards — text is troika SDF
 * glyphs living in the scene, panels are holographic meshes, and everything
 * is anchored to (and revealed around) a planet's orbit.
 */

export const FONT_DISPLAY = "/fonts/orbitron-600.woff";
export const FONT_BODY = "/fonts/space-grotesk-500.woff";
export const FONT_MONO = "/fonts/jetbrains-mono-500.woff";

/** World position on/near a waypoint's orbit ring. Memoized per call site. */
export function useOrbitPos(
  w: Waypoint,
  theta: number,
  radialScale = 1,
  lift = 0
): THREE.Vector3 {
  return useMemo(() => {
    const p = getOrbitPoint(w, theta, new THREE.Vector3());
    p.sub(w.position).multiplyScalar(radialScale).add(w.position);
    p.addScaledVector(w.normal, lift);
    return p;
  }, [w, theta, radialScale, lift]);
}

/**
 * Children become visible once the ship has orbited far enough —
 * scroll-within-orbit rotates you to the next face of content.
 */
export function Reveal({
  at,
  position,
  children,
}: {
  at: number;
  position?: THREE.Vector3 | [number, number, number];
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const sim = useTravelStore.getState().sim;
    if (ref.current) ref.current.visible = sim.contentReveal >= at;
  });
  return (
    <group ref={ref} visible={false} position={position}>
      {children}
    </group>
  );
}

/**
 * Mount-gated reveal for panels containing drei <Html> — DOM content
 * ignores group.visible, so it must enter/leave the React tree instead.
 */
export function RevealMount({
  at,
  children,
}: {
  at: number;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);
  useFrame(() => {
    const r = useTravelStore.getState().sim.contentReveal >= at;
    if (r !== shownRef.current) {
      shownRef.current = r;
      setShown(r);
    }
  });
  return shown ? <>{children}</> : null;
}

/** Billboarded SDF text — crisp at any distance, always readable. */
export function HoloText({
  children,
  size = 0.8,
  color = "#e8eaf6",
  font = FONT_BODY,
  maxWidth = 14,
  anchorX = "center",
  position,
  emissive = false,
  textAlign = "center",
}: {
  children: string;
  size?: number;
  color?: string;
  font?: string;
  maxWidth?: number;
  anchorX?: "center" | "left" | "right";
  position?: THREE.Vector3 | [number, number, number];
  emissive?: boolean;
  textAlign?: "center" | "left" | "right";
}) {
  return (
    <Billboard position={position} follow>
      <Text
        font={font}
        fontSize={size}
        color={color}
        maxWidth={maxWidth}
        anchorX={anchorX}
        anchorY="middle"
        textAlign={textAlign}
        outlineWidth={emissive ? 0.012 : 0}
        outlineColor={color}
        outlineOpacity={emissive ? 0.6 : 0}
      >
        {children}
      </Text>
    </Billboard>
  );
}

/**
 * Holographic projection panel: a scanline-shader plane with optional DOM
 * content rendered IN scene space (drei Html transform), so it scales,
 * parallaxes and occludes with the world. Budget: keep ≤2 mounted at once.
 */
export function HoloPanel({
  width = 8,
  height = 5,
  color = "#67e8f9",
  position,
  html,
  htmlWidth = 320,
  occlude = true,
  children,
}: {
  width?: number;
  height?: number;
  color?: string;
  position?: THREE.Vector3 | [number, number, number];
  html?: ReactNode;
  htmlWidth?: number;
  occlude?: boolean;
  children?: ReactNode;
}) {
  const material = useMemo(() => createHologramMaterial(color), [color]);
  const quality = useTravelStore((s) => s.quality);
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  // Html transform scale: panel meant to read at htmlWidth CSS px across `width` units.
  const htmlScale = (width / htmlWidth) * 0.92;
  return (
    <Billboard position={position} follow>
      <mesh material={material}>
        <planeGeometry args={[width, height]} />
      </mesh>
      {html && (
        <Html
          transform
          occlude={quality === "high" && occlude ? "blending" : undefined}
          position={[0, 0, 0.04]}
          scale={htmlScale * 10}
          style={{ width: htmlWidth }}
          zIndexRange={[10, 0]}
        >
          {html}
        </Html>
      )}
      {children}
    </Billboard>
  );
}
