"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import { OSS_PROJECT, OSS_SATS, OSS_YOUTUBE, PLANET_THEMES } from "@/lib/content";
import { Beacon, PlanetBody } from "./common";
import {
  FONT_DISPLAY,
  FONT_MONO,
  HoloPanel,
  HoloText,
  Reveal,
  RevealMount,
  useOrbitPos,
} from "../content/orbit-panel";

const W = WAYPOINT_BY_ID.glacius;
const THEME = PLANET_THEMES.glacius;

/** Contribution satellites circling the ice planet (v ∝ 1/√r holds here too). */
function ContributionSats({ labeled }: { labeled: boolean }) {
  const pivots = useRef<(THREE.Group | null)[]>([]);
  const orbits = useMemo(
    () =>
      OSS_SATS.map((sat, i) => ({
        sat,
        r: W.radius * 1.8 + i * 1.1,
        phase: i * 1.9,
        tilt: ((i % 3) - 1) * 0.3,
      })),
    []
  );

  useFrame((state) => {
    orbits.forEach((o, i) => {
      const g = pivots.current[i];
      if (g) g.rotation.y = o.phase + (state.clock.elapsedTime * 0.5) / Math.sqrt(o.r);
    });
  });

  return (
    <>
      {orbits.map((o, i) => (
        <group key={o.sat.id} rotation={[o.tilt, 0, 0]}>
          <group ref={(el) => void (pivots.current[i] = el)}>
            <group position={[o.r, 0, 0]}>
              {o.sat.isDish ? (
                <mesh rotation={[0.6, 0, 0]} raycast={() => null}>
                  <coneGeometry args={[0.4, 0.3, 16, 1, true]} />
                  <meshStandardMaterial
                    color="#cfe7f5"
                    metalness={0.7}
                    roughness={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ) : (
                <mesh raycast={() => null}>
                  <icosahedronGeometry args={[0.28, 0]} />
                  <meshStandardMaterial
                    color="#bfe3f7"
                    metalness={0.4}
                    roughness={0.25}
                    emissive="#38bdf8"
                    emissiveIntensity={0.25}
                  />
                </mesh>
              )}
              <Beacon position={[0, 0.4, 0]} color={THEME.accent} size={0.05} />
              {labeled && (
                <HoloText
                  font={FONT_MONO}
                  size={0.26}
                  color={THEME.accent}
                  position={[0, 0.85, 0]}
                >
                  {o.sat.name}
                </HoloText>
              )}
            </group>
          </group>
        </group>
      ))}
    </>
  );
}

export function Glacius() {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const quality = useTravelStore((s) => s.quality);
  const active = currentPlanet === "glacius";

  const headingPos = useOrbitPos(W, 0, 0, 7.4);
  const summaryPos = useOrbitPos(W, 0, 0, 6.3);
  const prPos = useOrbitPos(W, 1.15, 1.32, 3.0);
  const dishPos = useOrbitPos(W, 1.8, 1.38, -2.4);

  return (
    <>
      <PlanetBody
        waypoint={W}
        material={{
          dayA: "#cfeefc",
          dayB: "#5d9bc7",
          atmosphere: "#7dd3fc",
          noiseScale: 1.6,
          ice: true,
        }}
        spin={0.07}
        axisTilt={0.3}
        atmosphere="#9be0ff"
        fixedChildren={<ContributionSats labeled={active} />}
      />
      {active && (
        <>
          <Reveal at={0.02} position={headingPos}>
            <HoloText font={FONT_DISPLAY} size={0.52} color="#ffffff" emissive>
              OPEN SOURCE // WREN-AI
            </HoloText>
          </Reveal>
          <Reveal at={0.08} position={summaryPos}>
            <HoloText font={FONT_MONO} size={0.26} color="#cfe7f5" maxWidth={8}>
              {`${OSS_PROJECT.summary} (${OSS_PROJECT.org})`}
            </HoloText>
          </Reveal>
          <RevealMount at={0.3}>
            <group position={prPos}>
              <HoloPanel
                width={5.4}
                height={3.6}
                color={THEME.accent}
                htmlWidth={290}
                html={
                  <div className="holo-card">
                    <p className="holo-kicker">CONTRIBUTION MANIFEST</p>
                    <ul className="holo-list">
                      {OSS_SATS.filter((s) => !s.isDish).map((s) => (
                        <li key={s.id}>
                          <a href={s.href} target="_blank" rel="noopener noreferrer">
                            {s.name}
                          </a>{" "}
                          — {s.detail}
                        </li>
                      ))}
                    </ul>
                    <p className="holo-links">
                      <a
                        href={OSS_PROJECT.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github.com/Canner/WrenAI →
                      </a>
                    </p>
                  </div>
                }
              />
            </group>
          </RevealMount>
          <RevealMount at={0.62}>
            <group position={dishPos}>
              <HoloPanel
                width={6}
                height={4}
                color={THEME.accent}
                htmlWidth={310}
                occlude={false}
                html={
                  <div className="holo-card">
                    <p className="holo-kicker">
                      INCOMING TRANSMISSION · TRINO COMMUNITY BROADCAST
                    </p>
                    {quality === "high" ? (
                      <iframe
                        src={OSS_YOUTUBE}
                        title="Trino Community Broadcast — Wren-AI"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          border: "none",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <p>
                        <a
                          href="https://www.youtube.com/watch?v=pUh7DIaznPg&t=574s"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ▶ Play the broadcast segment (9:34) →
                        </a>
                      </p>
                    )}
                    <p className="holo-links">
                      Featured for the Trino connector work.
                    </p>
                  </div>
                }
              />
            </group>
          </RevealMount>
        </>
      )}
    </>
  );
}
