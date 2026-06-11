"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { WAYPOINTS } from "@/lib/flight/path";
import { PLANET_THEMES } from "@/lib/content";

export function makeGlowTexture(color: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  const c = new THREE.Color(color);
  gradient.addColorStop(0, `rgba(${c.r * 255}, ${c.g * 255}, ${c.b * 255}, 0.55)`);
  gradient.addColorStop(0.4, `rgba(${c.r * 255}, ${c.g * 255}, ${c.b * 255}, 0.18)`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Region-graded nebulae: each planet's neighborhood gets backdrop sprites
 * in its own palette, so flying the corridor reads as crossing regions.
 */
export function Nebula() {
  const sprites = useMemo(() => {
    const rng = (min: number, max: number) => min + Math.random() * (max - min);
    const all: {
      texture: THREE.CanvasTexture;
      position: [number, number, number];
      scale: number;
      opacity: number;
    }[] = [];
    for (const w of WAYPOINTS) {
      const texture = makeGlowTexture(PLANET_THEMES[w.id].nebula);
      for (let i = 0; i < 2; i++) {
        all.push({
          texture,
          position: [
            w.position.x + rng(-60, 60),
            w.position.y + rng(-25, 30),
            w.position.z - rng(50, 110),
          ],
          scale: rng(50, 95),
          opacity: rng(0.2, 0.4),
        });
      }
    }
    return all;
  }, []);

  return (
    <>
      {sprites.map((s, i) => (
        <sprite
          key={i}
          position={s.position}
          scale={[s.scale, s.scale, 1]}
          raycast={() => null}
        >
          <spriteMaterial
            map={s.texture}
            transparent
            opacity={s.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </>
  );
}

const tmpColor = new THREE.Color();
const tmpColor2 = new THREE.Color();

/** Lerps fog + background toward the nearest region's palette. */
export function SceneMood() {
  const scene = useThree((s) => s.scene);
  const current = useRef(new THREE.Color("#050510"));

  useFrame((_, delta) => {
    const sim = useTravelStore.getState().sim;
    let nearest = WAYPOINTS[0];
    let best = Infinity;
    for (const w of WAYPOINTS) {
      const d = Math.abs(w.s - sim.s);
      if (d < best) {
        best = d;
        nearest = w;
      }
    }
    // Blend toward the region fog color as the ship gets close.
    const influence = THREE.MathUtils.clamp(1 - best / 80, 0, 1);
    tmpColor.set("#050510");
    tmpColor2.set(PLANET_THEMES[nearest.id].fog);
    tmpColor.lerp(tmpColor2, influence * 0.85);
    current.current.lerp(tmpColor, 1 - Math.exp(-1.2 * delta));
    if (scene.fog) scene.fog.color.copy(current.current);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(current.current);
    }
  });

  return null;
}
