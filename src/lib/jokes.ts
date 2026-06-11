import type { PlanetId } from "@/lib/flight/path";

/** NASA-mission-log-meets-standup. Jokes live in the chrome, never the content. */

export const LOADING_LINES = [
  "Reticulating splines… in zero gravity",
  "Convincing photons to behave",
  "Calculating trajectory (ignoring three-body problem, as is tradition)",
  "Compressing 13.8 billion years of history…",
  "Polishing the cockpit glass from the inside",
  "Negotiating with Kepler about the moon schedules",
  "Untangling the seatbelt (it's a five-point harness)",
  "Warming up retro-thrusters that technically shouldn't exist",
];

export const ADVISORIES: Record<PlanetId, string> = {
  terra:
    "Terra Persona — Travel advisory: locals are friendly and ship exactly one engineer.",
  forge:
    "Forge-9 — Travel advisory: 0% breathable atmosphere, 100% deployable code.",
  genuin:
    "Genuin Prime — Travel advisory: moons may contain production traffic. Do not feed the SDKs.",
  glacius:
    "Glacius Commons — Travel advisory: everything here is transparent. It's open source, that's the point.",
  comet:
    "Comet Scriptor — Travel advisory: orbits the wrong way on purpose. First drafts always do.",
  relay:
    "Deep Space Relay — Travel advisory: transmissions answered within 1–2 business light-years.",
};

export const SCROLL_HINT =
  "Scroll to apply thrust. Objects in motion stay in motion. That's on Newton, not me.";

export const RETRO_THRUSTER_NOTE =
  "Space has no drag. The gentle slowdown is retro-thrusters — we checked with Newton, he's fine with it.";

export const SILENCE_NOTE =
  "No engine audio. Space is rudely silent and we respect that.";

export const WARP_SPOOL_LINE =
  "Spooling FTL drive… please keep arms inside the spacecraft.";

export const DO_NOT_PRESS_LABEL = "DO NOT PRESS";

export const MISSION_LOG_LABEL = "Mission Log — for travelers who get space-sick";

/** Velocity readout cycles through increasingly unhelpful units. */
const C_LIGHT = 299792458;
export const SPEED_UNITS: {
  label: (v: number) => string;
}[] = [
  {
    label: (v) =>
      `${((v * 1000) / C_LIGHT) * 100 < 0.001 ? ((v * 1000 * 100) / C_LIGHT).toExponential(1) : (((v * 1000) / C_LIGHT) * 100).toFixed(7)}% the speed of light. Patience.`,
  },
  { label: (v) => `${(v * 3.6).toFixed(0)} km/h, cosmically speaking` },
  { label: (v) => `${(v * 5.2).toFixed(1)} giraffes/sec` },
  { label: (v) => `${(v * 38).toFixed(0)} bananas/sec (SI-adjacent)` },
  { label: (v) => `${(v * 0.013).toFixed(3)} football fields/frame` },
];

export const NOT_FOUND_LINE =
  "You've drifted into uncharted space. Even Voyager knows where it is.";
