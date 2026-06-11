"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { useTravelStore } from "@/lib/store";
import * as C from "@/lib/flight/constants";
import { Spaceship } from "../spaceship";

const UP = new THREE.Vector3(0, 1, 0);
const tmpAhead = new THREE.Vector3();
const tmpMatrix = new THREE.Matrix4();
const tmpQuat = new THREE.Quaternion();

/**
 * Places the ship from the simulated pose. Thruster sway is simplex noise
 * whose amplitude scales with applied thrust — exactly zero at rest,
 * because things at rest stay at rest.
 */
export function ShipRig({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const bank = useRef(0);
  const lastDirX = useRef(0);
  const noise = useMemo(() => {
    const n1 = createNoise2D(() => 0.42);
    const n2 = createNoise2D(() => 0.84);
    return { n1, n2 };
  }, []);

  useFrame((state, delta) => {
    const ship = group.current;
    if (!ship) return;
    const store = useTravelStore.getState();
    const sim = store.sim;
    const dt = Math.min(delta, C.MAX_FRAME_DELTA);
    const t = state.clock.elapsedTime;

    ship.position.copy(sim.shipPos);

    // Thruster sway — amplitude follows |thrust|, zero when coasting.
    const thrustFrac = Math.min(
      (Math.abs(sim.appliedForce) + sim.brakeForce) / C.F_MAX,
      1.5
    );
    const amp = store.reducedMotion ? 0 : C.SWAY_AMP * thrustFrac;
    if (amp > 0.001) {
      ship.position.x += noise.n1(t * C.SWAY_FREQ, 0) * amp;
      ship.position.y += noise.n2(t * C.SWAY_FREQ, 7.3) * amp;
    }

    // Orient along direction of travel (smoothed, no snapping).
    tmpAhead.copy(ship.position).add(sim.shipDir);
    tmpMatrix.lookAt(ship.position, tmpAhead, UP);
    tmpQuat.setFromRotationMatrix(tmpMatrix);
    ship.quaternion.slerp(tmpQuat, 1 - Math.exp(-6 * dt));

    // Bank into turns from the change in heading, plus the barrel roll.
    const turnRate = (sim.shipDir.x - lastDirX.current) / Math.max(dt, 1e-4);
    lastDirX.current = sim.shipDir.x;
    const targetBank = THREE.MathUtils.clamp(
      -turnRate * C.BANK_GAIN * Math.sign(sim.v >= 0 ? 1 : -1) * 14,
      -C.BANK_MAX,
      C.BANK_MAX
    );
    bank.current = THREE.MathUtils.damp(bank.current, targetBank, 4, dt);
    ship.rotateZ(bank.current + sim.rollAngle);
  });

  return (
    <group ref={group}>
      <Spaceship quality={quality} />
    </group>
  );
}
