// Skeleton generator for a design-directions canvas. Copy next to lib.mjs in the scratchpad,
// rename to build.mjs, replace the frames.
//
//   node build.mjs                 pass 1: twins + boards at provisional heights
//   (serve this folder, open twins/measure.html, run `await measureAll()` → heights.json)
//   node build.mjs heights.json    pass 2: full-length boards get their measured height
//
// Two passes because a board's root element must be exactly the board's height, and a
// full-length frame's height is only known once a browser has laid it out.
//
// canvas.json below is the shape the Design type accepted on 2026-09-21 (v: 3). The type's own
// instructions arrive with the create result and win over this file — check them first.
import fs from "node:fs";
import path from "node:path";

import { VIEWPORT, dcFile, desktop, hero, mobile, postRow, section, twinFile } from "./lib.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const measured = process.argv[2]
  ? JSON.parse(fs.readFileSync(path.join(ROOT, process.argv[2]), "utf8"))
  : {};

// ---- frames: each is (h) => markup; h === null renders at natural height for measuring ----
const writing = section("Writing", [postRow("Apr 29, 2026", "Agritech in India: Promise and Bottlenecks")]);
// hero minH is min-h-[80vh]: 0.8 × the viewport height.
const todayDesktop = (h) => desktop({ h, body: [hero({ minH: 640 }), writing] });
const todayMobile = (h) => mobile({ h, body: [hero({ minH: 675 }), writing] });
const a1 = (h) => desktop({ h, body: [hero({ minH: 520, ctas: ["Work", "Writing"] }), writing] });

// vp: which viewport; fit: true → the frame is one viewport tall (the first screen),
// otherwise full length, measured. row: 0 is Today, then one row per direction.
// The first file must be Main.dc.html.
const FRAMES = [
  { key: "T1", file: "Main.dc.html", title: "Today · home — desktop", fn: todayDesktop, vp: "desktop", row: 0 },
  { key: "T2", file: "T2.dc.html", title: "Today · home — phone", fn: todayMobile, vp: "mobile", row: 0 },
  { key: "A1", file: "A1.dc.html", title: "A1 · <direction name> — desktop", fn: a1, vp: "desktop", row: 1 },
];
const ROWS = [
  { title: "Today — measured on the running site", color: "red", note: "TODAY\n• the measured diagnosis…\n\nIN EVERY DIRECTION\n• the shared fixes…" },
  { title: "A · <direction name>", color: "orange", note: "A — the bet…\nLength: …\nCost: …\nWeak spot: …" },
];
const QUESTIONS = "OPEN QUESTIONS (one word each)\n1. …";
const TITLE = "Canvas title";

// ---- files ----
fs.mkdirSync(path.join(ROOT, "out/project"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "twins"), { recursive: true });

const size = {};
for (const f of FRAMES) {
  const vp = VIEWPORT[f.vp];
  const h = f.fit ? vp.h : Math.max(vp.h, measured[f.key] ?? vp.h);
  size[f.key] = { w: vp.w, h };
  // <key>.html is the measuring twin (natural height); <key>.board.html is what the board will show.
  fs.writeFileSync(path.join(ROOT, "twins", `${f.key}.html`), twinFile({ title: f.title, markup: f.fn(null) }));
  fs.writeFileSync(path.join(ROOT, "twins", `${f.key}.board.html`), twinFile({ title: f.title, markup: f.fn(h) }));
  fs.writeFileSync(path.join(ROOT, "out/project", f.file), dcFile({ title: f.title, w: vp.w, h, markup: f.fn(h) }));
}

// One page that measures every twin in a single javascript_tool call (serve over http, not file://).
fs.writeFileSync(
  path.join(ROOT, "twins", "measure.html"),
  `<!doctype html><meta charset="utf-8"><title>measure</title>
${FRAMES.map((f) => `<iframe data-key="${f.key}" src="./${f.key}.html" width="${size[f.key].w}" height="6000" style="border:0"></iframe>`).join("\n")}
<script>
async function measureAll() {
  const out = {};
  for (const frame of document.querySelectorAll("iframe")) {
    const doc = frame.contentDocument;
    await doc.fonts.ready; // Lora line boxes change every height
    out[frame.dataset.key] = Math.ceil(doc.body.firstElementChild.getBoundingClientRect().height);
  }
  return out;
}
</script>`,
);

// A contact sheet to eyeball every board at real size before publishing.
fs.writeFileSync(
  path.join(ROOT, "twins", "sheet.html"),
  `<!doctype html><meta charset="utf-8"><title>sheet</title><body style="margin:0;display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;background:#ccc">
${FRAMES.map((f) => `<iframe src="./${f.key}.board.html" width="${size[f.key].w}" height="${size[f.key].h}" style="border:0"></iframe>`).join("\n")}`,
);

// ---- canvas.json: a row per direction, its sticky note on the left, a heading above ----
const GAP_X = 80;
const NOTE_W = 520;
const X0 = NOTE_W + 120;
const boards = {};
const order = [];
const notes = {};
let y = 0;
let widest = 0;
ROWS.forEach((r, ix) => {
  const rowFrames = FRAMES.filter((f) => f.row === ix);
  notes[`title${ix}`] = { x: 0, y: y - 260, text: r.title, kind: "title1", maxW: 2400 };
  notes[`note${ix}`] = { x: 0, y, text: r.note, w: NOTE_W, maxH: 1100, size: "m", color: r.color };
  let x = X0;
  for (const f of rowFrames) {
    boards[f.file] = { x, y, w: size[f.key].w, h: size[f.key].h, title: f.title };
    order.push(f.file);
    x += size[f.key].w + GAP_X;
  }
  widest = Math.max(widest, x);
  y += Math.max(1100, ...rowFrames.map((f) => size[f.key].h)) + 420;
});
notes.questions = { x: widest + 40, y: 0, w: NOTE_W, maxH: 700, size: "m", color: "blue", text: QUESTIONS };

fs.writeFileSync(
  path.join(ROOT, "out/project/canvas.json"),
  JSON.stringify(
    {
      v: 3,
      createdOnFiles: { v: 1, at: new Date().toISOString() },
      title: TITLE,
      launch: { view: "canvas" },
      pages: [],
      boards,
      order,
      notes,
      designSystems: [],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(Object.fromEntries(Object.entries(size).map(([k, v]) => [k, v.h]))));

