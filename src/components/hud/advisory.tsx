"use client";

import { useEffect, useState } from "react";
import { useTravelStore } from "@/lib/store";

/** Travel advisory toast on orbit arrival. Disappears before it gets clingy. */
export function Advisory() {
  const advisory = useTravelStore((s) => s.advisory);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!advisory) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(id);
  }, [advisory]);

  if (!advisory) return null;

  return (
    <div
      role="status"
      className={`hud-panel fixed left-1/2 top-5 z-40 max-w-[calc(100vw-2rem)] -translate-x-1/2 px-4 py-2 text-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <p className="hud-line">{advisory.text}</p>
    </div>
  );
}
