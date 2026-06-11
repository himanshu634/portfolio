"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A full-height stop on the voyage. Content sits in a glassy HUD panel
 * that drifts in as the ship "arrives" (i.e. the section scrolls into view).
 */
export function WaypointSection({
  id,
  children,
  align = "center",
}: {
  id: string;
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  const reducedMotion = useReducedMotion();

  const justify =
    align === "left"
      ? "justify-start"
      : align === "right"
        ? "justify-end"
        : "justify-center";

  return (
    <section
      id={id}
      className={`min-h-screen flex items-center ${justify} py-24`}
    >
      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.25, once: false }}
        transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
        className="glass-panel w-full max-w-[680px] px-6 py-8 sm:px-10 sm:py-10"
      >
        {children}
      </motion.div>
    </section>
  );
}
