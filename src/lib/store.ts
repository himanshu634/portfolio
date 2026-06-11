"use client";

import { create } from "zustand";
import * as THREE from "three";
import {
  canTransition,
  canRequestWarp,
  type FlightMode,
} from "@/lib/flight/machine";
import { FOV_REST } from "@/lib/flight/constants";
import type { PlanetId } from "@/lib/flight/path";

/**
 * Transient per-frame simulation state. Mutated directly by the flight
 * controller every physics substep — never via zustand `set`, so the React
 * tree doesn't re-render at 120Hz. HUD widgets poll it on a throttled rAF.
 */
export interface SimState {
  s: number; // arc-length along the corridor
  v: number; // signed velocity along the corridor
  throttle: number; // smoothed burn force from scroll input
  inputDelta: number; // raw scroll delta accumulated since last frame
  keyHold: number; // -1 | 0 | 1 from held keys
  appliedForce: number; // net commanded force (for engine FX/sway)
  brakeForce: number; // retro-thruster force (for camera pitch + RCS FX)
  latX: number;
  latY: number;
  latVX: number;
  latVY: number;
  orbitTheta: number;
  orbitAngV: number;
  orbitMaxTheta: number; // furthest reading angle reached
  insertBlend: number; // 0 = on corridor, 1 = on orbit ring
  escapeCharge: number; // seconds spent fighting the autopilot burn
  contentReveal: number; // 0..1 progressive reveal within orbit
  fov: number;
  fovV: number;
  warpT: number; // clock inside timed modes (frame-clock based)
  warpDuration: number;
  whiteout: number; // 0..1 white overlay opacity
  rollAngle: number; // barrel-roll easter egg, integrated + damped
  rollVel: number;
  // Pose computed by the flight controller, consumed by ship + camera rigs.
  shipPos: THREE.Vector3;
  shipDir: THREE.Vector3;
}

function createSim(): SimState {
  return {
    s: 0,
    v: 0,
    throttle: 0,
    inputDelta: 0,
    keyHold: 0,
    appliedForce: 0,
    brakeForce: 0,
    latX: 0,
    latY: 0,
    latVX: 0,
    latVY: 0,
    orbitTheta: 0,
    orbitAngV: 0,
    orbitMaxTheta: 0,
    insertBlend: 0,
    escapeCharge: 0,
    contentReveal: 0,
    fov: FOV_REST,
    fovV: 0,
    warpT: 0,
    warpDuration: 0,
    whiteout: 0,
    rollAngle: 0,
    rollVel: 0,
    shipPos: new THREE.Vector3(),
    shipDir: new THREE.Vector3(0, 0, -1),
  };
}

export type Quality = "high" | "low";

interface TravelState {
  mode: FlightMode;
  currentPlanet: PlanetId | null; // planet we are orbiting (or inserting into)
  targetPlanet: PlanetId | null; // warp destination
  queuedPlanet: PlanetId | null; // clicked during transit, consumed once
  departedPlanet: PlanetId | null; // suppress instant re-brake after orbit exit
  quality: Quality;
  reducedMotion: boolean;
  missionLog: boolean;
  loaded: boolean;
  duck: boolean; // konami code rubber duck
  advisory: { text: string; key: number } | null;
  sim: SimState;
  /** Guarded mode change — invalid edges are ignored, never throw. */
  transition: (to: FlightMode, patch?: Partial<TravelState>) => boolean;
  requestWarp: (id: PlanetId) => void;
  consumeQueuedWarp: () => PlanetId | null;
  setMissionLog: (on: boolean) => void;
  setAdvisory: (text: string) => void;
  spawnDuck: () => void;
}

export const useTravelStore = create<TravelState>((set, get) => ({
  mode: "LOADING",
  currentPlanet: null,
  targetPlanet: null,
  queuedPlanet: null,
  departedPlanet: null,
  quality: "high",
  reducedMotion: false,
  missionLog: false,
  loaded: false,
  duck: false,
  advisory: null,
  sim: createSim(),

  transition: (to, patch) => {
    const { mode } = get();
    if (!canTransition(mode, to)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[flight] blocked transition ${mode} -> ${to}`);
      }
      return false;
    }
    set({ mode: to, ...patch });
    return true;
  },

  requestWarp: (id) => {
    const state = get();
    if (state.missionLog) return;
    // Mid-transit clicks queue exactly one destination, consumed on arrival.
    if (!canRequestWarp(state.mode)) {
      set({ queuedPlanet: id });
      return;
    }
    if (state.mode === "ORBIT" && state.currentPlanet === id) return;
    state.transition("WARP_CHARGE", {
      targetPlanet: id,
      currentPlanet: null,
      departedPlanet: null,
    });
  },

  consumeQueuedWarp: () => {
    const id = get().queuedPlanet;
    if (id) set({ queuedPlanet: null });
    return id;
  },

  setMissionLog: (on) => set({ missionLog: on }),

  setAdvisory: (text) => set({ advisory: { text, key: Date.now() } }),

  spawnDuck: () => set({ duck: true }),
}));

/** Imperative accessor for non-React modules (input handlers, integrator). */
export const travelStore = useTravelStore;
