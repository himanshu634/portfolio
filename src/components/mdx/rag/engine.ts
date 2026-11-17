// Builds the line-only clips of the RAG post as SVG markup.
//
// The kit: rectangle (something you can read), ellipse (a model), diamond (the
// question), arrow (data moves this way), point marks (a chunk on the map),
// hatched cells (numbers), dashed circle (what search looks at) and an amber
// stroke (the question, and what it picked). Nothing is filled.
//
// Every element carries its start time as a CSS variable and one of the
// `.rag-clip` animation classes from globals.css, so the markup stays small.
// Without animation (reduced motion) each element rests in its final state and
// the clip is its finished drawing. This file only runs on the server.

export interface BuiltClip {
  svg: string;
  /** Seconds until the finished drawing has been held long enough to loop. */
  length: number;
  /** Start time of each step, in seconds. */
  beats: number[];
}

type Point = [number, number];

interface PathOptions {
  amber?: boolean;
  sw?: number;
  bevel?: boolean;
  /** Undraw the stroke again at this time. */
  erase?: number;
}

interface TextOptions {
  size?: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  /** Fade the text out again at this time. */
  out?: number;
}

const n = (v: number) => String(Math.round(v * 100) / 100);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Closed shapes start in the middle of an edge, so every corner is a real join.
const rectD = (x: number, y: number, w: number, h: number) =>
  `M${n(x + w / 2)} ${n(y)}H${n(x + w)}V${n(y + h)}H${n(x)}V${n(y)}H${n(x + w / 2)}`;

const ellipseD = (cx: number, cy: number, rx: number, ry: number) =>
  `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 1 ${n(2 * rx)} 0a${n(rx)} ${n(ry)} 0 1 1 ${n(-2 * rx)} 0`;

const diamondD = (cx: number, cy: number, rx: number, ry: number) => {
  const sx = cx + rx / 2;
  const sy = cy - ry / 2;
  return `M${n(sx)} ${n(sy)}L${n(cx + rx)} ${n(cy)}L${n(cx)} ${n(cy + ry)}L${n(cx - rx)} ${n(cy)}L${n(cx)} ${n(cy - ry)}L${n(sx)} ${n(sy)}`;
};

const triangleD = (cx: number, cy: number, s = 1) =>
  `M${n(cx)} ${n(cy + 6 * s)}H${n(cx + 8 * s)}L${n(cx)} ${n(cy - 8 * s)}L${n(cx - 8 * s)} ${n(cy + 6 * s)}H${n(cx)}`;

function arrowD(x1: number, y1: number, x2: number, y2: number, head: number, c1?: Point, c2?: Point) {
  const shaft = c1 && c2
    ? `M${n(x1)} ${n(y1)}C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(x2)} ${n(y2)}`
    : `M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`;
  const angle = c2 ? Math.atan2(y2 - c2[1], x2 - c2[0]) : Math.atan2(y2 - y1, x2 - x1);
  const spread = (28 * Math.PI) / 180;
  const barb = (side: number): Point => [
    x2 + head * Math.cos(angle + Math.PI + side * spread),
    y2 + head * Math.sin(angle + Math.PI + side * spread),
  ];
  const [a, b] = [barb(-1), barb(1)];
  return `${shaft}L${n(a[0])} ${n(a[1])}L${n(x2)} ${n(y2)}L${n(b[0])} ${n(b[1])}`;
}

export type MarkKind = "circle" | "triangle" | "square";

export const markD = (kind: MarkKind, cx: number, cy: number, r = 7) =>
  kind === "circle"
    ? ellipseD(cx, cy, r, r)
    : kind === "triangle"
      ? triangleD(cx, cy, r / 7)
      : rectD(cx - (r * 6) / 7, cy - (r * 6) / 7, (r * 12) / 7, (r * 12) / 7);

export class Clip {
  private shapes: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  private texts: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  private captions: string[] = [];
  private beats: number[] = [];

  /**
   * `dims` greys a finished step while the next one draws: step → [time, opacity].
   * Everything returns to full strength at `undim`, and the loop restarts at `length`.
   */
  constructor(
    private number: string,
    private title: string,
    private label: string,
    private timing: { dims: Record<number, [number, number]>; undim: number; length: number },
  ) {}

