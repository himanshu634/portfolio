"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import { CONTACT, IDENTITY, PLANET_THEMES } from "@/lib/content";
import { ADVISORIES, SILENCE_NOTE } from "@/lib/jokes";
import { Beacon, useWarpHandlers } from "./common";
import {
  FONT_DISPLAY,
  FONT_MONO,
  HoloPanel,
  HoloText,
  Reveal,
  RevealMount,
  useOrbitPos,
} from "../content/orbit-panel";

const W = WAYPOINT_BY_ID.relay;
const THEME = PLANET_THEMES.relay;

/** The black hole next door — safely outside the photon ring. Probably. */
function BlackHole() {
  const disc = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (disc.current) disc.current.rotation.z += delta * 0.25;
  });
  return (
    <group position={[26, 6, -28]} rotation={[1.15, 0.2, 0]}>
      {/* event horizon */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[5.5, 32, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* accretion disc — HDR-pushed so it blooms */}
      <mesh ref={disc} raycast={() => null}>
        <ringGeometry args={[6.5, 13, 96]} />
        <meshBasicMaterial
          color={new THREE.Color("#ff9e4d").multiplyScalar(1.8)}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* photon ring */}
      <mesh raycast={() => null}>
        <torusGeometry args={[5.9, 0.08, 8, 64]} />
        <meshBasicMaterial
          color={new THREE.Color("#ffd9a0").multiplyScalar(2.4)}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Relay station structure: core, dishes, blinking comm beacons. */
function Station() {
  const spin = useRef<THREE.Group>(null);
  const { handlers } = useWarpHandlers("relay");
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.18;
  });
  return (
    <group position={W.position}>
      <group ref={spin}>
        <mesh {...handlers}>
          <cylinderGeometry args={[0.8, 1.1, 3.2, 8]} />
          <meshStandardMaterial color="#3d3550" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.2, 0]} {...handlers}>
          <sphereGeometry args={[0.9, 20, 12]} />
          <meshStandardMaterial
            color="#56477a"
            metalness={0.7}
            roughness={0.3}
            emissive="#a855f7"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* ring habitat */}
        <mesh rotation={[Math.PI / 2, 0, 0]} {...handlers}>
          <torusGeometry args={[2.4, 0.28, 10, 40]} />
          <meshStandardMaterial color="#464062" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* dish */}
        <mesh position={[1.6, 1.4, 0]} rotation={[0, 0, -0.9]} raycast={() => null}>
          <coneGeometry args={[0.7, 0.5, 20, 1, true]} />
          <meshStandardMaterial
            color="#cfd4ea"
            metalness={0.6}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Beacon position={[0, 3.4, 0]} color={THEME.accent} speed={1.6} />
        <Beacon position={[2.4, 0, 0]} color="#f87171" speed={2.8} />
        <Beacon position={[-2.4, 0, 0]} color="#67e8f9" speed={2.1} />
      </group>
    </group>
  );
}

export function Relay() {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const active = currentPlanet === "relay";

  const headingPos = useOrbitPos(W, 0, 0, 6.6);
  const consolePos = useOrbitPos(W, 0.95, 1.35, 0.8);
  const notePos = useOrbitPos(W, 1.7, 1.4, -2.0);

  return (
    <>
      <Station />
      <BlackHole />
      {active && (
        <>
          <Reveal at={0.02} position={headingPos}>
            <HoloText font={FONT_DISPLAY} size={0.46} color="#ffffff" emissive>
              CONTACT // DEEP SPACE RELAY
            </HoloText>
          </Reveal>
          <RevealMount at={0.2}>
            <group position={consolePos}>
              <HoloPanel
                width={5.8}
                height={4.2}
                color={THEME.accent}
                htmlWidth={300}
                html={
                  <div className="holo-card">
                    <p className="holo-kicker">TRANSMISSION CONSOLE</p>
                    <p style={{ marginBottom: 12 }}>{CONTACT.blurb}</p>
                    <p style={{ marginBottom: 14 }}>
                      <a
                        className="holo-cta"
                        href={`mailto:${CONTACT.email}`}
                      >
                        ✉ {CONTACT.email}
                      </a>
                    </p>
                    <p className="holo-links">
                      Docking ports:{" "}
                      {CONTACT.ports.map((p, i) => (
                        <span key={p.href}>
                          {i > 0 && " · "}
                          <a href={p.href} target="_blank" rel="noopener noreferrer">
                            {p.label}
                          </a>
                        </span>
                      ))}
                    </p>
                    <p className="holo-footnote">
                      {ADVISORIES.relay.split("advisory: ")[1]} · ©{" "}
                      {new Date().getFullYear()} {IDENTITY.name}
                    </p>
                  </div>
                }
              />
            </group>
          </RevealMount>
          <Reveal at={0.6} position={notePos}>
            <HoloText font={FONT_MONO} size={0.22} color="#8a90ad" maxWidth={6}>
              {SILENCE_NOTE}
            </HoloText>
          </Reveal>
        </>
      )}
    </>
  );
}
