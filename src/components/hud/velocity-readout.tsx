"use client";

import { useEffect, useRef, useState } from "react";
import { useTravelStore } from "@/lib/store";
import { V_MAX } from "@/lib/flight/constants";
import { WAYPOINT_BY_ID } from "@/lib/flight/path";
import {
  DO_NOT_PRESS_LABEL,
  RETRO_THRUSTER_NOTE,
  SPEED_UNITS,
  WARP_SPOOL_LINE,
} from "@/lib/jokes";

const MODE_LINES: Record<string, string> = {
  LOADING: "PREFLIGHT",
  CRUISE: "CRUISE",
  BRAKING: "RETRO BURN",
  ORBIT_INSERT: "ORBIT INSERTION",
  ORBIT: "STABLE ORBIT",
  ORBIT_EXIT: "DEPARTURE BURN",
  WARP_CHARGE: "FTL SPOOLING",
  WARP: "FTL TRANSIT",
  ARRIVING: "REENTRY",
};

/**
 * Cockpit readout: velocity in increasingly unhelpful units, flight mode,
 * the time-dilation clock gag during warp — and a red button that the
 * label is very clear about.
 */
export function VelocityReadout() {
  const mode = useTravelStore((s) => s.mode);
  const [speed, setSpeed] = useState(0);
  const [unitIdx, setUnitIdx] = useState(0);
  const [clock, setClock] = useState("00:00");
  const raf = useRef(0);

  useEffect(() => {
    let last = 0;
    const tick = (t: number) => {
      raf.current = requestAnimationFrame(tick);
      if (t - last < 120) return;
      last = t;
      const state = useTravelStore.getState();
      const sim = state.sim;
      // In orbit the linear sim idles — report tangential speed instead.
      const orbiting =
        state.mode === "ORBIT" || state.mode === "ORBIT_INSERT";
      const w = state.currentPlanet
        ? WAYPOINT_BY_ID[state.currentPlanet]
        : null;
      const v =
        state.mode === "WARP"
          ? V_MAX * 4040
          : orbiting && w
            ? Math.abs(sim.orbitAngV) * w.orbitRadius
            : Math.abs(sim.v);
      setSpeed(v);
      // Variable-weight display font tracks velocity (300 rest -> 800 burn).
      const wght =
        400 + Math.min(Math.abs(sim.v) / V_MAX, 1) * 400 + (state.mode === "WARP" ? 200 : 0);
      document.documentElement.style.setProperty(
        "--display-wght",
        String(Math.round(Math.min(wght, 800)))
      );
      // Time dilation gag: the clock spins wildly in transit.
      const now = new Date();
      if (state.mode === "WARP") {
        const wild = (t * 97) % (24 * 60);
        setClock(
          `${String(Math.floor(wild / 60)).padStart(2, "0")}:${String(
            Math.floor(wild % 60)
          ).padStart(2, "0")}`
        );
      } else {
        setClock(
          `${String(now.getHours()).padStart(2, "0")}:${String(
            now.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setUnitIdx((i) => (i + 1) % SPEED_UNITS.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  const barrelRoll = () => {
    // Physics-correct mischief: an angular impulse, conserved then damped.
    useTravelStore.getState().sim.rollVel += Math.PI * 2.4;
  };

  return (
    <div className="hud-panel fixed bottom-4 right-4 z-40 px-4 py-3 text-right">
      <p className="hud-kicker" title={RETRO_THRUSTER_NOTE}>
        VELOCITY <span aria-hidden="true">ⓘ</span>
      </p>
      <p className="hud-speed" aria-live="off">
        {mode === "WARP" ? "FTL" : speed.toFixed(1)}
        <span className="hud-speed-unit"> u/s</span>
      </p>
      <p className="hud-line">{SPEED_UNITS[unitIdx].label(speed)}</p>
      <p className="hud-line">
        <span className="text-accent">{MODE_LINES[mode] ?? mode}</span>
        {" · "}
        <span className={mode === "WARP" ? "animate-pulse" : ""}>⏱ {clock}</span>
      </p>
      {mode === "WARP_CHARGE" && <p className="hud-line">{WARP_SPOOL_LINE}</p>}
      <button
        onClick={barrelRoll}
        className="hud-do-not-press mt-2"
        aria-label="Do not press (it does a barrel roll)"
      >
        {DO_NOT_PRESS_LABEL}
      </button>
    </div>
  );
}
