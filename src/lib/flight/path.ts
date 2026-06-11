import * as THREE from "three";

/**
 * The interplanetary flight corridor. The physics sim integrates a scalar
 * arc-length distance `s` along this curve; planets sit just off the path
 * so the corridor skims each planet's orbit ring — orbit insertion is a
 * blend from path point to ring point that starts at distance ~zero.
 */
const UP = new THREE.Vector3(0, 1, 0);

export const FLIGHT_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 2, -45),
    new THREE.Vector3(-12, -3, -95),
    new THREE.Vector3(10, 4, -150),
    new THREE.Vector3(-10, -2, -205),
    new THREE.Vector3(8, 3, -260),
    new THREE.Vector3(-6, -2, -310),
    new THREE.Vector3(0, 0, -350),
  ],
  false,
  "catmullrom",
  0.5
);
FLIGHT_CURVE.arcLengthDivisions = 600;

/** Total corridor length in world units. */
export const PATH_LENGTH = FLIGHT_CURVE.getLength();

/** One sun lights the whole system; every planet shader keys off this. */
export const SUN_POSITION = new THREE.Vector3(140, 70, -170);

export type PlanetId =
  | "terra"
  | "forge"
  | "genuin"
  | "glacius"
  | "comet"
  | "relay";

interface WaypointSpec {
  id: PlanetId;
  label: string;
  frac: number; // fraction of PATH_LENGTH
  radius: number; // planet body radius
  orbitRadius: number; // ship's reading orbit
  brakeRadius: number; // autopilot braking starts here (along-path units)
  mass: number; // relative mass for gravity flybys
  side: 1 | -1; // which side of the corridor the planet sits on
  lift: number; // vertical offset of the planet from the path
}

const SPECS: WaypointSpec[] = [
  { id: "terra",   label: "Terra Persona",    frac: 0.045, radius: 5.0, orbitRadius: 11.0, brakeRadius: 36, mass: 1.0, side: -1, lift: -1.5 },
  { id: "forge",   label: "Forge-9",          frac: 0.22,  radius: 4.2, orbitRadius: 9.5,  brakeRadius: 38, mass: 0.8, side: 1,  lift: 1.5 },
  { id: "genuin",  label: "Genuin Prime",     frac: 0.40,  radius: 8.5, orbitRadius: 17.0, brakeRadius: 46, mass: 3.0, side: -1, lift: 2.5 },
  { id: "glacius", label: "Glacius Commons",  frac: 0.58,  radius: 4.2, orbitRadius: 9.5,  brakeRadius: 38, mass: 0.8, side: 1,  lift: -2.0 },
  { id: "comet",   label: "Comet Scriptor",   frac: 0.76,  radius: 1.6, orbitRadius: 6.5,  brakeRadius: 34, mass: 0.12, side: -1, lift: 1.0 },
  { id: "relay",   label: "Deep Space Relay", frac: 0.94,  radius: 2.4, orbitRadius: 8.5,  brakeRadius: 38, mass: 2.2, side: 1,  lift: 0 },
];

export interface Waypoint {
  id: PlanetId;
  label: string;
  index: number;
  s: number;
  radius: number;
  orbitRadius: number;
  brakeRadius: number;
  mass: number;
  /** Planet center in world space. */
  position: THREE.Vector3;
  /** Orbit basis: ring point(θ) = position + R·(cosθ·e1 + sinθ·e2). θ=0 is on the corridor. */
  e1: THREE.Vector3;
  e2: THREE.Vector3;
  /** Orbit plane normal (e1 × e2) — content rings align to this. */
  normal: THREE.Vector3;
}

function buildWaypoint(spec: WaypointSpec, index: number): Waypoint {
  const s = spec.frac * PATH_LENGTH;
  const u = spec.frac;
  const point = FLIGHT_CURVE.getPointAt(u);
  const tangent = FLIGHT_CURVE.getTangentAt(u);

  const sideDir = new THREE.Vector3()
    .crossVectors(tangent, UP)
    .normalize()
    .multiplyScalar(spec.side);
  sideDir.y += spec.lift / spec.orbitRadius;
  sideDir.normalize();

  const position = point.clone().addScaledVector(sideDir, spec.orbitRadius);

  // Radial unit vector at the insertion point (planet -> corridor).
  const e1 = point.clone().sub(position).normalize();
  // Travel direction on the ring at insertion ≈ corridor direction.
  const e2 = tangent
    .clone()
    .addScaledVector(e1, -tangent.dot(e1))
    .normalize();
  const normal = new THREE.Vector3().crossVectors(e1, e2).normalize();

  return {
    id: spec.id,
    label: spec.label,
    index,
    s,
    radius: spec.radius,
    orbitRadius: spec.orbitRadius,
    brakeRadius: spec.brakeRadius,
    mass: spec.mass,
    position,
    e1,
    e2,
    normal,
  };
}

export const WAYPOINTS: Waypoint[] = SPECS.map(buildWaypoint);

export const WAYPOINT_BY_ID: Record<PlanetId, Waypoint> = Object.fromEntries(
  WAYPOINTS.map((w) => [w.id, w])
) as Record<PlanetId, Waypoint>;

/** Arc-length parameterized point lookup. Writes into `out`, no allocation. */
export function getPointAtS(s: number, out: THREE.Vector3): THREE.Vector3 {
  const u = THREE.MathUtils.clamp(s / PATH_LENGTH, 0, 1);
  return FLIGHT_CURVE.getPointAt(u, out);
}

export function getTangentAtS(s: number, out: THREE.Vector3): THREE.Vector3 {
  const u = THREE.MathUtils.clamp(s / PATH_LENGTH, 0.0001, 0.9999);
  return FLIGHT_CURVE.getTangentAt(u, out);
}

/** Ring point for a waypoint orbit. Writes into `out`. */
export function getOrbitPoint(
  w: Waypoint,
  theta: number,
  out: THREE.Vector3
): THREE.Vector3 {
  const c = Math.cos(theta);
  const sn = Math.sin(theta);
  return out
    .copy(w.position)
    .addScaledVector(w.e1, w.orbitRadius * c)
    .addScaledVector(w.e2, w.orbitRadius * sn);
}

/** Ring tangent (travel direction for increasing θ). Writes into `out`. */
export function getOrbitTangent(
  w: Waypoint,
  theta: number,
  out: THREE.Vector3
): THREE.Vector3 {
  const c = Math.cos(theta);
  const sn = Math.sin(theta);
  return out
    .set(0, 0, 0)
    .addScaledVector(w.e1, -sn)
    .addScaledVector(w.e2, c)
    .normalize();
}

export function isMobileViewport(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches
  );
}
