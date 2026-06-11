"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";

/**
 * ↑↑↓↓←→←→BA — a rubber duck appears in orbit around the ship.
 * It serves no purpose, which is the purpose. (Konami listener lives in
 * the Experience shell; this renders once store.duck flips.)
 */
export function KonamiDuck() {
  const duck = useTravelStore((s) => s.duck);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const sim = useTravelStore.getState().sim;
    const t = state.clock.elapsedTime;
    g.position.set(
      sim.shipPos.x + Math.cos(t * 0.9) * 4,
      sim.shipPos.y + Math.sin(t * 1.3) * 1.2 + 1.5,
      sim.shipPos.z + Math.sin(t * 0.9) * 4
    );
    g.rotation.y = t * 0.9 + Math.PI / 2;
  });

  if (!duck) return null;

  return (
    <group ref={group} scale={0.6}>
      {/* body */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#ffd83d" roughness={0.4} />
      </mesh>
      {/* head */}
      <mesh position={[0.35, 0.5, 0]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial color="#ffd83d" roughness={0.4} />
      </mesh>
      {/* beak */}
      <mesh position={[0.68, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.25, 10]} />
        <meshStandardMaterial color="#ff8c1a" roughness={0.5} />
      </mesh>
      {/* eyes */}
      {[0.12, -0.12].map((z) => (
        <mesh key={z} position={[0.52, 0.62, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#14121f" />
        </mesh>
      ))}
      {/* tiny helmet, for safety */}
      <mesh position={[0.35, 0.55, 0]}>
        <sphereGeometry args={[0.4, 16, 12]} />
        <meshPhysicalMaterial
          color="#9fdcff"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
