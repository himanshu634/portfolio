// Tiny Excalidraw scene kit: line-only, black ink, amber stroke for what breaks.
import fs from "node:fs";
import path from "node:path";

const W = JSON.parse(fs.readFileSync(new URL("./widths.json", import.meta.url)));
export const INK = "#000000";
export const AMBER = "#ffb000";
export const MUTED = "#4d4d4d";

export function measure(str, size) {
  const lines = String(str).split("\n");
  const w = Math.max(...lines.map((l) => [...l].reduce((s, c) => s + (W[c] ?? 60), 0))) * (size / 100);
  return { w: Math.ceil(w), h: Math.ceil(lines.length * size * 1.25) };
}

let seedN = 1000;
const base = (type, o) => ({
  id: o.id ?? `${type}-${seedN}`,
  type,
  x: o.x,
  y: o.y,
  width: o.width ?? 0,
  height: o.height ?? 0,
  angle: 0,
  strokeColor: o.color ?? INK,
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: o.sw ?? 2,
  strokeStyle: o.dash ? (o.dash === "dot" ? "dotted" : "dashed") : "solid",
  roughness: o.rough ?? 1,
  opacity: 100,
  groupIds: [],
  frameId: null,
  roundness: o.roundness ?? null,
  seed: seedN++,
  version: 1,
  versionNonce: seedN++,
  isDeleted: false,
  boundElements: [],
  updated: 1,
  link: null,
  locked: false,
});

export class Scene {
  constructor() {
    this.els = [];
  }
  text(x, y, str, o = {}) {
    const size = o.size ?? 20;
    const m = measure(str, size);
    const align = o.align ?? "left";
    const x0 = align === "center" ? x - m.w / 2 : align === "right" ? x - m.w : x;
    const el = {
      ...base("text", { ...o, x: x0, y, width: m.w, height: m.h }),
      text: str,
      originalText: str,
      fontSize: size,
      fontFamily: 5,
      textAlign: align,
      verticalAlign: "top",
      containerId: o.containerId ?? null,
      lineHeight: 1.25,
      autoResize: true,
    };
    if (o.containerId) el.verticalAlign = "middle";
    this.els.push(el);
    return { ...m, x: x0, y, el };
  }
  // A box with its label bound inside (moves with the box at excalidraw.com).
  box(x, y, w, h, label, o = {}) {
    const size = o.size ?? 20;
    if (w === "fit") w = measure(label, size).w + (o.pad ?? 28);
    if (h === "fit") h = measure(label, size).h + 24;
    const shape = o.shape ?? "rectangle";
    const r = base(shape, { ...o, x, y, width: w, height: h });
    this.els.push(r);
    if (label) {
      const m = measure(label, size);
      const t = this.text(x + w / 2, y + (h - m.h) / 2, label, {
        size,
        align: "center",
        color: o.textColor ?? INK,
        containerId: r.id,
      });
      // bound text sits in the container's box
      r.boundElements.push({ type: "text", id: t.el.id });
    }
    return geom(x, y, w, h, r.id);
  }
  line(points, o = {}) {
    const [x0, y0] = points[0];
    const rel = points.map(([x, y]) => [x - x0, y - y0]);
    const xs = rel.map((p) => p[0]), ys = rel.map((p) => p[1]);
    const el = {
      ...base(o.arrow ? "arrow" : "line", {
        ...o,
        x: x0,
        y: y0,
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
        roundness: o.curve ? { type: 2 } : null,
      }),
      points: rel,
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      startArrowhead: o.start ?? null,
      endArrowhead: o.arrow ? "arrow" : null,
    };
    this.els.push(el);
    return el;
  }
  arrow(points, o = {}) {
    return this.line(points, { ...o, arrow: true });
  }
  write(file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          type: "excalidraw",
          version: 2,
          source: "https://excalidraw.com",
          elements: this.els,
          appState: { viewBackgroundColor: "#ffffff", gridSize: null },
          files: {},
        },
        null,
        1,
      ),
    );
  }
}

export function geom(x, y, w, h, id) {
  return { id, x, y, w, h, cx: x + w / 2, cy: y + h / 2, l: x, r: x + w, t: y, b: y + h };
}

// arrow from right edge of a to left edge of b (same row)
export const right = (S, a, b, o = {}) =>
  S.arrow([[a.r + 6, a.cy], [b.l - 6, b.cy]], o);
export const down = (S, a, b, o = {}) =>
  S.arrow([[a.cx, a.b + 6], [b.cx, b.t - 6]], o);