  // ---- components ----
  path(beat: number, d: string, t: number, dur = 0.5, o: PathOptions = {}) {
    const cls = `${o.erase === undefined ? "d" : "de"}${o.amber ? " a" : ""}`;
    const vars = [`--t:${n(t)}s`];
    if (dur !== 0.5) vars.push(`--d:${n(dur)}s`);
    if (o.erase !== undefined) vars.push(`--e:${n(o.erase)}s`);
    const sw = o.sw ? ` stroke-width="${o.sw}"` : "";
    const join = o.bevel ? ' stroke-linejoin="bevel"' : "";
    this.shapes[beat].push(`<path pathLength="1" class="${cls}" style="${vars.join(";")}"${sw}${join} d="${d}"/>`);
  }

  rect(beat: number, x: number, y: number, w: number, h: number, t: number, dur = 0.7, o?: PathOptions) {
    this.path(beat, rectD(x, y, w, h), t, dur, o);
  }

  ellipse(beat: number, cx: number, cy: number, rx: number, ry: number, t: number, dur = 0.7, o?: PathOptions) {
    this.path(beat, ellipseD(cx, cy, rx, ry), t, dur, o);
  }

  diamond(beat: number, cx: number, cy: number, rx: number, ry: number, t: number, dur = 0.45, o?: PathOptions) {
    this.path(beat, diamondD(cx, cy, rx, ry), t, dur, o);
  }

  arrow(
    beat: number,
    from: Point,
    to: Point,
    t: number,
    dur = 0.3,
    o: PathOptions & { head?: number; c1?: Point; c2?: Point } = {},
  ) {
    this.path(beat, arrowD(from[0], from[1], to[0], to[1], o.head ?? 9, o.c1, o.c2), t, dur, { ...o, bevel: true });
  }

  /** Small shapes drawn one after another. */
  marks(beat: number, kind: MarkKind, points: Point[], t: number, step = 0.09, r = 7, o?: PathOptions) {
    points.forEach(([cx, cy], i) => this.path(beat, markD(kind, cx, cy, r), t + i * step, 0.3, o));
  }

  ring(beat: number, [cx, cy]: Point, t: number, r = 11.5) {
    this.path(beat, ellipseD(cx, cy, r, r), t, 0.35, { amber: true, sw: 3 });
  }

  /** Amber line from the question's diamond to a picked point, stopping at both outlines. */
  link(beat: number, q: Point, p: Point, t: number, rq = 17, rp = 13) {
    const [dx, dy] = [p[0] - q[0], p[1] - q[1]];
    const length = Math.hypot(dx, dy);
    const manhattan = Math.abs(dx) + Math.abs(dy);
    if (length < rq + rp) return;
    const s: Point = [q[0] + (rq * dx) / manhattan, q[1] + (rq * dy) / manhattan];
    const e: Point = [p[0] - (rp * dx) / length, p[1] - (rp * dy) / length];
    this.path(beat, `M${n(s[0])} ${n(s[1])}L${n(e[0])} ${n(e[1])}`, t, 0.25, { amber: true, sw: 3 });
  }

  /** Amber highlighter stroke; it sits under the text drawn after it. */
  marker(beat: number, d: string, t: number, dur = 0.45, sw = 5) {
    this.path(beat, d, t, dur, { amber: true, sw });
  }

  /** A bracketed row of hatched cells: a list of numbers. More lines, bigger value. */
  cells(beat: number, x: number, y: number, size: number, gap: number, levels: number[], t: number, amberBrackets = false) {
    const width = levels.length * size + (levels.length - 1) * gap;
    const [b, p] = [6, 7];
    const bracket = { amber: amberBrackets, sw: amberBrackets ? 3 : undefined };
    this.path(beat, `M${n(x - p + b)} ${n(y - p)}H${n(x - p)}V${n(y + size + p)}H${n(x - p + b)}`, t, 0.3, bracket);
    this.path(beat, `M${n(x + width + p - b)} ${n(y - p)}H${n(x + width + p)}V${n(y + size + p)}H${n(x + width + p - b)}`, t + 0.1, 0.3, bracket);
    levels.forEach((level, i) => {
      const cx = x + i * (size + gap);
      this.path(beat, rectD(cx, y, size, size), t + 0.25 + i * 0.06, 0.25);
      let hatch = "";
      for (let j = 1; j <= level; j++) {
        const c = (2 * size * j) / (level + 1);
        const [u1, u2] = [Math.max(0, c - size), Math.min(size, c)];
        hatch += `M${n(cx + u1)} ${n(y + size - (c - u1))}L${n(cx + u2)} ${n(y + size - (c - u2))}`;
      }
      if (hatch) this.path(beat, hatch, t + 0.6 + i * 0.06, 0.1 + 0.1 * level, { sw: 1.5 });
    });
  }

