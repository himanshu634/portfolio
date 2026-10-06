// Portfolio frame kit for design canvases (design-directions skill). Copy this folder into the
// session scratchpad and build on it there; it is a seed, not a library to import from here.
//
// Tokens are copied from src/app/globals.css and the anatomy from src/components/ (header,
// about, writing, work-ex, footer) and src/app/blog/[slug]/page.tsx on 2026-10-06. Both drift:
// before a round, check the hexes against globals.css and the anatomy against the page you are
// redesigning, and add the pieces your page has that this file lacks.
//
// Calibrated 2026-10-06: the example Today twins measured 1127 / 1250 px against the live home
// page's 1084 / 1211 px (desktop 1280×800 / phone 390×844) — within 4%.
//
// Everything is inline styles on purpose: the canvas's properties panel edits those.

export const T = {
  bg: "#faf8f5",
  ink: "#1a1a1a",
  muted: "#5a5a5a",
  border: "#e8e4de",
  green: "#34d399", // emerald-400, the status dot
};

export const SERIF = "'Lora', Georgia, serif";
export const MONO = "'Fira Code', ui-monospace, monospace";
export const COLUMN = 680; // max-w-[680px]
export const VIEWPORT = { desktop: { w: 1280, h: 800 }, mobile: { w: 390, h: 844 } };

export const css = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v}`)
    .join("; ");

export const el = (tag, style, children = "", attrs = "") =>
  `<${tag}${attrs ? " " + attrs : ""} style="${css(style)}">${Array.isArray(children) ? children.join("") : children}</${tag}>`;

export const div = (style, children, attrs) => el("div", style, children, attrs);
export const row = (style, children, attrs) =>
  div({ display: "flex", flexDirection: "row", alignItems: "center", ...style }, children, attrs);
export const col = (style, children, attrs) =>
  div({ display: "flex", flexDirection: "column", flexShrink: 0, ...style }, children, attrs);

// ---- type --------------------------------------------------------------
// Body is Lora 16px / 1.7 with 0.01em tracking; chrome (nav, dates, code) is Fira Code.
export const text = (s, style = {}) =>
  div({ fontFamily: SERIF, fontSize: "16px", lineHeight: 1.7, letterSpacing: "0.01em", color: T.ink, ...style }, s);
export const mutedText = (s, style = {}) => text(s, { color: T.muted, ...style });
export const small = (s, style = {}) => text(s, { fontSize: "14px", lineHeight: "20px", color: T.muted, ...style });
export const mono = (s, style = {}) =>
  el("span", { fontFamily: MONO, fontWeight: 500, fontSize: "14px", ...style }, s);
export const h1 = (s, style = {}) =>
  div({ fontFamily: SERIF, fontSize: "24px", lineHeight: "32px", fontWeight: 600, color: T.ink, ...style }, s);
export const h2 = (s, style = {}) =>
  div({ fontFamily: SERIF, fontSize: "24px", lineHeight: "32px", fontWeight: 600, color: T.ink, marginBottom: "20px", ...style }, s);
export const link = (s, href = "#", style = {}) =>
  el(
    "a",
    {
      color: T.ink,
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      textDecorationColor: T.border,
      ...style,
    },
    s,
    `href="${href}"`,
  );

// ---- icons (lucide paths, stroke = currentColor) -------------------------
const P = {
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  rotateCw: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  externalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-8-2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
};
export const icon = (name, size = 20, color = "currentColor", sw = 1.5) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0; display: block;">${P[name]}</svg>`;

// ---- anatomy -------------------------------------------------------------
export const sep = () => div({ height: "1px", background: T.border, flexShrink: 0 }, "");

/** The 680px centred column with px-4 gutters. */
export const column = (children, style = {}) =>
  col({ width: "100%", maxWidth: COLUMN + "px", margin: "0 auto", padding: "0 16px", boxSizing: "border-box", ...style }, children);

/** Sticky header: name left, mono links right, hairline under. */
export const siteHeader = (links = ["Writing", "GitHub", "LinkedIn", "X", "Email"]) =>
  div(
    { background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "16px 0", flexShrink: 0 },
    column(
      row({ justifyContent: "space-between", flexWrap: "wrap", rowGap: "8px", fontFamily: MONO, fontSize: "14px" }, [
        el("a", { color: T.ink, fontWeight: 600, textDecoration: "none", marginRight: "16px" }, "Himanshu Mendapara", 'href="/"'),
        row(
          { gap: "4px 16px", flexWrap: "wrap", color: T.muted },
          links.map((l) => el("a", { color: T.muted, textDecoration: "none" }, l, 'href="#"')),
        ),
      ]),
    ),
  );

/** The 148px rounded photo; pass a URL or leave the placeholder. */
export const photo = (size = 148, src = "https://github.com/himanshu634.png") =>
  div(
    {
      width: size + "px",
      height: size + "px",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: `0 0 0 2px ${T.border}`,
      background: T.border,
      flexShrink: 0,
    },
    `<img src="${src}" alt="Himanshu Mendapara" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block">`,
  );

export const statusDot = (label = "Tech Lead @ Bull Agritech") =>
  row({ gap: "8px", fontFamily: MONO, fontSize: "14px", color: T.ink }, [
    div({ width: "8px", height: "8px", borderRadius: "999px", background: T.green, flexShrink: 0 }, ""),
    label,
  ]);

