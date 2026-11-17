import { ClipPlayer } from "./clip-player";
import { getClip, type ClipName } from "./clips";

/**
 * One animated line clip of the RAG post, placed where an image would go:
 * `<RagClip name="search" caption="…" />`. The drawing is built here, on the
 * server; only the small player that drives it ships to the browser.
 */
export function RagClip({ name, caption }: { name: ClipName; caption?: string }) {
  const { svg, beats, steps } = getClip(name);
  return <ClipPlayer svg={svg} beats={beats} steps={steps} caption={caption} />;
}
