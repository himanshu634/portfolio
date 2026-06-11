import * as THREE from "three";

/**
 * Scroll ranges (0–1 of total page scroll) for each stop of the voyage.
 * The HTML sections and the 3D scene both key off these so they stay in sync.
 */
export const WAYPOINTS = [
  { id: "intro", label: "Launch", range: [0.0, 0.18] },
  { id: "work", label: "Work", range: [0.2, 0.45] },
  { id: "oss", label: "Open Source", range: [0.48, 0.65] },
  { id: "writing", label: "Writing", range: [0.68, 0.82] },
  { id: "contact", label: "Contact", range: [0.85, 1.0] },
] as const;

export type WaypointId = (typeof WAYPOINTS)[number]["id"];

/**
 * Flight path of the ship: gently snakes in x/y while travelling into -z.
 * Camera chases the ship along this curve as the user scrolls.
 */
export const SHIP_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(6, 1.5, -25),
    new THREE.Vector3(-7, -2, -60),
    new THREE.Vector3(5, 2.5, -95),
    new THREE.Vector3(-5, -1.5, -130),
    new THREE.Vector3(2, 0, -160),
    new THREE.Vector3(0, 0, -185),
  ],
  false,
  "catmullrom",
  0.5
);

/** Current page scroll progress in [0, 1]. Safe to call every frame. */
export function getScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
}

export function isMobileViewport(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches
  );
}
