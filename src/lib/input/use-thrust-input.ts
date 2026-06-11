"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { travelStore } from "@/lib/store";

const VIRTUAL_HEIGHT = 400000;

/**
 * Scroll is thrust, not position. Lenis runs against an invisible
 * infinite virtual scroller purely to normalize + smooth wheel/touch
 * input across devices; the per-frame scroll delta is deposited into the
 * sim as raw thrust input. All easing comes from the physics integrator —
 * Lenis never moves the ship.
 */
export function useThrustInput(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const wrapper = document.createElement("div");
    const content = document.createElement("div");
    wrapper.style.cssText =
      "position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none;";
    content.style.cssText = `width:1px;height:${VIRTUAL_HEIGHT}px;`;
    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: window,
      infinite: true,
      smoothWheel: true,
      syncTouch: true,
      gestureOrientation: "vertical",
      touchMultiplier: 1.6,
    });

    let last = lenis.scroll;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      let d = lenis.scroll - last;
      // Infinite mode wraps; unwrap large jumps.
      if (d > VIRTUAL_HEIGHT / 2) d -= VIRTUAL_HEIGHT;
      else if (d < -VIRTUAL_HEIGHT / 2) d += VIRTUAL_HEIGHT;
      last = lenis.scroll;
      travelStore.getState().sim.inputDelta += d * 0.011;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Keyboard thrust: arrows / W / S. Enter & Tab stay free for the HUD.
    const held = new Set<string>();
    const updateHold = () => {
      const fwd = held.has("ArrowUp") || held.has("w") ? 1 : 0;
      const back = held.has("ArrowDown") || held.has("s") ? 1 : 0;
      travelStore.getState().sim.keyHold = fwd - back;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(key)) {
        if (key.startsWith("Arrow")) e.preventDefault();
        held.add(key);
        updateHold();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      held.delete(key);
      updateHold();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      wrapper.remove();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      travelStore.getState().sim.keyHold = 0;
    };
  }, [enabled]);
}
