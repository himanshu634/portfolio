"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTravelStore } from "@/lib/store";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import { PLANET_THEMES, SKILLS } from "@/lib/content";
import { Beacon, PlanetBody } from "./common";
import {
  FONT_DISPLAY,
  FONT_MONO,
  HoloText,
  Reveal,
  useOrbitPos,
} from "../content/orbit-panel";

const W = WAYPOINT_BY_ID.forge;
const THEME = PLANET_THEMES.forge;
const SPIN = 0.06;

/**
 * Each skill is a geostationary satellite: parented inside the planet's
 * spin group, so it holds station over the same patch of machine surface
 * forever. Very reliable. Very bored.
 */
function SkillSatellites({ labelsVisible }: { labelsVisible: boolean }) {
  const sats = useMemo(
    () =>
      SKILLS.map((skill, i) => {
        const phi = (i / SKILLS.length) * Math.PI * 2;
        const tilt = ((i % 3) - 1) * 0.35;
        const r = W.radius * 1.9 + (i % 2) * 0.9;
        return {
          skill,
          position: new THREE.Vector3(
            Math.cos(phi) * r,
            Math.sin(tilt) * r * 0.45,
            Math.sin(phi) * r
          ),
          revealAt: 0.06 + (i / SKILLS.length) * 0.85,
        };
      }),
    []
  );

  return (
    <>
      {sats.map(({ skill, position, revealAt }) => (
        <group key={skill.name} position={position}>
          <mesh raycast={() => null}>
            <boxGeometry args={[0.34, 0.22, 0.22]} />
            <meshStandardMaterial color="#8b93b5" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* solar wings */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.42, 0, 0]} raycast={() => null}>
              <boxGeometry args={[0.5, 0.02, 0.3]} />
              <meshStandardMaterial
                color="#27345f"
                metalness={0.6}
                roughness={0.25}
                emissive="#1d4ed8"
                emissiveIntensity={0.35}
              />
            </mesh>
          ))}
          <Beacon position={[0, 0.2, 0]} color={THEME.accent} size={0.05} />
          {labelsVisible && (
            <Reveal at={revealAt} position={[0, 0.85, 0]}>
              <HoloText font={FONT_MONO} size={0.42} color="#ffffff" emissive>
                {skill.name}
              </HoloText>
              <HoloText
                font={FONT_MONO}
                size={0.24}
                color="#9aa3c0"
                position={[0, -0.5, 0]}
                maxWidth={6}
              >
                {skill.detail}
              </HoloText>
            </Reveal>
          )}
        </group>
      ))}
    </>
  );
}

export function Forge() {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const active = currentPlanet === "forge";
  const headingPos = useOrbitPos(W, 0.35, 1.4, 3.4);
  const subPos = useOrbitPos(W, 0.35, 1.4, 2.3);

  return (
    <>
      <PlanetBody
        waypoint={W}
        material={{
          dayA: "#6b7280",
          dayB: "#2a2f3e",
          night: "#ff5a3c",
          atmosphere: "#fca5a5",
          noiseScale: 2.4,
          circuit: true,
        }}
        spin={SPIN}
        axisTilt={0.05}
        atmosphere="#f87171"
      >
        {/* geostationary frame: satellites spin with the planet */}
        <SkillSatellites labelsVisible={active} />
      </PlanetBody>
      {active && (
        <>
          <Reveal at={0.02} position={headingPos}>
            <HoloText font={FONT_DISPLAY} size={1.1} color="#ffffff" emissive>
              SKILLS // FORGE-9
            </HoloText>
          </Reveal>
          <Reveal at={0.05} position={subPos}>
            <HoloText font={FONT_MONO} size={0.36} color="#9aa3c0" maxWidth={12}>
              Geostationary toolchain. Each satellite holds station above the
              code it is responsible for.
            </HoloText>
          </Reveal>
        </>
      )}
    </>
  );
}
