"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getScrollProgress, SHIP_PATH } from "@/lib/journey";
import { Spaceship } from "./spaceship";

const tmpPos = new THREE.Vector3();
const tmpTangent = new THREE.Vector3();
const tmpAhead = new THREE.Vector3();
const tmpCamTarget = new THREE.Vector3();
const tmpLookAt = new THREE.Vector3();
const tmpMatrix = new THREE.Matrix4();
const tmpQuat = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);

/**
 * Drives the whole voyage from native window scroll: the ship rides
 * SHIP_PATH, banking into turns, while the camera chases from behind.
 * Scroll progress is read directly each frame (no listeners) and damped
 * for inertia, so the 3D layer and the HTML sections share one source
 * of truth — the scrollbar.
 */
export function JourneyRig({ quality }: { quality: "high" | "low" }) {
  const shipRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const bank = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (quality === "low") return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [quality]);

  useFrame((state, delta) => {
    const ship = shipRef.current;
    if (!ship) return;

    progress.current = THREE.MathUtils.damp(
      progress.current,
      getScrollProgress(),
      3,
      delta
    );
    // Clamp away from the exact ends where getTangentAt degenerates
    const p = THREE.MathUtils.clamp(progress.current, 0.0001, 0.9999);

    SHIP_PATH.getPointAt(p, tmpPos);
    SHIP_PATH.getTangentAt(p, tmpTangent);

    // Idle bob so the ship feels alive even when scroll is still
    const t = state.clock.elapsedTime;
    ship.position.copy(tmpPos);
    ship.position.y += Math.sin(t * 1.5) * 0.15;

    // Face along the path (ship model points down -z)
    tmpAhead.copy(tmpPos).add(tmpTangent);
    tmpMatrix.lookAt(ship.position, tmpAhead, UP);
    tmpQuat.setFromRotationMatrix(tmpMatrix);
    ship.quaternion.slerp(tmpQuat, 1 - Math.exp(-6 * delta));

    // Bank into lateral turns
    const lookAheadP = Math.min(p + 0.02, 0.9999);
    SHIP_PATH.getTangentAt(lookAheadP, tmpAhead);
    const targetBank = THREE.MathUtils.clamp(
      (tmpAhead.x - tmpTangent.x) * -30,
      -0.6,
      0.6
    );
    bank.current = THREE.MathUtils.damp(bank.current, targetBank, 4, delta);
    ship.rotateZ(bank.current);

    // Chase camera: behind and above the ship, looking ahead of it
    tmpCamTarget
      .copy(tmpPos)
      .addScaledVector(tmpTangent, -8)
      .addScaledVector(UP, 2.5);
    tmpCamTarget.x += mouse.current.x * 0.3;
    tmpCamTarget.y += -mouse.current.y * 0.3;

    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tmpCamTarget.x, 4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, tmpCamTarget.y, 4, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tmpCamTarget.z, 4, delta);

    tmpLookAt.copy(tmpPos).addScaledVector(tmpTangent, 6);
    cam.lookAt(tmpLookAt);
  });

  return <Spaceship groupRef={shipRef} quality={quality} />;
}