  dashedCircle(beat: number, [cx, cy]: Point, r: number, t: number) {
    this.shapes[beat].push(
      `<circle class="p" style="--t:${n(t)}s" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" stroke-width="1.5" stroke-dasharray="6 6"/>`,
    );
  }

  /** Dashed strokes mean "cut here", "not picked" or "nothing there". They pop in; they are never drawn solid. */
  dashedLine(beat: number, x1: number, y1: number, x2: number, t: number, y2 = y1) {
    this.shapes[beat].push(
      `<line class="p" style="--t:${n(t)}s" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke-width="1.5" stroke-dasharray="6 6"/>`,
    );
  }

  dashedRect(beat: number, x: number, y: number, w: number, h: number, t: number) {
    this.shapes[beat].push(
      `<rect class="p" style="--t:${n(t)}s" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" stroke-width="1.5" stroke-dasharray="6 6"/>`,
    );
  }

  ripple(beat: number, [cx, cy]: Point, t: number) {
    this.shapes[beat].push(`<circle class="r a" style="--t:${n(t)}s" cx="${n(cx)}" cy="${n(cy)}" r="12" stroke-width="3"/>`);
  }

  text(beat: number, x: number, y: number, s: string, t: number, o: TextOptions = {}) {
    const anchor = o.anchor && o.anchor !== "start" ? ` text-anchor="${o.anchor}"` : "";
    const cls = o.out === undefined ? "s" : "so";
    const vars = `--t:${n(t)}s${o.out === undefined ? "" : `;--e:${n(o.out)}s`}`;
    this.texts[beat].push(
      `<text class="${cls}" style="${vars}" x="${n(x)}" y="${n(y)}" font-size="${o.size ?? 21}" font-weight="${o.weight ?? 600}"${anchor}>${esc(s)}</text>`,
    );
  }

  /** Wraps everything drawn since `from` so it can shrink into one point. */
  shrinkInto(beat: number, from: number, t: number, dx: number, dy: number) {
    const items = this.shapes[beat].splice(from);
    this.shapes[beat].push(`<g class="sh" style="--t:${n(t)}s;--dx:${n(dx)}px;--dy:${n(dy)}px">${items.join("")}</g>`);
  }

  mark(beat: number) {
    return this.shapes[beat].length;
  }

  /** One caption per step. A caption stays until the next one starts. */
  caption(s: string, t: number) {
    this.beats.push(t);
    this.captions.push(esc(s));
  }

  // ---- the SVG ----
  build(): BuiltClip {
    const { dims, undim, length } = this.timing;
    const layer = (store: Record<number, string[]>) =>
      [1, 2, 3, 4, 5]
        .filter((b) => store[b].length)
        .map((b) => {
          const inner = store[b].join("");
          const dim = dims[b];
          return dim ? `<g class="dm" style="--t:${n(dim[0])}s;--lv:${dim[1]};--u:${n(undim)}s">${inner}</g>` : inner;
        })
        .join("");
    const captions = this.captions
      .map((s, i) => {
        const last = i === this.captions.length - 1;
        const start = Math.max(0.3, this.beats[i]);
        const vars = `--t:${n(start)}s${last ? "" : `;--e:${n(this.beats[i + 1] - 0.25)}s`}`;
        return `<text class="c ${last ? "s" : "so"}" style="${vars}" x="20" y="585">${s}</text>`;
      })
      .join("");
    const svg =
      `<svg viewBox="0 0 600 600" role="img" aria-label="${esc(this.label)}">` +
      `<rect x="1" y="1" width="598" height="598"/>` +
      `<line x1="0" y1="45" x2="600" y2="45"/><line x1="64" y1="0" x2="64" y2="45" stroke-width="1"/>` +
      `<text class="c" x="32" y="32" font-size="24" text-anchor="middle">${esc(this.number)}</text>` +
      `<text class="c" x="80" y="32" font-size="24">${esc(this.title)}</text>` +
      `<line x1="0" y1="548" x2="600" y2="548"/><line x1="548" y1="548" x2="548" y2="600" stroke-width="1"/>` +
      `<line class="pg a" style="--len:${n(length)}s" x1="0" y1="548" x2="548" y2="548" stroke-width="4"/>` +
      `<g class="w">${layer(this.shapes)}${layer(this.texts)}${captions}</g>` +
      `</svg>`;
    return { svg, length, beats: this.beats.map((t) => Math.max(0, t)) };
  }
}
