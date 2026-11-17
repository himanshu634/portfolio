// The six clips of the RAG post. Positions, picks and scores on the map come
// from data.json, which scripts/rag-map/embed.mjs measures from the site's
// three earlier posts. Everything else is laid out by hand on a 600 x 600 board:
// header row 0-45, drawing 55-540, caption row 548-600.
import data from "./data.json";
import { Clip, type BuiltClip, type MarkKind } from "./engine";

type Point = [number, number];
interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ClipDefinition extends BuiltClip {
  /** What each step shows, in order. */
  steps: string[];
}

const SHAPE: Record<string, MarkKind> = { harness: "circle", rereading: "triangle", agritech: "square" };
const QUESTION_LINES = ["How did an incorrect", "amount slip through?"];
const QUESTION = QUESTION_LINES.join(" ");
if (QUESTION !== data.question) {
  throw new Error(`The clips are laid out for "${QUESTION}", but data.json was measured for "${data.question}".`);
}

const total = data.points.length;
const [first, second, third] = data.top;
const picks = [first, second, third];
const isPick = (p: { post: string; n: number }) => picks.some((t) => t.post === p.post && t.n === p.n);
const score = (v: number) => v.toFixed(2).replace("-", "−");

/** Cuts at a word boundary and marks the cut. */
function cut(text: string, max: number) {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  return `${head.slice(0, head.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

/** Eight real numbers as hatch levels 1-5: more lines, bigger value. */
function levels(vector: number[]) {
  const [lo, hi] = [Math.min(...vector), Math.max(...vector)];
  return vector.map((v) => 1 + Math.round((4 * (v - lo)) / (hi - lo)));
}

const place =
  (frame: Frame, pad = 24) =>
  (p: { x: number; y: number }): Point => [
    frame.x + pad + p.x * (frame.w - 2 * pad),
    frame.y + pad + p.y * (frame.h - 2 * pad),
  ];

/**
 * Draws the map: every chunk as a point, a shape for each post, swept in from
 * the left. Points for which `bright` is true go into `brightBeat`, so they
 * stay black when the rest of the map goes grey.
 */
function drawMap(
  c: Clip,
  frame: Frame,
  t: number,
  beat: number,
  brightBeat: number,
  bright: (p: { post: string; n: number }) => boolean,
) {
  const at = place(frame);
  c.rect(beat, frame.x, frame.y, frame.w, frame.h, t, 0.9);
  const rest = data.points.filter((p) => !bright(p)).sort((a, b) => a.x - b.x);
  for (let i = 0; i < rest.length; i += 4) {
    const group = rest.slice(i, i + 4);
    // One path per shape in the group; the group draws together.
    for (const kind of new Set(group.map((p) => SHAPE[p.post]))) {
      const points = group.filter((p) => SHAPE[p.post] === kind).map(at);
      c.marks(beat, kind, points, t + 0.7 + (i / 4) * 0.07, 0, 4.5, { sw: 1.5 });
    }
  }
  data.points.filter(bright).forEach((p, i) => c.marks(brightBeat, SHAPE[p.post], [at(p)], t + 2.5 + i * 0.1, 0, 6));
  return at;
}

// ---- 01 · the whole system ------------------------------------------------
function overview(): ClipDefinition {
  const c = new Clip(
    "01",
    "HOW RAG ANSWERS A QUESTION",
    "Line diagram drawn in five steps. Top lane, before anyone asks: posts are cut into chunks, an embedding model turns the chunks into points, and the points are stored in an index. Bottom lane, when a question comes in: the question goes through the same model, a search picks the 3 closest chunks from the index, those chunks and the question go into a prompt, and the LLM writes an answer that cites source 1.",
    { dims: { 1: [5.6, 0.35], 2: [9.6, 0.35], 3: [14, 0.4], 4: [18.2, 0.4] }, undim: 21.4, length: 24 },
  );
  // 1 · before anyone asks
  c.text(1, 20, 78, "Before anyone asks", 0.5, { weight: 800 });
  c.rect(1, 20, 88, 560, 152, 0.6, 1);
  c.path(1, "M57 106H80L98 124V198H34V106H57", 1.4, 0.6);
  c.path(1, "M80 106V124H98", 1.9, 0.2);
  c.path(1, "M44 144H88M44 160H88M44 176H74", 2, 0.4, { sw: 1.5 });
  c.text(1, 66, 228, "Posts", 2.1, { anchor: "middle" });
  c.arrow(1, [104, 152], [137, 152], 2.3);
  [106, 140, 174].forEach((y, i) => c.rect(1, 142, y, 84, 26, 2.6 + i * 0.12, 0.35));
  c.path(1, "M152 119H216M152 153H216M152 187H200", 3, 0.4, { sw: 1.5 });
  c.text(1, 184, 228, "Chunks", 3.1, { anchor: "middle" });
  c.arrow(1, [232, 152], [261, 152], 3.3);
  c.ellipse(1, 336, 152, 70, 44, 3.6);
  c.text(1, 336, 147, "Embedding", 4, { weight: 700, anchor: "middle" });
  c.text(1, 336, 171, "model", 4.1, { weight: 700, anchor: "middle" });
  c.arrow(1, [410, 152], [437, 152], 4.3);
  c.rect(3, 442, 104, 124, 92, 4.6, 0.6);
  const hits: Point[] = [[490, 142], [470, 170], [502, 178]];
  c.marks(3, "circle", [[462, 124], [508, 120], [528, 152], [548, 126], [544, 176], ...hits], 4.9, 0.06, 5);
  c.text(3, 446, 228, "Index", 5.1);
  // 2 · a question comes in
  c.text(2, 20, 276, "When a question comes in", 5.6, { weight: 800 });
  c.rect(2, 20, 286, 560, 248, 5.7, 1);
  c.rect(2, 34, 304, 150, 64, 6.5, 0.6);
  c.marker(2, "M66 352H152", 7.2);
  c.text(2, 109, 343, "Question", 6.9, { weight: 700, anchor: "middle" });
  c.arrow(2, [189, 336], [213, 336], 7.5, 0.3, { head: 8 });
  c.ellipse(2, 290, 336, 72, 34, 7.8);
  c.text(2, 290, 343, "Same model", 8.2, { weight: 700, anchor: "middle" });
  // 3 · search
  c.arrow(3, [366, 336], [390, 336], 9.6, 0.3, { head: 8 });
  c.diamond(3, 478, 336, 84, 40, 9.9, 0.7);
  c.text(3, 478, 343, "Closest 3", 10.4, { weight: 700, anchor: "middle" });
  c.arrow(3, [544, 200], [527.5, 315], 10.9, 0.5, { head: 11 });
  hits.forEach((p, i) => c.ring(3, p, 11.6 + i * 0.15, 9.5));
  // 4 · the prompt
  c.arrow(4, [478, 379], [478, 409], 14);
  c.rect(4, 392, 412, 174, 112, 14.3);
  c.text(4, 406, 438, "Prompt", 14.8, { weight: 700 });
  [449, 469, 489].forEach((y, i) => {
    c.rect(4, 406, y, 12, 12, 15.2 + i * 0.15, 0.25);
    c.path(4, `M426 ${y + 6}H${i < 2 ? 552 : 530}`, 15.3 + i * 0.15, 0.3, { sw: 1.5 });
  });
  c.marker(4, "M406 512H500", 16.3, 0.45, 4);
  // 5 · the model answers
  c.arrow(5, [386, 468], [361, 468], 18.2);
  c.ellipse(5, 296, 468, 58, 36, 18.5);
  c.text(5, 296, 475, "LLM", 18.9, { weight: 800, anchor: "middle" });
  c.arrow(5, [232, 468], [193, 468], 19.2);
  c.rect(5, 34, 430, 152, 76, 19.5);
  c.marker(5, "M62 497H158", 20.6, 0.4, 4);
  c.text(5, 110, 461, "Answer", 20, { weight: 700, anchor: "middle" });
  c.text(5, 110, 489, "cites [1]", 20.2, { weight: 500, anchor: "middle" });
  c.caption("FIRST, THE POSTS BECOME AN INDEX.", 0);
  c.caption("THEN SOMEONE ASKS A QUESTION.", 5.4);
  c.caption("SEARCH FINDS THE 3 CLOSEST CHUNKS.", 9.4);
  c.caption("THEY GO INTO THE PROMPT.", 13.8);
  c.caption("THE MODEL ANSWERS FROM THEM.", 18);
  return {
    ...c.build(),
    steps: [
      "Before anyone asks, the posts are cut into chunks. An embedding model turns each chunk into a list of numbers, and the lists are stored in an index.",
      "Someone asks a question. It goes through the same embedding model.",
      "A search compares the question's numbers with the index and picks the 3 closest chunks.",
      "Those 3 chunks and the question go into a prompt.",
      "An LLM reads the prompt and writes an answer that cites the chunk it used.",
    ],
  };
}

// ---- 02 · chunking ----------------------------------------------------------
function chunking(): ClipDefinition {
  const c = new Clip(
    "02",
    "ONE POST, CUT TWO WAYS",
    "Line drawing in five steps. A long post is drawn as a page of lines. Dashed lines cut it into 29 chunks, one per paragraph. Cut by paragraph, the chunk that holds the cause and the example stays in one box and ranks first of 95. Cut by sentence, that paragraph becomes separate boxes: the cause ranks second and the example fifth. The sentence that ranks first comes from another paragraph; it mentions a wrong price and does not say how it got through.",
    { dims: { 1: [12.9, 0.4], 2: [12.9, 0.4], 3: [17.7, 0.5] }, undim: 21.6, length: 24.2 },
  );
  // 1 · one post, as a page of paragraphs
  c.rect(1, 20, 62, 170, 472, 0.4, 0.9);
  const groups = [
    [84, 3], [124, 2], [155, 3], [195, 3], [235, 4], [284, 2],
    [315, 3], [355, 3], [395, 2], [426, 3], [466, 3], [506, 2],
  ];
  groups.forEach(([y, lines], i) => {
    let d = "";
    for (let j = 0; j < lines; j++) d += `M34 ${y + j * 9}H${j === lines - 1 ? 120 + ((i * 17) % 40) : 176}`;
    c.path(1, d, 1.2 + i * 0.12, 0.35, { sw: 1.5 });
  });
  // 2 · cut at every paragraph
  groups.slice(1).forEach(([y], i) => {
    const [prevY, prevLines] = groups[i];
    c.dashedLine(2, 12, (prevY + (prevLines - 1) * 9 + y) / 2, 198, 4.4 + i * 0.08);
  });
  c.text(2, 214, 84, "This post: 29 chunks", 5.4, { weight: 800 });
  // 3 · by paragraph, cause and example stay in one chunk
  c.marker(3, "M183 231V266", 8.4, 0.3, 4);
  c.arrow(3, [194, 246], [211, 192], 8.8, 0.3, { head: 8 });
  c.text(3, 214, 124, "Cut by paragraph", 9, { weight: 800 });
  c.rect(3, 214, 134, 366, 102, 9.2);
  c.text(3, 228, 164, "…found a number anywhere inside", 9.7, { weight: 500 });
  c.text(3, 228, 192, "a longer one. That check found", 9.9, { weight: 500 });
  c.text(3, 228, 220, "593 inside 2593, and a poster…", 10.1, { weight: 500 });
  c.marker(3, "M494 130H580", 11, 0.3, 4);
  c.text(3, 580, 124, `1st of ${total}`, 10.8, { weight: 800, anchor: "end" });
  // 4 · by sentence, the paragraph falls apart
  c.text(4, 214, 272, "Cut by sentence", 13, { weight: 800 });
  const sentences: [string, string][] = [
    ["…it found a number anywhere…", "2nd"],
    ["That check found 593 inside…", "5th"],
    ["We removed both allowances.", ""],
  ];
  sentences.forEach(([text, rank], i) => {
    const y = 282 + i * 44;
    c.rect(4, 214, y, 322, 36, 13.3 + i * 0.3, 0.5);
    c.text(4, 224, y + 25, text, 13.7 + i * 0.3, { weight: 500 });
    if (rank) c.text(4, 580, y + 25, rank, 15 + i * 0.4, { weight: 800, anchor: "end" });
  });
  // 5 · what ranks first instead
  c.rect(5, 214, 432, 322, 36, 17.9, 0.5);
  c.text(5, 224, 457, "A wrong price goes out to…", 18.3, { weight: 500 });
  c.marker(5, "M546 463H580", 19.1, 0.3, 4);
  c.text(5, 580, 457, "1st", 18.9, { weight: 800, anchor: "end" });
  c.text(5, 214, 496, "It mentions a wrong price.", 19.6, { weight: 500 });
  c.text(5, 214, 522, "It doesn't say how.", 19.9, { weight: 500 });
  c.caption("A POST IS TOO LONG TO SEARCH WHOLE.", 0);
  c.caption("SO IT IS CUT INTO CHUNKS.", 4.2);
  c.caption("BY PARAGRAPH, THE STORY STAYS WHOLE.", 8.2);
  c.caption("BY SENTENCE, THE EXAMPLE COMES 5TH.", 12.8);
  c.caption("THE CUT DECIDES WHAT SEARCH FINDS.", 17.6);
  return {
    ...c.build(),
    steps: [
      "A post is too long to search as one piece.",
      "So it is cut into chunks. Cut at every paragraph, the poster post becomes 29 chunks.",
      `Cut by paragraph, one chunk holds the cause, the example and the fix. For the question, it ranks 1st of ${total} chunks.`,
      "Cut by sentence, that paragraph becomes four separate chunks. The cause ranks 2nd and the example, 593 inside 2593, ranks 5th.",
      "The sentence that ranks 1st comes from another paragraph. It mentions a wrong price and doesn't say how one got through.",
    ],
  };
}

// ---- 03 · embedding ---------------------------------------------------------
function embedding(): ClipDefinition {
  const c = new Clip(
    "03",
    "FROM WORDS TO A POINT",
    `Line animation in five steps. A paragraph from the poster post is drawn in a box. It is replaced by a row of hatched cells, 8 of its 384 numbers. The row shrinks into one point on a map where every one of the ${total} chunks is a point. The question becomes numbers too, then a diamond that lands next to that point, although the two share no words. The least similar chunk sits far away, with a score of ${score(data.farthest.score)} against ${score(first.score)}.`,
    { dims: { 3: [17.3, 0.4] }, undim: 21.6, length: 24.2 },
  );
  const frame = { x: 20, y: 104, w: 560, h: 320 };
  const at = place(frame);
  const chunk = at(data.points.find((p) => p.post === first.post && p.n === first.n)!);
  const far = at(data.points.find((p) => p.post === data.farthest.post && p.n === data.farthest.n)!);
  const q = at({ x: data.questionXY[0], y: data.questionXY[1] });
  // 1 · one real chunk
  c.rect(1, 60, 128, 480, 226, 0.5, 0.9, { erase: 8.2 });
  c.path(1, "M79 159a7 7 0 1 1 14 0a7 7 0 1 1 -14 0", 1.2, 0.3, { erase: 8.2 });
  c.text(1, 102, 166, "The poster post", 1.3, { weight: 700, out: 8.1 });
  [
    "Our first version let a line pass",
    "with up to 15% of its letters wrong,",
    "and it found a number anywhere",
    "inside a longer one. That check",
    "found 593 inside 2593, and a…",
  ].forEach((line, i) => c.text(1, 84, 204 + i * 28, line, 1.7 + i * 0.15, { weight: 500, out: 3.8 }));
  // 2 · its numbers, which then shrink into one point
  let from = c.mark(2);
  c.cells(2, 103, 238, 44, 6, levels(first.vector), 4.4);
  c.shrinkInto(2, from, 8.5, chunk[0] - 300, chunk[1] - 260);
  c.text(2, 300, 318, "8 of its 384 numbers", 5.9, { anchor: "middle", out: 8.1 });
  // 3 · the map
  drawMap(c, frame, 8.6, 3, 4, (p) => (p.post === first.post && p.n === first.n) || (p.post === data.farthest.post && p.n === data.farthest.n));
  c.text(3, 60, 300, "Rereading", 11.6);
  c.text(3, 259, 372, "Agritech", 11.7, { anchor: "end" });
  c.text(3, 566, 180, "Posters", 11.8, { anchor: "end" });
  c.text(3, 34, 412, "A 2D view of 384 numbers", 12.1, { weight: 500 });
  // 4 · the question takes the same path and lands close
  c.rect(4, 20, 55, 530, 40, 13.9);
  c.marker(4, "M36 89H520", 14.8, 0.45, 4);
  c.text(4, 36, 82, QUESTION, 14.3, { weight: 700 });
  from = c.mark(4);
  c.cells(4, 388, 116, 18, 4, levels(data.questionVector), 15, true);
  c.shrinkInto(4, from, 16.1, q[0] - 474, q[1] - 125);
  c.diamond(4, q[0], q[1], 8, 8, 16.8, 0.3, { sw: 2.5 });
  c.diamond(4, q[0], q[1], 14, 14, 16.9, 0.35, { amber: true, sw: 3 });
  c.ripple(4, q, 17);
  c.link(4, q, chunk, 17.3, 16, 11.5);
  c.ring(4, chunk, 17.45, 10);
  // 5 · near and far, with their scores
  c.dashedLine(5, q[0] + 18, q[1], far[0] - 12, 18.5, far[1]);
  c.path(5, `M${far[0] - 10} ${far[1]}a10 10 0 1 1 20 0a10 10 0 1 1 -20 0`, 18.9, 0.35);
  c.rect(5, 20, 436, 560, 98, 19.1, 0.9);
  c.marker(5, "M36 478H84", 19.9, 0.3, 4);
  c.text(5, 36, 472, score(first.score), 19.6, { weight: 800 });
  c.text(5, 104, 472, cut(first.text, 38), 19.7, { weight: 500 });
  c.text(5, 36, 508, score(data.farthest.score), 20.1, { weight: 800 });
  c.text(5, 104, 508, cut(data.farthest.text, 38), 20.2, { weight: 500 });
  c.caption("HERE IS ONE CHUNK OF A POST.", 0);
  c.caption("A MODEL TURNS IT INTO 384 NUMBERS.", 3.7);
  c.caption("THE NUMBERS PLACE IT ON A MAP.", 8.2);
  c.caption("NO SHARED WORDS, YET IT LANDS CLOSE.", 13.7);
  c.caption("CLOSE MEANS SIMILAR. FAR MEANS NOT.", 18.2);
  return {
    ...c.build(),
    steps: [
      "Here is one chunk: the paragraph from the poster post about the first version of the line check.",
      "An embedding model turns the chunk into a list of 384 numbers. The clip shows 8 of them as hatched cells.",
      `Those numbers place the chunk as one point on a map. All ${total} chunks are on it: circles for the poster post, triangles for the rereading post, squares for the agritech post.`,
      "The question goes through the same model and lands next to that chunk, although the two share no words.",
      `Their similarity score is ${score(first.score)}. The least similar chunk, about how well the image model composes a scene, scores ${score(data.farthest.score)}.`,
    ],
  };
}

// ---- 04 · search --------------------------------------------------------------
function search(): ClipDefinition {
  const c = new Clip(
    "04",
    "THE QUESTION MEETS THE MAP",
    `Line animation in five steps. A question is drawn in a box. An arrow takes it to an embedding model, which turns it into a row of 384 numbers. A map is drawn with all ${total} chunks as points, a different shape for each post. The question lands on the map as a diamond and its 3 closest chunks are ringed. A list shows those 3 chunks with their scores: ${picks.map((p) => score(p.score)).join(", ")}.`,
    { dims: { 1: [3.9, 0.3], 2: [8.4, 0.3], 3: [16.2, 0.4] }, undim: 21.4, length: 24 },
  );
  const frame = { x: 20, y: 200, w: 560, h: 236 };
  // 1 · the question
  c.rect(1, 20, 62, 330, 74, 0.5, 0.8);
  c.marker(1, "M36 129H252", 1.9);
  c.text(1, 36, 93, QUESTION_LINES[0], 1.1, { size: 22, weight: 700 });
  c.text(1, 36, 121, QUESTION_LINES[1], 1.3, { size: 22, weight: 700 });
  // 2 · embed
  c.arrow(2, [351, 99], [383, 99], 3.9);
  c.rect(2, 386, 62, 194, 74, 4.2);
  c.text(2, 483, 93, "Embedding", 4.7, { size: 22, weight: 700, anchor: "middle" });
  c.text(2, 483, 121, "model", 4.8, { size: 22, weight: 700, anchor: "middle" });
  c.arrow(2, [483, 137], [483, 157], 5.3, 0.25, { head: 8 });
  c.cells(2, 397, 166, 18, 4, levels(data.questionVector), 5.7);
  c.text(2, 380, 182, "384 numbers", 6.6, { anchor: "end" });
  // 3 · the map
  const at = drawMap(c, frame, 8.4, 3, 4, isPick);
  c.text(3, 60, 352, "Rereading", 11.2);
  c.text(3, 262, 398, "Agritech", 11.3, { anchor: "end" });
  c.text(3, 568, 236, "Posters", 11.4, { anchor: "end" });
  // 4 · the question lands, the 3 closest are picked
  const q = at({ x: data.questionXY[0], y: data.questionXY[1] });
  const [dx, dy] = [q[0] - 400, q[1] - 192];
  const reach = Math.hypot(dx, dy);
  c.arrow(4, [400, 192], [q[0] - (20 * dx) / reach, q[1] - (20 * dy) / reach], 13.9, 0.7, { head: 11 });
  c.diamond(4, q[0], q[1], 8, 8, 14.7, 0.35, { sw: 2.5 });
  c.diamond(4, q[0], q[1], 14, 14, 14.9, 0.4, { amber: true, sw: 3 });
  c.ripple(4, q, 15);
  picks.forEach((pick, i) => {
    const p = at(data.points.find((point) => point.post === pick.post && point.n === pick.n)!);
    c.link(4, q, p, 15.8 + i * 0.2, 16, 11.5);
    c.ring(4, p, 16 + i * 0.2, 10);
  });
  // 5 · the result: three chunks and their scores
  c.rect(5, 20, 446, 560, 92, 18.4, 0.9);
  picks.forEach((pick, i) => {
    const y = 472 + i * 27;
    c.rect(5, 32, y - 17, 22, 22, 19 + i * 0.25, 0.3);
    c.marker(5, `M64 ${y + 5}H106`, 19.3 + i * 0.25, 0.25, 4);
    c.text(5, 43, y, String(i + 1), 19.1 + i * 0.25, { weight: 800, anchor: "middle" });
    c.text(5, 64, y, score(pick.score), 19.2 + i * 0.25, { weight: 800 });
    c.text(5, 120, y, cut(pick.text, 38), 19.3 + i * 0.25, { weight: 500 });
  });
  c.caption("A READER ASKS A QUESTION.", 0);
  c.caption("THE MODEL TURNS IT INTO 384 NUMBERS.", 3.7);
  c.caption(`ALL ${total} CHUNKS ARE ALREADY ON THE MAP.`, 8.2);
  c.caption("THE 3 CLOSEST CHUNKS ARE PICKED.", 13.7);
  c.caption(`3 CHUNKS GO ON. ${total - 3} STAY BEHIND.`, 18.2);
  return {
    ...c.build(),
    steps: [
      `A reader asks: "${QUESTION}"`,
      "The embedding model turns the question into 384 numbers.",
      `All ${total} chunks are already on the map: circles for the poster post, triangles for the rereading post, squares for the agritech post.`,
      "The question lands on the map as a diamond, and the 3 chunks closest to it are ringed.",
      `Those 3 chunks go on to the model, with scores ${picks.map((p) => score(p.score)).join(", ")}. The other ${total - 3} stay behind.`,
    ],
  };
}

// ---- 05 · the prompt ------------------------------------------------------------
function prompt(): ClipDefinition {
  const c = new Clip(
    "05",
    "WHAT THE MODEL READS",
    "Line drawing in five steps. The 3 chunks from the search are drawn as numbered boxes. A prompt box is drawn below them and starts with a rule: answer only from these sources. The 3 chunks and then the question go into the prompt. An arrow takes the prompt to an LLM. The LLM's answer names source 1, and an amber line runs from the answer back to chunk 1.",
    { dims: { 1: [13.2, 0.45], 2: [17.2, 0.4], 3: [17.2, 0.4] }, undim: 21.2, length: 23.8 },
  );
  // 1 · what search handed over
  picks.forEach((pick, i) => {
    const y = 62 + i * 40;
    c.rect(1, 20, y, 520, 34, 0.5 + i * 0.5, 0.6);
    c.rect(1, 28, y + 6, 22, 22, 0.8 + i * 0.5, 0.3);
    c.text(1, 39, y + 23, String(i + 1), 0.9 + i * 0.5, { weight: 800, anchor: "middle" });
    c.text(1, 62, y + 24, cut(pick.text, 40), 1 + i * 0.5, { weight: 500 });
  });
  // 2 · the prompt starts with a rule
  c.rect(2, 20, 200, 520, 184, 4.7, 0.9);
  c.text(2, 36, 228, "Prompt", 5.2, { weight: 800 });
  c.text(2, 36, 258, "Answer only from these sources.", 5.7);
  // 3 · then the chunks, then the question
  c.arrow(3, [280, 178], [280, 198], 8.7, 0.25, { head: 8 });
  [272, 296, 320].forEach((y, i) => {
    c.rect(3, 36, y, 14, 14, 9.2 + i * 0.3, 0.25);
    c.path(3, `M62 ${y + 7}H${i < 2 ? 500 : 440}`, 9.3 + i * 0.3, 0.4, { sw: 1.5 });
  });
  c.marker(3, "M36 369H500", 11, 0.5, 4);
  c.text(3, 36, 362, QUESTION, 10.5, { weight: 700 });
  // 4 · the model reads all of it
  c.arrow(4, [110, 386], [110, 414], 13.2, 0.3);
  c.ellipse(4, 110, 452, 74, 34, 13.6);
  c.text(4, 110, 459, "LLM", 14.1, { weight: 800, anchor: "middle" });
  // 5 · the answer points back at its source
  c.arrow(5, [186, 452], [212, 452], 17.2, 0.3);
  c.rect(5, 216, 402, 324, 132, 17.5, 0.8);
  c.text(5, 232, 434, "A loose check found 593", 18, { weight: 500 });
  c.text(5, 232, 462, "inside 2593, so the wrong", 18.15, { weight: 500 });
  c.text(5, 232, 490, "price passed.", 18.3, { weight: 500 });
  c.text(5, 232, 520, "Source", 18.7, { weight: 700 });
  c.rect(5, 314, 503, 22, 22, 18.9, 0.3);
  c.text(5, 325, 520, "1", 19, { weight: 800, anchor: "middle" });
  c.path(5, "M341 514H562V79H546L556 73L546 79L556 85", 19.4, 1.1, { amber: true, sw: 3, bevel: true });
  c.rect(5, 24, 64, 30, 30, 20.5, 0.35, { amber: true, sw: 3 });
  c.caption("SEARCH HANDS OVER 3 CHUNKS.", 0);
  c.caption("THE PROMPT STARTS WITH A RULE.", 4.5);
  c.caption("THEN THE CHUNKS, THEN THE QUESTION.", 8.5);
  c.caption("THE MODEL READS ALL OF IT.", 13);
  c.caption("THE ANSWER POINTS BACK AT SOURCE 1.", 17);
  return {
    ...c.build(),
    steps: [
      "Search hands over the 3 closest chunks, numbered 1 to 3.",
      "The prompt starts with a rule: answer only from these sources.",
      "The 3 chunks go into the prompt, and the question goes in last.",
      "An LLM reads the whole prompt.",
      "The answer names source 1, so a reader can open chunk 1 and check the claim.",
    ],
  };
}

// ---- 06 · where it breaks --------------------------------------------------------
function breaks(): ClipDefinition {
  const c = new Clip(
    "06",
    "WHERE THE ANSWER SITS MATTERS",
    "Line chart drawn in five steps, from a 2023 study with 20 documents. With the answer in the 1st document, the model was right 75.8% of the time. With the answer in the 10th, 53.8%. With no documents at all, 56.1%. A reranker scores every chunk against the question again, and an arrow moves the best chunk from 10th place to 1st.",
    { dims: { 1: [13.7, 0.45], 2: [13.7, 0.45], 3: [13.7, 0.45] }, undim: 21.4, length: 24 },
  );
  const boxX = (i: number) => 22 + i * 28;
  const row = (beat: number, y: number, t: number) => {
    for (let g = 0; g < 4; g++) {
      let d = "";
      for (let i = g * 5; i < g * 5 + 5; i++) d += `M${boxX(i) + 12} ${y}H${boxX(i) + 24}V${y + 24}H${boxX(i)}V${y}H${boxX(i) + 12}`;
      c.path(beat, d, t + g * 0.12, 0.5, { sw: 1.5 });
    }
  };
  const bar = (beat: number, y: number, share: number, t: number, label: string, labelY: number) => {
    c.path(beat, `M20 ${y}H580`, t, 0.5, { sw: 1 });
    c.path(beat, `M20 ${y}H${20 + 560 * share}`, t + 0.4, 0.9, { sw: 5 });
    c.text(beat, 580, labelY, label, t + 1.2, { weight: 800, anchor: "end" });
  };
  // 1 · the answer comes first
  c.text(1, 20, 84, "The answer is 1st of 20", 0.5);
  row(1, 96, 0.9);
  c.rect(1, boxX(0) - 3, 93, 30, 30, 1.7, 0.35, { amber: true, sw: 3 });
  bar(1, 140, 0.758, 2.1, "75.8%", 84);
  // 2 · the answer sits in the middle
  c.text(2, 20, 184, "The answer is 10th", 4.7);
  row(2, 196, 5.1);
  c.rect(2, boxX(9) - 3, 193, 30, 30, 5.9, 0.35, { amber: true, sw: 3 });
  bar(2, 240, 0.538, 6.3, "53.8%", 184);
  // 3 · nothing is retrieved at all
  c.text(3, 20, 284, "No documents at all", 9.2);
  c.dashedRect(3, 22, 296, 556, 24, 9.6);
  bar(3, 340, 0.561, 10.3, "56.1%", 284);
  // 4 · a reranker scores the chunks again
  c.text(4, 20, 388, "A reranker reads each chunk with the question", 13.9);
  row(4, 404, 14.4);
  c.rect(4, boxX(9) - 3, 401, 30, 30, 15.2, 0.35, { amber: true, sw: 3, erase: 18.2 });
  // 5 · and moves the best one to the front
  c.arrow(5, [boxX(9) + 12, 438], [boxX(0) + 12, 436], 18.3, 0.9, { amber: true, sw: 3, head: 11, c1: [boxX(9) + 12, 492], c2: [boxX(0) + 12, 492] });
  c.rect(5, boxX(0) - 3, 401, 30, 30, 19.2, 0.35, { amber: true, sw: 3 });
  c.text(5, 580, 520, "Now the answer is 1st.", 19.7, { weight: 800, anchor: "end" });
  c.caption("ANSWER 1ST OF 20: 75.8% CORRECT.", 0);
  c.caption("BURIED 10TH OF 20: 53.8%.", 4.5);
  c.caption("NO DOCUMENTS AT ALL: 56.1%.", 9);
  c.caption("A RERANKER SCORES EVERY CHUNK AGAIN.", 13.7);
  c.caption("THE BEST CHUNK MOVES TO THE FRONT.", 18);
  return {
    ...c.build(),
    steps: [
      "In a 2023 study, a model was handed 20 documents. With the answer in the 1st document, it answered 75.8% of questions correctly.",
      "With the answer in the 10th document, in the middle, it answered 53.8% correctly.",
      "With no documents at all, it answered 56.1% correctly. Burying the answer was worse than retrieving nothing.",
      "A reranker reads each chunk together with the question and scores it again.",
      "The best chunk moves from 10th place to 1st, where the model reads it most reliably.",
    ],
  };
}

const builders = { overview, chunking, embedding, search, prompt, breaks };
export type ClipName = keyof typeof builders;

const built = new Map<ClipName, ClipDefinition>();
export function getClip(name: ClipName): ClipDefinition {
  if (!built.has(name)) built.set(name, builders[name]());
  return built.get(name)!;
}
