"use client";

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * A markdown image (`![alt](src)`) that opens full size on click. Markdown puts
 * images inside a <p>, so the dialog is portalled to <body> instead of nesting there.
 */
export function ZoomImage({ src, alt = "" }: ComponentPropsWithoutRef<"img">) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  if (typeof src !== "string") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mdx-figure group relative my-2 block w-full cursor-zoom-in border-2 border-border bg-white"
        aria-label={`Open full size: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- diagrams of unknown size, served as-is */}
        <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 border-t-2 border-l-2 border-border bg-background px-2 py-0.5 text-sm font-bold group-hover:bg-now"
        >
          Zoom ↗
        </span>
      </button>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            onClose={() => setOpen(false)}
            onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
            aria-label={alt}
            className="m-auto max-h-[94vh] max-w-[96vw] overflow-auto border-2 border-border bg-white p-0 backdrop:bg-black/70"
          >
            <div className="sticky top-0 left-0 z-10 flex justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
                className="border-b-2 border-l-2 border-border bg-background px-3 py-1 font-bold hover:bg-now"
              >
                Close ✕
              </button>
            </div>
            {/* Natural size: wider than the screen on a phone, so it pans. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="block h-auto w-[1400px] max-w-none" />
          </dialog>,
          document.body,
        )}
    </>
  );
}
