"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import { IDENTITY, PLANET_THEMES } from "@/lib/content";
import { SCROLL_HINT } from "@/lib/jokes";
import { createCloudMaterial } from "@/shaders/materials";
import { Beacon, PlanetBody } from "./common";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_MONO,
  HoloPanel,
  HoloText,
  Reveal,
  RevealMount,
  useOrbitPos,
} from "../content/orbit-panel";

const W = WAYPOINT_BY_ID.terra;
const THEME = PLANET_THEMES.terra;

/** Launch Station gantry orbiting the home planet. */
function LaunchStation() {
  const pivot = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (pivot.current) pivot.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={pivot} rotation={[0.4, 0, 0.1]}>
      <group position={[W.radius * 1.7, 0, 0]}>
        <mesh raycast={() => null}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
          <meshStandardMaterial color="#9aa3c0" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]} raycast={() => null}>
          <torusGeometry args={[0.5, 0.07, 8, 24]} />
          <meshStandardMaterial color="#7986b3" metalness={0.8} roughness={0.4} />
        </mesh>
        <Beacon position={[0, 1.5, 0]} color={THEME.accent} />
        <Beacon position={[0, -0.9, 0]} color="#fca5a5" speed={3.1} />
      </group>
    </group>
  );
}

/** Tiny floating astronaut. Click them — they wave. They're friendly. */
function Astronaut() {
  const group = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Mesh>(null);
  const waveUntil = useRef(-1);
  const wantWave = useRef(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (wantWave.current) {
      wantWave.current = false;
      waveUntil.current = t + 2.6;
    }
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.6) * 0.3;
      group.current.rotation.z = Math.sin(t * 0.4) * 0.15;
    }
    if (arm.current) {
      arm.current.rotation.z =
        t < waveUntil.current ? 2.4 + Math.sin(t * 14) * 0.5 : 0.5;
    }
  });

  return (
    <group position={[0, W.orbitRadius * 0.45, W.orbitRadius * 0.7]}>
      <group
        ref={group}
        scale={0.5}
        onClick={(e) => {
          e.stopPropagation();
          wantWave.current = true;
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        {/* body */}
        <mesh>
          <capsuleGeometry args={[0.32, 0.5, 4, 12]} />
          <meshStandardMaterial color="#e8eaf6" roughness={0.6} />
        </mesh>
        {/* helmet */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.28, 16, 12]} />
          <meshPhysicalMaterial
            color="#67e8f9"
            metalness={0.2}
            roughness={0.1}
            transmission={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* waving arm */}
        <mesh ref={arm} position={[0.38, 0.25, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
          <meshStandardMaterial color="#e8eaf6" roughness={0.6} />
        </mesh>
        {/* other arm + legs */}
        <mesh position={[-0.38, 0.1, 0]} rotation={[0, 0, -0.7]}>
          <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
          <meshStandardMaterial color="#e8eaf6" roughness={0.6} />
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, -0.6, 0]} rotation={[0, 0, x]}>
            <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
            <meshStandardMaterial color="#cfd4ea" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function HeroContent() {
  // Headings hover above the planet's pole — always in frame while orbiting.
  const namePos = useOrbitPos(W, 0, 0, 8.6);
  const statusPos = useOrbitPos(W, 0, 0, 7.3);
  const taglinePos = useOrbitPos(W, 0.95, 1.2, 3.8);
  const badgePos = useOrbitPos(W, 1.5, 1.25, 3.2);
  const hintPos = useOrbitPos(W, 0.05, 1.3, -3.0);
  const finalHintPos = useOrbitPos(W, 2.2, 1.3, 2.6);

  return (
    <>
      <Reveal at={0.02} position={namePos}>
        <HoloText font={FONT_DISPLAY} size={0.62} color="#ffffff" emissive maxWidth={12}>
          {IDENTITY.name}
        </HoloText>
      </Reveal>
      <Reveal at={0.06} position={statusPos}>
        <HoloText font={FONT_MONO} size={0.3} color={THEME.accent}>
          {`● ${IDENTITY.status}`}
        </HoloText>
      </Reveal>
      <Reveal at={0.02} position={hintPos}>
        <HoloText font={FONT_MONO} size={0.22} color="#8a90ad" maxWidth={6.5}>
          {SCROLL_HINT}
        </HoloText>
      </Reveal>
      <Reveal at={0.3} position={taglinePos}>
        <HoloText font={FONT_BODY} size={0.4} color="#e8eaf6" maxWidth={8}>
          {IDENTITY.tagline}
        </HoloText>
      </Reveal>
      <RevealMount at={0.55}>
        <group position={badgePos}>
          <HoloPanel
          width={3.6}
          height={4.4}
          color={THEME.accent}
          htmlWidth={200}
          html={
            <div className="holo-card" style={{ textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IDENTITY.photo}
                alt="Himanshu Mendapara — crew ID"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  margin: "0 auto 10px",
                }}
              />
              <p style={{ fontSize: 13, letterSpacing: 2 }}>CREW ID · 001</p>
              <p style={{ fontSize: 11, opacity: 0.7 }}>
                Clearance: full-stack. Snacks: confiscated.
              </p>
            </div>
          }
          />
        </group>
      </RevealMount>
      <Reveal at={0.8} position={finalHintPos}>
        <HoloText font={FONT_MONO} size={0.26} color="#8a90ad" maxWidth={7}>
          Click any planet (or the star map) to warp. Keep scrolling to cruise
          the long way — very scenic, zero traffic.
        </HoloText>
      </Reveal>
    </>
  );
}

export function Terra() {
  const cloudMat = useMemo(() => createCloudMaterial(), []);
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  useFrame((state) => {
    cloudMat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <PlanetBody
        waypoint={W}
        material={{
          dayA: "#4caf7d",
          dayB: "#1c5d8f",
          atmosphere: "#7ee8a2",
          noiseScale: 0.55,
        }}
        spin={0.045}
        atmosphere="#6fd1ff"
        fixedChildren={
          <>
            <mesh material={cloudMat} scale={1.045} raycast={() => null}>
              <sphereGeometry args={[W.radius, 40, 20]} />
            </mesh>
            <LaunchStation />
            <Astronaut />
          </>
        }
      />
      {currentPlanet === "terra" && <HeroContent />}
    </>
  );
}
