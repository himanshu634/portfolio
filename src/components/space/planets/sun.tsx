"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createSunMaterial } from "@/shaders/materials";
import { SUN_POSITION } from "@/lib/flight/path";
import { makeGlowTexture } from "../nebula";

/**
 * The single light source of the whole system. Every planet's terminator
 * faces it because their shaders share its position uniform; this point
 * light only has to carry the ship and other standard materials.
 */
export function Sun() {
  const material = useMemo(() => createSunMaterial(), []);
  const corona = useMemo(() => makeGlowTexture("#ffb347"), []);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <group position={SUN_POSITION}>
      <mesh ref={ref} material={material} raycast={() => null}>
        <sphereGeometry args={[18, 48, 24]} />
      </mesh>
      <sprite scale={[110, 110, 1]} raycast={() => null}>
        <spriteMaterial
          map={corona}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <pointLight color="#ffd9a0" intensity={2.2} distance={0} decay={0} />
    </group>
  );
}
