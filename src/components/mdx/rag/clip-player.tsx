"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ClipPlayerProps {
  /** The clip's SVG markup, built on the server. */
  svg: string;
  /** Start time of each step, in seconds. */
  beats: number[];
  /** What each step shows, for people who would rather read than watch. */
  steps: string[];
  caption?: string;
}

interface Controls {
  toggle: () => void;
  jump: (step: number) => void;
}

/**
 * Plays one clip: it starts when it scrolls into view, loops, and can be paused
 * or moved to a step. The clip itself is CSS animation inside the SVG; this
 * component only drives the clock through the Web Animations API.
 *
 * With reduced motion the site switches animation off, so the SVG shows its
 * finished drawing and there is nothing to control.
 */
export function ClipPlayer({ svg, beats, steps, caption }: ClipPlayerProps) {
  const stage = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  // React sets innerHTML again whenever this object changes, which would replace
  // the SVG and restart every animation on each state update. Keep it stable.
  const markup = useMemo(() => ({ __html: svg }), [svg]);

  useEffect(() => {
    const root = stage.current;
    if (!root || typeof root.getAnimations !== "function") return;
    const animations = root.getAnimations({ subtree: true });
    const clock = animations.find((a) => (a as CSSAnimation).animationName === "rag-progress");
    const world = root.querySelector<SVGGElement>(".w");
    if (!clock || !world) return;

    let userPaused = false;
    let visible = false;
    let fade: Animation | null = null;

    const seek = (seconds: number) => {
      fade?.cancel();
      fade = null;
      for (const a of animations) a.currentTime = seconds * 1000;
    };
    const sync = () => {
      const run = visible && !userPaused;
      for (const a of animations) {
        if (run) a.play();
        else a.pause();
      }
      if (fade) {
        if (run) fade.play();
        else fade.pause();
      }
    };

    // Clear the board, then draw it again.
    clock.onfinish = () => {
      fade = world.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "ease-in", fill: "forwards" });
      fade.onfinish = () => {
        seek(0);
        sync();
      };
    };

    // Wait at the first frame until the reader gets here.
    for (const a of animations) a.pause();
    seek(0);
    setLive(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    const ticker = window.setInterval(() => {
      const now = Number(clock.currentTime ?? 0) / 1000;
      let current = 0;
      beats.forEach((start, i) => {
        if (now >= start) current = i;
      });
      setStep(current);
    }, 200);

    controls.current = {
      toggle: () => {
        userPaused = !userPaused;
        setPaused(userPaused);
        sync();
      },
      jump: (index) => {
        userPaused = false;
        setPaused(false);
        setStep(index);
        seek(beats[index]);
        sync();
      },
    };

    return () => {
      observer.disconnect();
      window.clearInterval(ticker);
      clock.onfinish = null;
      fade?.cancel();
      controls.current = null;
    };
  }, [beats]);

  return (
    <figure className="rag-clip my-8">
      <div className="relative">
        <div ref={stage} dangerouslySetInnerHTML={markup} />
        {live && (
          <button
            type="button"
            onClick={() => controls.current?.toggle()}
            aria-label={paused ? "Play the animation" : "Pause the animation"}
            className="absolute right-0 bottom-0 flex aspect-square w-[8.67%] cursor-pointer items-center justify-center after:absolute after:right-0 after:bottom-0 after:size-11 hover:bg-now"
          >
            <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true" style={{ width: "clamp(12px, 50%, 18px)", strokeWidth: 3 }}>
              {paused ? <path d="M4 2L16 10L4 18L4 2" strokeWidth={2.5} /> : <path d="M5 1V19M13 1V19" />}
            </svg>
          </button>
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2 text-sm font-bold">
        {live && (
          <div role="group" aria-label="Go to a step" className="flex items-center gap-1.5">
            <span className="mr-1">Step</span>
            {beats.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={i === step}
                aria-label={`Step ${i + 1}: ${steps[i]}`}
                onClick={() => controls.current?.jump(i)}
                className={`size-11 cursor-pointer border-2 border-border sm:size-10 ${
                  i === step ? "bg-foreground text-background" : "bg-background hover:bg-now"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        <details className="group min-w-0 flex-1 basis-56 open:basis-full">
          <summary className="flex min-h-10 cursor-pointer items-center underline decoration-2 underline-offset-[3px] hover:bg-now sm:justify-end sm:group-open:justify-start">
            Read the steps as text
          </summary>
          <ol className="mt-2 mb-1! list-decimal pl-6 text-base font-normal">
            {steps.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ol>
        </details>
      </div>
      {caption && <figcaption className="mt-2 text-[0.95rem] text-muted italic">{caption}</figcaption>}
    </figure>
  );
}
