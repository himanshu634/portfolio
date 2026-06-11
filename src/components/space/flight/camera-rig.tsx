"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTravelStore } from "@/lib/store";
import * as C from "@/lib/flight/constants";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";

const UP = new THREE.Vector3(0, 1, 0);
const tmpTarget = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const tmpRadial = new THREE.Vector3();

/**
 * Critically damped spring — a real second-order system (position +
 * velocity state), so heavy braking pitches the "pilot" forward and the
 * camera settles with zero overshoot. No lerp curves, no tweens.
 */
class Spring3 {
  pos = new THREE.Vector3();
  vel = new THREE.Vector3();
  private acc = new THREE.Vector3();
  primed = false;

  step(target: THREE.Vector3, k: number, dt: number) {
    if (!this.primed) {
      this.pos.copy(target);
      this.primed = true;
      return;
    }
    const c = 2 * Math.sqrt(k);
    // Substep for stability at low framerates.
    const n = dt > 0.025 ? 2 : 1;
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      this.acc
        .copy(target)
        .sub(this.pos)
        .multiplyScalar(k)
        .addScaledVector(this.vel, -c);
      this.vel.addScaledVector(this.acc, h);
      this.pos.addScaledVector(this.vel, h);
    }
  }
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const posSpring = useRef(new Spring3());
  const lookSpring = useRef(new Spring3());
  const pitch = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const lastFov = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const store = useTravelStore.getState();
    const sim = store.sim;
    const dt = Math.min(delta, C.MAX_FRAME_DELTA);
    const reduced = store.reducedMotion;

    const orbiting =
      (store.mode === "ORBIT" || store.mode === "ORBIT_INSERT") &&
      store.currentPlanet;

    if (orbiting) {
      // Settle into a slow orbital drift: camera floats radially behind the
      // ship with the planet as the centerpiece — it is never frozen-static.
      const w = WAYPOINT_BY_ID[store.currentPlanet!];
      tmpRadial.copy(sim.shipPos).sub(w.position);
      tmpTarget
        .copy(w.position)
        .addScaledVector(tmpRadial, 1.7)
        .addScaledVector(w.normal, w.orbitRadius * 0.38)
        .addScaledVector(UP, 1.2);
      tmpLook.copy(w.position).addScaledVector(tmpRadial, 0.25);
    } else {
      tmpTarget
        .copy(sim.shipPos)
        .addScaledVector(sim.shipDir, -8)
        .addScaledVector(UP, 2.6);
      tmpLook.copy(sim.shipPos).addScaledVector(sim.shipDir, 6);
    }
    if (!reduced) {
      tmpTarget.x += mouse.current.x * 0.4;
      tmpTarget.y += -mouse.current.y * 0.4;
    }

    posSpring.current.step(tmpTarget, C.CAM_SPRING_K, dt);
    lookSpring.current.step(tmpLook, C.CAM_SPRING_K * 1.3, dt);

    camera.position.copy(posSpring.current.pos);
    camera.up.copy(UP);
    camera.lookAt(lookSpring.current.pos);

    // Pilot inertia: braking dips the nose; smoothed, force-derived.
    const pitchTarget = -sim.brakeForce * C.CAM_BRAKE_PITCH * (reduced ? 0 : 1);
    pitch.current = THREE.MathUtils.damp(pitch.current, pitchTarget, 6, dt);
    camera.rotateX(pitch.current);

    // Velocity-coupled FOV (60° at rest -> ~75° at max cruise; 110° in warp).
    const speedFrac = Math.min(Math.abs(sim.v) / C.V_MAX, 1);
    let fovTarget =
      C.FOV_REST + (C.FOV_CRUISE_MAX - C.FOV_REST) * speedFrac;
    if (store.mode === "WARP") fovTarget = C.FOV_WARP;
    if (store.mode === "WARP_CHARGE") fovTarget = C.FOV_CRUISE_MAX;
    if (reduced) fovTarget = C.FOV_REST;

    const k = 22;
    const c = 2 * Math.sqrt(k);
    sim.fovV += (k * (fovTarget - sim.fov) - c * sim.fovV) * dt;
    sim.fov += sim.fovV * dt;
    if (Math.abs(sim.fov - lastFov.current) > 0.01) {
      camera.fov = sim.fov;
      camera.updateProjectionMatrix();
      lastFov.current = sim.fov;
    }
  });

  return null;
}
