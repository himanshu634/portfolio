"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import { useTravelStore } from "@/lib/store";
import { F_MAX, F_RETRO_MAX } from "@/lib/flight/constants";
import { makeGlowTexture } from "./nebula";

const HULL_COLOR = "#2a3045";
const ACCENT = "#67e8f9";
const RETRO = "#ffb86b";

function EngineNozzle({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1a1f30" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Procedural ship. Exhaust, glow and engine light all scale with the
 * *simulated* thrust — coasting ships don't glow, burning ships do, and
 * a braking burn fires the forward RCS instead. Newton signs off on all of it.
 */
export function Spaceship({ quality }: { quality: "high" | "low" }) {
  const glowTexture = useMemo(() => makeGlowTexture(ACCENT), []);
  const retroTexture = useMemo(() => makeGlowTexture(RETRO), []);
  const inner = useRef<THREE.Group>(null);
  const exhaustL = useRef<THREE.Mesh>(null);
  const exhaustR = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const retroGlow = useRef<THREE.Sprite>(null);
  const engineLight = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    // Forward burn = thrust along +v; retro burn = brake force or reverse thrust.
    const warp = store.mode === "WARP" || store.mode === "WARP_CHARGE";
    const fwd = warp
      ? 1.2
      : THREE.MathUtils.clamp(
          (sim.appliedForce * Math.sign(sim.v || 1) > 0
            ? Math.abs(sim.appliedForce)
            : 0) / F_MAX,
          0,
          1.2
        );
    const retro = warp
      ? 0
      : THREE.MathUtils.clamp(
          (sim.brakeForce +
            (sim.appliedForce * Math.sign(sim.v || 1) < 0
              ? Math.abs(sim.appliedForce)
              : 0)) /
            F_RETRO_MAX,
          0,
          1
        );

    const flicker = 0.92 + Math.random() * 0.08;
    for (const ref of [exhaustL, exhaustR]) {
      const m = ref.current;
      if (!m) continue;
      m.visible = fwd > 0.04;
      m.scale.set(1, 0.4 + fwd * 1.6 * flicker, 1);
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity =
        2 + fwd * 4;
    }
    if (glow.current) {
      (glow.current.material as THREE.SpriteMaterial).opacity =
        0.15 + fwd * 0.75;
      glow.current.scale.setScalar(1.2 + fwd * 1.4);
    }
    if (retroGlow.current) {
      (retroGlow.current.material as THREE.SpriteMaterial).opacity =
        retro * 0.85;
      retroGlow.current.scale.setScalar(0.8 + retro * 1.2);
    }
    if (engineLight.current) {
      // HDR push so engines join the bloom pass.
      engineLight.current.intensity = 2 + fwd * 9 + retro * 3;
      engineLight.current.color.set(retro > fwd ? RETRO : ACCENT);
    }
  });

  const body = (
    <group ref={inner}>
      {/* Hull */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.45, 2.6, 8, 24]} />
        <meshStandardMaterial color={HULL_COLOR} metalness={0.8} roughness={0.35} />
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
            <meshStandardMaterial color={HULL_COLOR} metalness={0.8} roughness={0.35} />
          </mesh>
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
        <meshStandardMaterial color={HULL_COLOR} metalness={0.8} roughness={0.35} />
      </mesh>
      <EngineNozzle x={-0.45} />
      <EngineNozzle x={0.45} />
      {/* Main exhaust cones — scale with thrust */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh
          key={x}
          ref={i === 0 ? exhaustL : exhaustR}
          position={[x, 0, 2.0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <coneGeometry args={[0.18, 1.0, 14, 1, true]} />
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
      ))}
      {/* Engine glow sprite */}
      <sprite ref={glow} position={[0, 0, 2.2]} scale={[1.4, 1.4, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {/* Forward RCS glow — the visible face of a braking burn */}
      <sprite ref={retroGlow} position={[0, 0, -2.1]} scale={[1, 1, 1]}>
        <spriteMaterial
          map={retroTexture}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <pointLight
        ref={engineLight}
        position={[0, 0, 2]}
        color={ACCENT}
        intensity={4}
        distance={12}
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
      target={inner as React.RefObject<THREE.Group>}
    >
      {body}
    </Trail>
  );
}