/** Mono CTA with the arrow that turns −45° on hover (drawn at rest). */
export const arrowLink = (label, size = "20px") =>
  el(
    "a",
    { display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: MONO, fontSize: size, color: T.ink, textDecoration: "none" },
    [label, icon("arrowRight", parseInt(size) <= 16 ? 16 : 20)],
    'href="#"',
  );

/** Today's home hero: photo, name, status, tagline, two arrow CTAs, centred in 80vh. */
export const hero = ({ name = "Himanshu Mendapara", status, tagline = "An engineer solving for agritech.", ctas = ["Writing", "Work"], minH } = {}) =>
  col(
    { alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 0", minHeight: minH ? minH + "px" : undefined },
    [
      div({ marginBottom: "24px" }, photo()),
      div({ fontFamily: SERIF, fontSize: "48px", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "12px", color: T.ink }, name),
      div({ marginBottom: "24px" }, statusDot(status)),
      mutedText(tagline, { fontSize: "18px", marginBottom: "48px", maxWidth: "576px" }),
      row({ gap: "40px", justifyContent: "center", flexWrap: "wrap" }, ctas.map((c) => arrowLink(c))),
    ],
  );

/** Date + underlined title, as on /blogs and the home Writing section. */
export const postRow = (date, title) =>
  row({ alignItems: "baseline", gap: "24px" }, [
    el("time", { fontFamily: MONO, fontSize: "14px", color: T.muted, width: "112px", flexShrink: 0 }, date),
    link(title, "#", { fontFamily: SERIF, fontSize: "16px", lineHeight: 1.7 }),
  ]);

export const section = (title, children, style = {}) =>
  col({ paddingBottom: "48px", ...style }, [h2(title), col({ gap: "16px" }, children)]);

/** A role on /work: title, "company · dates", then bullets with em-dash markers. */
export const experience = ({ title, company, dates, intro, bullets = [] }) =>
  col({ gap: "12px" }, [
    col({}, [
      div({ fontFamily: SERIF, fontSize: "18px", fontWeight: 600, color: T.ink }, title),
      small(`${company} · ${dates}`),
    ]),
    intro ? text(intro) : "",
    col({ gap: "4px" }, bullets.map((b) => small("— " + b, { color: T.ink }))),
  ]);

/** Blog prose at the .mdx-content sizes (15px / 1.75). */
export const prose = (paragraphs) =>
  col({ gap: "21px" }, paragraphs.map((p) => text(p, { fontSize: "15px", lineHeight: 1.75 })));

export const codeBlock = (code) =>
  el(
    "pre",
    {
      fontFamily: MONO,
      fontSize: "14px",
      lineHeight: 1.6,
      margin: 0,
      padding: "16px",
      borderRadius: "8px",
      border: `1px solid ${T.border}`,
      background: "rgba(232,228,222,0.2)",
      overflowX: "auto",
      color: T.ink,
      flexShrink: 0,
    },
    code.replace(/&/g, "&amp;").replace(/</g, "&lt;"),
  );

export const callout = (body) =>
  row({ alignItems: "flex-start", gap: "8px", padding: "16px", borderRadius: "8px", background: "rgba(232,228,222,0.3)", flexShrink: 0 }, [
    div({ marginTop: "3px" }, icon("info", 20, T.ink)),
    text(body, { fontSize: "15px" }),
  ]);

export const siteFooter = (year = new Date().getFullYear()) =>
  div(
    { borderTop: `1px solid ${T.border}`, padding: "32px 0", marginTop: "48px", flexShrink: 0 },
    row({ justifyContent: "space-between", flexWrap: "wrap", gap: "16px", fontFamily: MONO, fontSize: "14px", color: T.muted }, [
      `© ${year} Himanshu Mendapara`,
      row({ gap: "16px" }, ["GitHub", "X", "LinkedIn", "Email"].map((l) => el("a", { color: T.muted, textDecoration: "none" }, l, 'href="#"'))),
    ]),
  );

/**
 * A viewport. `h` is the board height (null = natural height, for measuring); the page
 * scrolls off the bottom like the real one. `header` sits above the column, `body` inside it.
 */
const viewport = (w) => ({ h, header = siteHeader(), body, footer = siteFooter(), pb = "80px" }) =>
  div(
    {
      width: w + "px",
      height: h ? h + "px" : "auto",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: SERIF,
      color: T.ink,
      background: T.bg,
    },
    [header, column([...[].concat(body), footer], { paddingBottom: pb })],
  );
export const desktop = viewport(VIEWPORT.desktop.w);
export const mobile = viewport(VIEWPORT.mobile.w);

// ---- file wrappers ---------------------------------------------------------
const FONTS =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;600&amp;family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap">';

export const dcFile = ({ title, w, h, markup }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
${FONTS}
<style>
body{margin:0;background:${T.bg}}
button{font-family:inherit;margin:0}
</style>
</helmet>
${markup}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${w},"height":${h}}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
`;

export const twinFile = ({ title, markup }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${title}</title>
${FONTS.replace(/&amp;/g, "&")}
<style>body{margin:0;background:#ddd}button{font-family:inherit;margin:0}</style></head>
<body>${markup}</body></html>
`;
