"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTravelStore } from "@/lib/store";
import * as C from "@/lib/flight/constants";
import {
  brakingForce,
  findApproach,
  isClearOf,
} from "@/lib/flight/autopilot";
import {
  getOrbitPoint,
  getOrbitTangent,
  getPointAtS,
  getTangentAtS,
  PATH_LENGTH,
  WAYPOINT_BY_ID,
  WAYPOINTS,
  type PlanetId,
  type Waypoint,
} from "@/lib/flight/path";
import { ADVISORIES } from "@/lib/jokes";

const UP = new THREE.Vector3(0, 1, 0);
// Module-scope scratch — the sim allocates nothing per frame.
const tmpPoint = new THREE.Vector3();
const tmpTangent = new THREE.Vector3();
const tmpN1 = new THREE.Vector3();
const tmpN2 = new THREE.Vector3();
const tmpRing = new THREE.Vector3();
const tmpRingDir = new THREE.Vector3();
const tmpToPlanet = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

function parseSpawn(): PlanetId {
  if (typeof window === "undefined") return "terra";
  const at = new URLSearchParams(window.location.search).get("at");
  return at && at in WAYPOINT_BY_ID ? (at as PlanetId) : "terra";
}

/**
 * The one owner of the physics simulation. Scroll/keys/touch deposit raw
 * input into `sim.inputDelta`; this component integrates thrust -> velocity
 * -> position at a fixed 120Hz timestep (decoupled from render framerate)
 * and drives every mode transition through the guarded state machine.
 */
