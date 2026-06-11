"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { V_MAX } from "@/lib/flight/constants";
import { FLIGHT_CURVE } from "@/lib/flight/path";

/** Small round sprite so points render as stars, not squares. */
function makeStarTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Parallax-true starfield:
 *  - skybox layer: points on a sphere that follows the camera — zero
 *    parallax, effectively at infinity
 *  - far / mid / near layers scattered along the corridor with increasing
 *    parallax; near dust streaks at speed via stretched line segments
 */

function makeCorridorPoints(count: number, spread: number, seed: number) {
  const positions = new Float32Array(count * 3);
  let s = seed;
  const rand = () => {
    // mulberry32-ish — deterministic so SSR/HMR don't reshuffle
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    FLIGHT_CURVE.getPointAt(rand(), point);
    positions[i * 3] = point.x + (rand() - 0.5) * spread;
    positions[i * 3 + 1] = point.y + (rand() - 0.5) * spread * 0.7;
    positions[i * 3 + 2] = point.z + (rand() - 0.5) * spread;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

function SkyboxStars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const camera = useThree((s) => s.camera);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
        .normalize()
        .multiplyScalar(340);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame(() => {
    // Stars at infinity: the shell rides with the camera, so they never parallax.
    if (ref.current) ref.current.position.copy(camera.position);
  });

  return (
    <points ref={ref} geometry={geometry} raycast={() => null} frustumCulled={false}>
      <pointsMaterial
        size={0.7}
        color="#aab4d8"
        transparent
        opacity={0.85}
        sizeAttenuation={false}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

/** Near dust that stretches into streaks as the ship picks up speed. */
function SpeedLines({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 26;
      const z = -Math.random() * 60 - 4;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - 0.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame(() => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    const g = group.current;
    if (!g) return;
    const speedFrac = Math.min(Math.abs(sim.v) / V_MAX, 1);
    const warp = store.mode === "WARP" && !store.reducedMotion;
    const vis = warp ? 1 : speedFrac;
    g.visible = vis > 0.25;
    if (!g.visible) return;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    // Streak length grows with velocity (warp pegs it).
    g.scale.z = 1 + (warp ? 26 : speedFrac * 9);
    if (matRef.current) {
      matRef.current.opacity = warp ? 0.8 : (speedFrac - 0.25) * 0.7;
    }
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments geometry={geometry} raycast={() => null} frustumCulled={false}>
        <lineBasicMaterial
          ref={matRef}
          color="#cfe0ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </lineSegments>
    </group>
  );
}

export function Starfield({ quality }: { quality: "high" | "low" }) {
  const high = quality === "high";
  const starMap = useMemo(() => makeStarTexture(), []);
  const far = useMemo(() => makeCorridorPoints(high ? 2400 : 1200, 280, 7), [high]);
  const mid = useMemo(() => makeCorridorPoints(high ? 1400 : 700, 150, 23), [high]);
  const near = useMemo(() => makeCorridorPoints(high ? 700 : 300, 70, 51), [high]);

  return (
    <>
      <SkyboxStars count={high ? 1600 : 800} />
      <points geometry={far} raycast={() => null}>
        <pointsMaterial
          map={starMap}
          size={0.5}
          color="#8fa0cf"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <points geometry={mid} raycast={() => null}>
        <pointsMaterial
          map={starMap}
          size={0.32}
          color="#bfd4ff"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={near} raycast={() => null}>
        <pointsMaterial
          map={starMap}
          size={0.16}
          color="#e6eeff"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <SpeedLines count={high ? 240 : 120} />
    </>
  );
}
