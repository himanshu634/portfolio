"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

/**
 * Two layers of stars: drei's far shell for density, plus a near-field
 * additive Points cloud spread along the flight path for parallax as
 * the camera travels into -z. The near layer is skipped on mobile.
 */
export function Starfield({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <Stars
        radius={120}
        depth={80}
        count={quality === "high" ? 6000 : 3000}
        factor={4}
        saturation={0.4}
        fade
        speed={0.5}
      />
      {quality === "high" && <NearStars />}
    </>
  );
}

function NearStars() {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = 20 - Math.random() * 240;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.02) * 0.02;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.18}
        color="#bfd4ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
