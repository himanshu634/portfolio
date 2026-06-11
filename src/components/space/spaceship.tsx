"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Trail } from "@react-three/drei";
import { makeGlowTexture } from "./nebula";

const HULL_COLOR = "#2a3045";
const ACCENT = "#67e8f9";

function EngineNozzle({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1a1f30" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Exhaust cone reads as bloom thanks to emissive + additive glow sprite */}
      <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.7, 16, 1, true]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={3}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Stylized ship built entirely from primitives — no model assets.
 * The parent group is positioned/oriented along the flight path by JourneyRig.
 */
export function Spaceship({
  groupRef,
  quality,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  quality: "high" | "low";
}) {
  const glowTexture = useMemo(() => makeGlowTexture(ACCENT), []);

  const body = (
    <group ref={groupRef}>
      {/* Hull */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.45, 2.6, 8, 24]} />
        <meshStandardMaterial
          color={HULL_COLOR}
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>
      {/* Cockpit dome */}
      <mesh position={[0, 0.32, -0.7]}>
        <sphereGeometry args={[0.34, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={ACCENT}
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          transparent
          opacity={0.7}
          emissive={ACCENT}
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Swept wings */}
      {[-1, 1].map((side) => (
        <group key={side} rotation={[0, side * -0.35, side * -0.12]}>
          <mesh position={[side * 1.15, -0.08, 0.55]}>
            <boxGeometry args={[1.9, 0.07, 0.85]} />
            <meshStandardMaterial
              color={HULL_COLOR}
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
          {/* Accent edge stripe on wing tip */}
          <mesh position={[side * 2.05, -0.08, 0.55]}>
            <boxGeometry args={[0.08, 0.09, 0.87]} />
            <meshStandardMaterial
              color={ACCENT}
              emissive={ACCENT}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
      {/* Dorsal fin */}
      <mesh position={[0, 0.45, 1.0]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.06, 0.7, 0.8]} />
        <meshStandardMaterial
          color={HULL_COLOR}
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>
      {/* Engines */}
      <EngineNozzle x={-0.45} />
      <EngineNozzle x={0.45} />
      {/* Engine glow */}
      <sprite position={[0, 0, 2.1]} scale={[1.8, 1.8, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <pointLight
        position={[0, 0, 2]}
        color={ACCENT}
        intensity={6}
        distance={10}
        decay={2}
      />
    </group>
  );

  if (quality === "low") return body;

  return (
    <Trail
      width={1.5}
      length={6}
      color={ACCENT}
      attenuation={(w) => w * w}
      target={groupRef as React.RefObject<THREE.Group>}
    >
      {body}
    </Trail>
  );
}
