"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
  glowColor?: string;
  rings?: boolean;
  rotationSpeed?: number;
}

function Planet({
  position,
  radius,
  color,
  glowColor,
  rings = false,
  rotationSpeed = 0.05,
}: PlanetProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Cheap rim glow: slightly larger back-side additive shell */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={glowColor ?? color}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2.4, 0, 0.3]}>
          <ringGeometry args={[radius * 1.5, radius * 2.3, 64]} />
          <meshBasicMaterial
            color={glowColor ?? color}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * One distinct backdrop near each waypoint's z-position so every
 * section of the journey has its own scenery.
 */
export function Planets() {
  return (
    <>
      {/* Work section — ringed violet gas giant */}
      <Planet
        position={[-28, 8, -55]}
        radius={9}
        color="#4c3a8c"
        glowColor="#a78bfa"
        rings
        rotationSpeed={0.04}
      />
      {/* Open source section — cyan ice moon */}
      <Planet
        position={[24, -10, -105]}
        radius={5}
        color="#1e4e5f"
        glowColor="#67e8f9"
        rotationSpeed={0.08}
      />
      {/* Writing section — distant amber dwarf */}
      <Planet
        position={[-20, 14, -150]}
        radius={6.5}
        color="#7c4a1d"
        glowColor="#fbbf24"
        rotationSpeed={0.03}
      />
    </>
  );
}
