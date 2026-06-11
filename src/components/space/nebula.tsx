"use client";

import { useMemo } from "react";
import * as THREE from "three";

const NEBULA_COLORS = ["#67e8f9", "#a78bfa", "#e879f9", "#6366f1"];

function makeGlowTexture(color: string): THREE.CanvasTexture {
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
 * Soft additive gradient sprites placed far behind the flight path —
 * reads as distant nebulae without any texture assets or postprocessing.
 */
export function Nebula() {
  const sprites = useMemo(() => {
    const textures = NEBULA_COLORS.map(makeGlowTexture);
    const rng = (min: number, max: number) => min + Math.random() * (max - min);
    return Array.from({ length: 9 }, (_, i) => ({
      texture: textures[i % textures.length],
      position: [
        rng(-70, 70),
        rng(-35, 35),
        10 - i * 28 - rng(0, 20),
      ] as [number, number, number],
      scale: rng(40, 85),
      opacity: rng(0.25, 0.5),
    }));
  }, []);

  return (
    <>
      {sprites.map((s, i) => (
        <sprite key={i} position={s.position} scale={[s.scale, s.scale, 1]}>
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

export { makeGlowTexture };
