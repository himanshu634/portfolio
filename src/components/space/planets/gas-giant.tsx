"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTravelStore } from "@/lib/store";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import {
  PLANET_THEMES,
  WORK_HEADLINE,
  WORK_MOONS,
  WORK_TIMELINE,
  type Moon,
} from "@/lib/content";
import { createGasGiantMaterial } from "@/shaders/materials";
import { useWarpHandlers } from "./common";
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

const W = WAYPOINT_BY_ID.genuin;
const THEME = PLANET_THEMES.genuin;

/** Kepler's intuition, faked honestly: ω ∝ 1/√r. Closer moons hustle. */
function moonAngularSpeed(moon: Moon): number {
  return (0.55 / Math.sqrt(moon.orbit)) * moon.speedScale;
}

function ProjectMoon({
  moon,
  index,
  labeled,
}: {
  moon: Moon;
  index: number;
  labeled: boolean;
}) {
  const pivot = useRef<THREE.Group>(null);
  const phase = useMemo(() => index * 1.7, [index]);
  const tilt = useMemo(() => ((index % 3) - 1) * 0.12, [index]);

  useFrame((state) => {
    if (!pivot.current) return;
    pivot.current.rotation.y =
      phase + state.clock.elapsedTime * moonAngularSpeed(moon);
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <group ref={pivot}>
        <group position={[moon.orbit, 0, 0]}>
          <mesh raycast={() => null}>
            <sphereGeometry args={[moon.radius, 24, 12]} />
            <meshStandardMaterial
              color={index % 2 ? "#b6a8d6" : "#cdbfa3"}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>
          {labeled && (
            <HoloText
              font={FONT_MONO}
              size={0.34}
              color={THEME.accent}
              position={[0, moon.radius + 0.6, 0]}
            >
              {moon.name}
            </HoloText>
          )}
        </group>
      </group>
      {/* faint orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[moon.orbit, 0.012, 4, 96]} />
        <meshBasicMaterial color="#6f63a8" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/** Saturn-style ring bands doubling as the tenure timeline. */
function TimelineRings({ labeled }: { labeled: boolean }) {
  const bands = [
    { inner: 11.2, outer: 12.6, opacity: 0.5 },
    { inner: 13.0, outer: 14.8, opacity: 0.38 },
    { inner: 15.2, outer: 16.4, opacity: 0.26 },
  ];
  return (
    <group rotation={[Math.PI / 2 - 0.32, 0.12, 0]}>
      {bands.map((b, i) => (
        <mesh key={i} raycast={() => null}>
          <ringGeometry args={[b.inner, b.outer, 96]} />
          <meshBasicMaterial
            color={i === 1 ? "#b9a4ff" : "#8d7bd6"}
            transparent
            opacity={b.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      {labeled &&
        WORK_TIMELINE.map((t, i) => {
          const band = bands[t.band];
          const r = (band.inner + band.outer) / 2;
          const a = 0.8 + i * 0.55;
          return (
            <Reveal
              at={0.25 + i * 0.12}
              key={t.label}
              position={[Math.cos(a) * r, Math.sin(a) * r, 0.4]}
            >
              <HoloText font={FONT_MONO} size={0.42} color="#d6ccff">
                {t.label}
              </HoloText>
            </Reveal>
          );
        })}
    </group>
  );
}

function MoonPanel({ moon, index }: { moon: Moon; index: number }) {
  const pos = useOrbitPos(W, 0.75 + index * 0.62, 1.3, 4.0 - (index % 2) * 8.4);
  return (
    <RevealMount at={0.18 + index * 0.18}>
      <group position={pos}>
        <HoloPanel
        width={5.6}
        height={4.4}
        color={THEME.accent}
        htmlWidth={290}
        html={
          <div className="holo-card">
            <p className="holo-kicker">
              MOON {String(index + 1).padStart(2, "0")} · {moon.era}
            </p>
            <h3 className="holo-title">
              {moon.href ? (
                <a href={moon.href} target="_blank" rel="noopener noreferrer">
                  {moon.name}
                </a>
              ) : (
                moon.name
              )}
            </h3>
            <ul className="holo-list">
              {moon.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {moon.links && (
              <p className="holo-links">
                Live:{" "}
                {moon.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        }
        />
      </group>
    </RevealMount>
  );
}

export function GasGiant() {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const active = currentPlanet === "genuin";
  const material = useMemo(
    () =>
      createGasGiantMaterial({
        colorA: "#7c6bc4",
        colorB: "#3b3270",
        colorC: "#e0b06a",
        atmosphere: "#c4b5fd",
        bandFreq: 10,
      }),
    []
  );
  const { handlers } = useWarpHandlers("genuin");
  const spinGroup = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (spinGroup.current) spinGroup.current.rotation.y += delta * 0.03;
  });

  const headingPos = useOrbitPos(W, 0, 0, 13.5);
  const rolePos = useOrbitPos(W, 0, 0, 12.1);

  return (
    <>
      <group position={W.position} rotation={[0.1, 0, 0.05]}>
        <group ref={spinGroup}>
          <mesh material={material} {...handlers}>
            <sphereGeometry args={[W.radius, 56, 28]} />
          </mesh>
        </group>
        <TimelineRings labeled={active} />
        {WORK_MOONS.map((m, i) => (
          <ProjectMoon key={m.id} moon={m} index={i} labeled={active} />
        ))}
      </group>
      {active && (
        <>
          <Reveal at={0.02} position={headingPos}>
            <HoloText font={FONT_DISPLAY} size={0.72} color="#ffffff" emissive>
              {`WORK // ${WORK_HEADLINE.title.toUpperCase()}`}
            </HoloText>
          </Reveal>
          <Reveal at={0.05} position={rolePos}>
            <HoloText font={FONT_BODY} size={0.36} color="#cfd4ea" maxWidth={11}>
              {`${WORK_HEADLINE.role} — ${WORK_HEADLINE.summary}`}
            </HoloText>
          </Reveal>
          {WORK_MOONS.map((m, i) => (
            <MoonPanel key={m.id} moon={m} index={i} />
          ))}
        </>
      )}
    </>
  );
}
