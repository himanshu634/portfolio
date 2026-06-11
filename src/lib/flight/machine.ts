/**
 * Flight mode state machine. Every mode change in the app goes through
 * `canTransition` so a stray event (double click, race between autopilot
 * and warp, timer overrun) can never corrupt travel state.
 */
export type FlightMode =
  | "LOADING"
  | "CRUISE"
  | "BRAKING"
  | "ORBIT_INSERT"
  | "ORBIT"
  | "ORBIT_EXIT"
  | "WARP_CHARGE"
  | "WARP"
  | "ARRIVING";

const EDGES: Record<FlightMode, FlightMode[]> = {
  LOADING: ["CRUISE", "ORBIT"],
  CRUISE: ["BRAKING", "WARP_CHARGE"],
  BRAKING: ["CRUISE", "ORBIT_INSERT", "WARP_CHARGE"],
  ORBIT_INSERT: ["ORBIT"],
  ORBIT: ["ORBIT_EXIT", "WARP_CHARGE"],
  ORBIT_EXIT: ["CRUISE"],
  WARP_CHARGE: ["WARP"],
  WARP: ["ARRIVING"],
  ARRIVING: ["BRAKING"],
};

export function canTransition(from: FlightMode, to: FlightMode): boolean {
  return EDGES[from]?.includes(to) ?? false;
}

/** Modes during which user travel input is locked (warp transit). */
export function isInputLocked(mode: FlightMode): boolean {
  return mode === "WARP_CHARGE" || mode === "WARP" || mode === "ARRIVING";
}

/** Modes from which a warp may be requested directly. */
export function canRequestWarp(mode: FlightMode): boolean {
  return mode === "CRUISE" || mode === "BRAKING" || mode === "ORBIT";
}
