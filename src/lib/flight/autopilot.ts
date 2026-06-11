import {
  BRAKE_MARGIN,
  F_RETRO_MAX,
  SHIP_MASS,
} from "./constants";
import { WAYPOINTS, type Waypoint, type PlanetId } from "./path";

/**
 * Waypoint the ship is currently approaching: ahead of the direction of
 * motion and inside its braking radius. `exclude` suppresses the planet
 * we just departed so orbit exit doesn't instantly re-capture.
 */
export function findApproach(
  s: number,
  v: number,
  exclude: PlanetId | null
): Waypoint | null {
  if (Math.abs(v) < 0.5) return null;
  const dir = Math.sign(v);
  let best: Waypoint | null = null;
  let bestDist = Infinity;
  for (const w of WAYPOINTS) {
    if (w.id === exclude) continue;
    const d = (w.s - s) * dir;
    if (d > 0 && d < w.brakeRadius && d < bestDist) {
      best = w;
      bestDist = d;
    }
  }
  return best;
}

/**
 * Retro-thruster force for a deceleration burn into `w`. Computed from the
 * kinematics (a = v² / 2d) with margin — a force fed to the integrator,
 * never a tween. Inside the inner third of the burn the thruster cap is
 * doubled so capture is guaranteed unless the user actively fights it.
 */
export function brakingForce(s: number, v: number, w: Waypoint): number {
  const d = Math.abs(w.s - s);
  if (d < 1e-3) return -Math.sign(v) * F_RETRO_MAX;
  const required = (v * v) / (2 * d);
  const cap = d < w.brakeRadius * 0.33 ? F_RETRO_MAX * 2 : F_RETRO_MAX;
  return -Math.sign(v) * Math.min(SHIP_MASS * required * BRAKE_MARGIN, cap);
}

/** True once the ship has drifted back outside a waypoint's brake zone. */
export function isClearOf(s: number, w: Waypoint): boolean {
  return Math.abs(w.s - s) > w.brakeRadius * 1.05;
}