export function FlightController() {
  const acc = useRef(0);
  const approach = useRef<Waypoint | null>(null);
  const posePlanet = useRef<Waypoint | null>(null);
  const arrivingFrames = useRef(0);
  const gravX = useRef(0);
  const gravY = useRef(0);

  // Spawn: arrive pre-parked in orbit (deep links via ?at=<planet>).
  useEffect(() => {
    const store = useTravelStore.getState();
    if (store.mode !== "LOADING") return;
    const w = WAYPOINT_BY_ID[parseSpawn()];
    const sim = store.sim;
    sim.s = w.s;
    sim.v = 0;
    sim.insertBlend = 1;
    sim.orbitTheta = 0;
    sim.orbitAngV = C.ORBIT_BASE_DRIFT;
    sim.orbitMaxTheta = 0;
    posePlanet.current = w;
    store.transition("ORBIT", { currentPlanet: w.id });
  }, []);

  useFrame((_, delta) => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    const mode = store.mode;
    if (store.missionLog) return; // sim pauses while reading the log

    const dtFrame = Math.min(delta, C.MAX_FRAME_DELTA);

    // ---- Input -> throttle (once per frame; clamped so a violent fling
    // becomes a saturated burn, never a teleport). Locked during transit.
    const locked =
      mode === "WARP_CHARGE" || mode === "WARP" || mode === "ARRIVING";
    const input = locked ? 0 : sim.inputDelta;
    sim.inputDelta = 0;
    sim.throttle = THREE.MathUtils.clamp(
      sim.throttle + input * C.SCROLL_GAIN,
      -C.F_MAX,
      C.F_MAX
    );
    const keyForce = locked ? 0 : sim.keyHold * C.F_KEY;

    // ---- Gravity field (evaluated once per frame, applied in substeps).
    gravX.current = 0;
    gravY.current = 0;
    if ((mode === "CRUISE" || mode === "BRAKING") && sim.insertBlend < 0.01) {
      getPointAtS(sim.s, tmpPoint);
      getTangentAtS(sim.s, tmpTangent);
      tmpN1.crossVectors(tmpTangent, UP).normalize();
      tmpN2.crossVectors(tmpN1, tmpTangent).normalize();
      for (const w of WAYPOINTS) {
        tmpToPlanet.copy(w.position).sub(tmpPoint);
        const d = tmpToPlanet.length();
        if (d > 8 && d < 70) {
          const a = Math.min(
            (C.GRAVITY_G * w.mass) / (d * d),
            C.GRAVITY_MAX_ACCEL
          );
          tmpToPlanet.normalize();
          gravX.current += a * tmpToPlanet.dot(tmpN1);
          gravY.current += a * tmpToPlanet.dot(tmpN2);
        }
      }
    }

    // ---- Fixed-timestep integration.
    acc.current += dtFrame;
    let steps = 0;
    while (acc.current >= C.DT && steps < C.MAX_SUBSTEPS) {
      stepSim(sim, mode, keyForce);
      acc.current -= C.DT;
      steps++;
    }
    if (steps >= C.MAX_SUBSTEPS) acc.current = 0; // drop time, never spiral

    // ---- Per-frame mode logic / transitions.
    runModeLogic(store, dtFrame);

    // ---- Whiteout decay (after the 2-frame hard cut).
    if (mode !== "WARP" && sim.whiteout > 0 && arrivingFrames.current <= 0) {
      sim.whiteout = Math.max(0, sim.whiteout - dtFrame * 3.5);
    }

    // ---- Content reveal eases toward the orbit-progress target.
    const revealTarget =
      mode === "ORBIT" || mode === "ORBIT_INSERT"
        ? THREE.MathUtils.clamp(
            sim.orbitMaxTheta / C.ORBIT_FULL_REVEAL + 0.12,
            0,
            1
          )
        : 0;
    sim.contentReveal = THREE.MathUtils.damp(
      sim.contentReveal,
      revealTarget,
      3,
      dtFrame
    );

    computePose(store, dtFrame);
  });

  function stepSim(
    sim: ReturnType<typeof useTravelStore.getState>["sim"],
    mode: string,
    keyForce: number
  ) {
    const dt = C.DT;
    sim.throttle *= Math.exp(-C.THROTTLE_DECAY * dt);

    if (mode === "ORBIT") {
      // Angular analogue of the linear sim: thrust torques the orbit.
      const torque =
        (sim.throttle + keyForce) * C.ORBIT_TORQUE_GAIN;
      const drift = C.ORBIT_BASE_DRIFT;
      sim.orbitAngV +=
        (torque - C.ORBIT_DRAG * (sim.orbitAngV - drift)) * dt;
      sim.orbitAngV = THREE.MathUtils.clamp(
        sim.orbitAngV,
        -C.ORBIT_ANGV_MAX,
        C.ORBIT_ANGV_MAX
      );
      sim.orbitTheta += sim.orbitAngV * dt;
      sim.orbitMaxTheta = Math.max(sim.orbitMaxTheta, sim.orbitTheta);
      sim.appliedForce = sim.throttle + keyForce;
      sim.brakeForce = 0;
    } else if (
      mode === "CRUISE" ||
      mode === "BRAKING" ||
      mode === "ORBIT_EXIT" ||
      mode === "ORBIT_INSERT"
    ) {
      let F = sim.throttle + keyForce;
      sim.appliedForce = F;
      sim.brakeForce = 0;
      if (mode === "BRAKING" && approach.current) {
        const brake = brakingForce(sim.s, sim.v, approach.current);
        sim.brakeForce = Math.abs(brake);
        F += brake;
      }
      // "Retro-thrusters." Real space has no drag; ours is unionized.
      F += -C.DRAG_LINEAR * sim.v - C.DRAG_QUAD * sim.v * Math.abs(sim.v);
      sim.v += (F / C.SHIP_MASS) * dt;
      sim.s += sim.v * dt;
      if (sim.s < 2) {
        sim.s = 2;
        sim.v = Math.max(0, sim.v);
      } else if (sim.s > PATH_LENGTH - 2) {
        sim.s = PATH_LENGTH - 2;
        sim.v = Math.min(0, sim.v);
      }
      if (mode === "ORBIT_INSERT") {
        sim.orbitTheta += sim.orbitAngV * dt;
        sim.orbitMaxTheta = Math.max(sim.orbitMaxTheta, sim.orbitTheta);
      }
      // Lateral: gravity pull vs. corridor-recentering spring, hard capped.
      const k = C.LATERAL_SPRING;
      const c = 2 * Math.sqrt(k);
      sim.latVX += (gravX.current - k * sim.latX - c * sim.latVX) * dt;
      sim.latVY += (gravY.current - k * sim.latY - c * sim.latVY) * dt;
      sim.latX = THREE.MathUtils.clamp(
        sim.latX + sim.latVX * dt,
        -C.LATERAL_MAX,
        C.LATERAL_MAX
      );
      sim.latY = THREE.MathUtils.clamp(
        sim.latY + sim.latVY * dt,
        -C.LATERAL_MAX,
        C.LATERAL_MAX
      );
    } else {
      sim.appliedForce = mode === "WARP_CHARGE" || mode === "WARP" ? C.F_MAX : 0;
      sim.brakeForce = 0;
    }

    // Barrel-roll easter egg: angular momentum with damping and a pendulum
    // restoring force so the roll settles back to wings-level on its own.
    if (Math.abs(sim.rollVel) > 1e-4 || Math.abs(sim.rollAngle) > 1e-3) {
      sim.rollVel +=
        (-Math.sin(sim.rollAngle) * 2.5 - C.ROLL_DAMP * sim.rollVel) * dt;
      sim.rollAngle += sim.rollVel * dt;
      if (Math.abs(sim.rollVel) < 0.02 && Math.abs(Math.sin(sim.rollAngle)) < 0.02) {
        sim.rollAngle = 0;
        sim.rollVel = 0;
      }
    }
  }

  function runModeLogic(
    store: ReturnType<typeof useTravelStore.getState>,
    dt: number
  ) {
    const sim = store.sim;
    const mode = store.mode;

    if (mode === "CRUISE") {
      // Clear the "just departed" flag once we're out of its brake zone.
      if (store.departedPlanet) {
        const dep = WAYPOINT_BY_ID[store.departedPlanet];
        if (isClearOf(sim.s, dep)) {
          useTravelStore.setState({ departedPlanet: null });
        }
      }
      const w = findApproach(sim.s, sim.v, store.departedPlanet);
      if (w) {
        approach.current = w;
        sim.escapeCharge = 0;
        store.transition("BRAKING");
      }
    } else if (mode === "BRAKING") {
      const w = approach.current;
      if (!w) {
        store.transition("CRUISE");
        return;
      }
      const d = Math.abs(w.s - sim.s);
      // Capture: close and slow -> orbit insertion.
      if (d < C.CAPTURE_DISTANCE && Math.abs(sim.v) < C.V_ORBIT_CAPTURE) {
        posePlanet.current = w;
        sim.orbitTheta = 0;
        sim.orbitMaxTheta = 0;
        sim.orbitAngV = sim.v / w.orbitRadius;
        sim.escapeCharge = 0;
        store.transition("ORBIT_INSERT", {
          currentPlanet: w.id,
          targetPlanet: null,
        });
        return;
      }
      // Fighting the burn with sustained same-direction thrust = flyby.
      const fighting =
        Math.sign(sim.appliedForce) === Math.sign(sim.v) &&
        Math.abs(sim.appliedForce) > C.F_MAX * 0.55;
      sim.escapeCharge = fighting ? sim.escapeCharge + dt : 0;
      const passed = Math.sign(w.s - sim.s) !== Math.sign(sim.v) && d > C.CAPTURE_DISTANCE;
      if (sim.escapeCharge > C.ESCAPE_THRUST_TIME || passed || Math.abs(sim.v) < 0.05 && d > w.brakeRadius * 0.5) {
        approach.current = null;
        store.transition("CRUISE", { departedPlanet: w.id });
      }
    } else if (mode === "ORBIT_INSERT") {
      sim.insertBlend = THREE.MathUtils.damp(
        sim.insertBlend,
        1,
        C.ORBIT_INSERT_RATE,
        dt
      );
      sim.v *= Math.exp(-2 * dt);
      sim.latX *= Math.exp(-3 * dt);
      sim.latY *= Math.exp(-3 * dt);
      if (sim.insertBlend > 0.99) {
        sim.insertBlend = 1;
        store.transition("ORBIT");
        onOrbitReached(store);
      }
    } else if (mode === "ORBIT") {
      const w = posePlanet.current;
      if (!w) return;
      // Forward overrun past full reveal -> depart; reversing -> depart back.
      const exitFwd =
        sim.orbitTheta > C.ORBIT_FULL_REVEAL + C.ORBIT_EXIT_OVERRUN &&
        sim.orbitAngV > 0.22;
      const exitBack = sim.orbitTheta < -0.5 && sim.orbitAngV < -0.12;
      if (exitFwd || exitBack) {
        sim.s = w.s;
        sim.v =
          Math.sign(sim.orbitAngV) *
          Math.max(Math.abs(sim.orbitAngV) * w.orbitRadius, 7);
        store.transition("ORBIT_EXIT", { currentPlanet: null });
        useTravelStore.setState({ departedPlanet: w.id });
      }
    } else if (mode === "ORBIT_EXIT") {
      sim.insertBlend = THREE.MathUtils.damp(
        sim.insertBlend,
        0,
        C.ORBIT_INSERT_RATE,
        dt
      );
      if (sim.insertBlend < 0.01) {
        sim.insertBlend = 0;
        posePlanet.current = null;
        approach.current = null;
        store.transition("CRUISE");
      }
    } else if (mode === "WARP_CHARGE") {
      sim.warpT += dt;
      if (sim.warpT >= C.WARP_CHARGE_TIME) {
        const target = store.targetPlanet
          ? WAYPOINT_BY_ID[store.targetPlanet]
          : null;
        const dist = target ? Math.abs(target.s - sim.s) : PATH_LENGTH / 2;
        const duration = store.reducedMotion
          ? C.REDUCED_WARP_TIME
          : THREE.MathUtils.lerp(
              C.WARP_MIN_TIME,
              C.WARP_MAX_TIME,
              Math.min(dist / PATH_LENGTH, 1)
            );
        sim.warpT = 0;
        sim.warpDuration = duration;
        store.transition("WARP");
      }
    } else if (mode === "WARP") {
      sim.warpT += dt;
      const overrun = sim.warpT > sim.warpDuration + C.WARP_TIMEOUT_GRACE;
      if (sim.warpT >= sim.warpDuration || overrun) {
        const target = store.targetPlanet
          ? WAYPOINT_BY_ID[store.targetPlanet]
          : WAYPOINTS[0];
        // Exit moving: drop onto the corridor short of the waypoint with
        // carried velocity — arrival is a real braking burn, not a fade-in.
        sim.s = Math.max(2, target.s - target.brakeRadius * 0.8);
        sim.v = C.V_ARRIVAL;
        sim.throttle = 0;
        sim.insertBlend = 0;
        sim.latX = sim.latY = sim.latVX = sim.latVY = 0;
        sim.whiteout = 1;
        sim.warpT = 0;
        arrivingFrames.current = C.WHITEOUT_FRAMES;
        posePlanet.current = null;
        // Fonts swap under the white flash — typography signals "new world".
        if (typeof document !== "undefined" && store.targetPlanet) {
          document.body.dataset.planet = store.targetPlanet;
        }
        store.transition("ARRIVING");
      }
    } else if (mode === "ARRIVING") {
      arrivingFrames.current--;
      if (arrivingFrames.current <= 0) {
        const target = store.targetPlanet
          ? WAYPOINT_BY_ID[store.targetPlanet]
          : WAYPOINTS[0];
        approach.current = target;
        sim.escapeCharge = 0;
        store.transition("BRAKING");
      }
    }
  }

  function onOrbitReached(store: ReturnType<typeof useTravelStore.getState>) {
    const id = store.currentPlanet;
    if (!id) return;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?at=${id}`);
      document.body.dataset.planet = id;
    }
    store.setAdvisory(ADVISORIES[id]);
    // A destination clicked mid-warp was queued; honor it exactly once.
    const queued = store.consumeQueuedWarp();
    if (queued && queued !== id) store.requestWarp(queued);
  }

  function computePose(
    store: ReturnType<typeof useTravelStore.getState>,
    dt: number
  ) {
    const sim = store.sim;
    const mode = store.mode;

    if (mode === "WARP_CHARGE" || mode === "WARP") {
      // Hold position; align the nose toward the warp target.
      const target = store.targetPlanet
        ? WAYPOINT_BY_ID[store.targetPlanet]
        : null;
      if (target) {
        tmpDir.copy(target.position).sub(sim.shipPos).normalize();
        const r = 1 - Math.exp(-4 * dt);
        sim.shipDir.lerp(tmpDir, r).normalize();
      }
      return;
    }
    if (mode === "ARRIVING") return;

    getPointAtS(sim.s, tmpPoint);
    getTangentAtS(sim.s, tmpTangent);
    tmpN1.crossVectors(tmpTangent, UP).normalize();
    tmpN2.crossVectors(tmpN1, tmpTangent).normalize();
    tmpPoint
      .addScaledVector(tmpN1, sim.latX)
      .addScaledVector(tmpN2, sim.latY);

    const w = posePlanet.current;
    const blend = sim.insertBlend;
    if (w && blend > 0.001) {
      getOrbitPoint(w, sim.orbitTheta, tmpRing);
      getOrbitTangent(w, sim.orbitTheta, tmpRingDir);
      const sign = sim.orbitAngV + C.ORBIT_BASE_DRIFT >= 0 ? 1 : -1;
      tmpRingDir.multiplyScalar(sign);
      sim.shipPos.copy(tmpPoint).lerp(tmpRing, blend);
      tmpDir.copy(tmpTangent).lerp(tmpRingDir, blend).normalize();
      sim.shipDir.copy(tmpDir);
    } else {
      sim.shipPos.copy(tmpPoint);
      sim.shipDir.copy(tmpTangent);
    }
  }

  return null;
}
