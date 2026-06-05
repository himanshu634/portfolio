"use client";

import { useEffect } from "react";

/**
 * global-error replaces the root layout when *it* crashes, so it ships its own
 * <html>/<body> and can't rely on the app's CSS or fonts. Everything here is
 * inline-styled in the site palette so it still looks right when the lights are
 * otherwise off.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
          background: "#faf8f5",
          color: "#1a1a1a",
          fontFamily: "Georgia, serif",
          lineHeight: 1.6,
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "#5a5a5a",
              margin: 0,
            }}
          >
            Error 500 — the catastrophic kind
          </p>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 600,
              margin: "1rem 0 1.25rem",
            }}
          >
            Well. The whole thing fell over.
          </h1>

          <p style={{ color: "#5a5a5a", margin: "0 auto", maxWidth: "28rem" }}>
            This is the error page for when the error page would&apos;ve errored.
            We&apos;ve officially hit the bottom. I&apos;ll go fix it — you try
            turning it off and on again.
          </p>

          <button
            onClick={() => reset()}
            style={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              marginTop: "1.75rem",
              padding: "0.6rem 1.25rem",
              background: "#1a1a1a",
              color: "#faf8f5",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            ↻ Reload the universe
          </button>
        </div>
      </body>
    </html>
  );
}
