// Offline step for the RAG post (content/blogs/how-rag-works.mdx).
//
// Cuts the site's three earlier posts into chunks, embeds every chunk and the
// running question with all-MiniLM-L6-v2 (384 numbers each), ranks the chunks by
// cosine similarity, and lays everything out in 2D with UMAP for the map the
// clips draw. Nothing here runs when a reader opens the post.
//
//   cd scripts/rag-map && npm install && npm run embed
//
// The first run downloads the model (about 90 MB) from Hugging Face into
// node_modules. It writes src/components/mdx/rag/data.json, which the clips
// read, and prints a report. Re-run it if the posts, the question or the
// chunking change; the clips refuse to build if the question no longer matches.
//
//   node embed.mjs "Another question?" "A third one?"   compare questions (the first is written)
//   SEED=3 NN=20 MIN_DIST=0.9 SPREAD=2 node embed.mjs    try another map layout
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "@huggingface/transformers";
import { UMAP } from "umap-js";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "src/components/mdx/rag/data.json");
const MODEL = "Xenova/all-MiniLM-L6-v2";
const POSTS = [
  { id: "harness", file: "gujarati-image-harness.mdx" },
  { id: "rereading", file: "rereading-feels-like-learning.mdx" },
  { id: "agritech", file: "agritech-india-bottlenecks.mdx" },
];
const SEED = Number(process.env.SEED ?? 7);
const QUESTIONS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["How did an incorrect amount slip through?"];

// ---- chunking -------------------------------------------------------------
const clean = (s) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

/** One chunk per paragraph (or list). Headings, images, captions, tables, code and components are dropped. */
function paragraphs(mdx) {
  const body = mdx.replace(/^---[\s\S]*?---\n/, "").replace(/```[\s\S]*?```/g, "");
  return body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !/^(#|<|!\[|\||---)/.test(b) && !/^\*[^*].*\*$/.test(b))
    .map(clean)
    .filter((t) => t.length >= 40);
}

const sentences = (text) => text.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).filter((s) => s.length >= 20);

// ---- maths ----------------------------------------------------------------
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

/** Seeded random numbers, so the layout is the same on every run. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * UMAP keeps neighbours close, which is what the map is for. Distances across
 * the map mean little. Returns coordinates scaled to 0..1 on both axes.
 */
function layout(rows, seed) {
  const umap = new UMAP({
    nComponents: 2,
    nNeighbors: Number(process.env.NN ?? 30),
    minDist: Number(process.env.MIN_DIST ?? 0.99),
    spread: Number(process.env.SPREAD ?? 3),
    random: mulberry32(seed),
    distanceFn: (a, b) => 1 - dot(a, b),
  });
  const xy = umap.fit(rows);
  const [xs, ys] = [xy.map((p) => p[0]), xy.map((p) => p[1])];
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return xy.map(([x, y]) => [(x - x0) / (x1 - x0), (y - y0) / (y1 - y0)]);
}

// ---- run ------------------------------------------------------------------
const extractor = await pipeline("feature-extraction", MODEL, { dtype: "fp32" });
// Vectors are cached by text, so changing only the layout settings is quick.
const CACHE = path.join(import.meta.dirname, ".vectors.json");
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
async function embed(texts) {
  const missing = texts.filter((t) => !cache[t]);
  for (let i = 0; i < missing.length; i += 16) {
    const batch = missing.slice(i, i + 16);
    const t = await extractor(batch, { pooling: "mean", normalize: true });
    t.tolist().forEach((v, j) => (cache[batch[j]] = v.map((x) => +x.toFixed(6))));
  }
  if (missing.length) fs.writeFileSync(CACHE, JSON.stringify(cache));
  return texts.map((t) => cache[t]);
}

const chunks = [];
for (const post of POSTS) {
  const mdx = fs.readFileSync(path.join(ROOT, "content/blogs", post.file), "utf8");
  paragraphs(mdx).forEach((text, i) => chunks.push({ post: post.id, n: i + 1, text }));
}
const vectors = await embed(chunks.map((c) => c.text));

const sents = chunks
  .filter((c) => c.post === "harness")
  .flatMap((c) => sentences(c.text).map((text) => ({ post: c.post, para: c.n, text })));
const sentVectors = await embed(sents.map((s) => s.text));

const rank = (q, vecs) =>
  vecs
    .map((v, i) => ({ i, score: dot(q, v) }))
    .sort((a, b) => b.score - a.score);

const report = [];
let data = null;
for (const question of QUESTIONS) {
  const [q] = await embed([question]);
  const byPara = rank(q, vectors);
  const bySent = rank(q, sentVectors);
  report.push(`\nQ: ${question}`);
  report.push("  paragraphs:");
  byPara.slice(0, 5).forEach((r, k) => report.push(`   ${k + 1}. ${r.score.toFixed(3)} [${chunks[r.i].post} #${chunks[r.i].n}] ${chunks[r.i].text.slice(0, 110)}`));
  report.push("  sentences (harness post only):");
  bySent.slice(0, 5).forEach((r, k) => report.push(`   ${k + 1}. ${r.score.toFixed(3)} [para ${sents[r.i].para}] ${sents[r.i].text.slice(0, 110)}`));
  if (!data) {
    // The question is laid out with the chunks, as the last point.
    const xy = layout([...vectors, q], SEED);
    const flat = (i) => Math.hypot(xy[i][0] - xy[vectors.length][0], xy[i][1] - xy[vectors.length][1]);
    const flatOrder = vectors.map((_, i) => i).sort((a, b) => flat(a) - flat(b));
    report.push(`  on the map (seed ${SEED}), the top 3 are the question's ${byPara.slice(0, 3).map((r) => flatOrder.indexOf(r.i) + 1).join(", ")} nearest points`);
    data = {
      model: "all-MiniLM-L6-v2",
      dims: q.length,
      question,
      layout: `UMAP, seed ${SEED}`,
      questionXY: xy[vectors.length].map((v) => +v.toFixed(4)),
      questionVector: q.slice(0, 8).map((v) => +v.toFixed(3)),
      counts: Object.fromEntries(POSTS.map((p) => [p.id, chunks.filter((c) => c.post === p.id).length])),
      points: chunks.map((c, i) => ({ post: c.post, n: c.n, x: +xy[i][0].toFixed(4), y: +xy[i][1].toFixed(4) })),
      top: byPara.slice(0, 8).map((r) => ({
        post: chunks[r.i].post,
        n: chunks[r.i].n,
        score: +r.score.toFixed(3),
        text: chunks[r.i].text,
        vector: vectors[r.i].slice(0, 8).map((v) => +v.toFixed(3)),
      })),
      sentenceTop: bySent.slice(0, 8).map((r) => ({ para: sents[r.i].para, score: +r.score.toFixed(3), text: sents[r.i].text })),
      sentenceCount: sents.length,
      farthest: (() => {
        const r = byPara[byPara.length - 1];
        return { post: chunks[r.i].post, n: chunks[r.i].n, score: +r.score.toFixed(3), text: chunks[r.i].text };
      })(),
    };
  }
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`${chunks.length} paragraph chunks, ${sents.length} sentences in the harness post, ${data.dims} dims`);
console.log(report.join("\n"));
console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
