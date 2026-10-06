---
name: design-directions
description: Mockups-first design workflow for this portfolio site — grounds the request in the running site, pulls in the design skills (`frontend-design`, `ui-ux-pro-max`, the `design:*` plugin skills, plus `dataviz` and others as the brief needs), draws 3–4 named directions (A/B/C/D) on one design canvas for the user to review, then reads the reply — a pick gets built, feedback gets a new round. Use whenever the user asks to design, redesign, mock up, restyle or "improve the UI/UX of" a page, section, component or state (home, /work, /blogs, a blog post, the error pages, the header/footer, the MDX components); says a page is cluttered, confusing, generic, plain, ugly or "not me"; sends a screenshot or a site they like and asks for something like it; asks for "options", "directions", "variations" or "mockups"; or replies to an earlier canvas ("go with B", "I like F but…", "redo these"). Use it even when they don't say "mockup" — in this repo a design request means mockups before code. Not for a change the user has already specified exactly (just make it), or for a bug that only looks like a design problem.
---

# Design directions: mockups first, then the pick, then the build

The user decides design by looking, not by reading a plan. The loop that works: look at the real page → draw a few genuinely different answers on one canvas → the user picks, mixes or pushes back → only then code. Skipping a step costs rounds: frames drawn from tokens instead of the running site read as "generic"; a redesign that drops content the user cares about costs a round before the real constraint surfaces. This skill is that loop.

```
brief → ground in the running site → load the design skills → 3–4 directions on a canvas
      → present + STOP → read the reply ─┬─ pick / mix      → build on a branch → PR when asked
                                          └─ feedback / no   → next round on the same canvas
```

Nothing under `src/`, `content/` or `public/` changes before a pick. The canvas is cheap to throw away; a half-built page in the wrong direction is not.

## What the site is

A personal site for Himanshu Mendapara — a software engineer (tech lead, agritech). Who reads it: recruiters and hiring managers skimming in under a minute, engineers checking the work and the writing, and people arriving on a single blog post from a link. The design language is brutalist, "the index" (direction B, October 2026; it replaced the quiet editorial "Mitchell-inspired" look of PR #5): white ground, black ink, 2 px black rules that stop at the side margins, one amber (`--now`) for what is live now and for hover, **Archivo** for everything with its width axis giving the condensed upper-case display cut (`type-display`), **Fira Code** for code only, square corners, no shadows. The home page is one ruled table of every role, project, post and contribution, filterable by kind; /work keeps the detail.

The frame kit in `assets/kit/` still draws the old editorial look; rebuild its tokens and anatomy from `globals.css` and the live pages before the next round.

Those choices are deliberate. Spend a direction's boldness on **structure, hierarchy, what comes first, the signature moment and the copy** — not on a new palette or typeface, unless the user asks for a new look or one direction is explicitly "what if the palette changed" (and say so).

## 1. Frame the brief

Work out, in two or three lines, what you are designing: the route or component (file path), who is on it and what they came to do (the reader above), and what is wrong today in the user's words. This say-back is not its own message — it becomes the first line of the step 5 summary. Don't stop after this step unless a question blocks the drawing.

Before anything else, check whether the user has already decided something about this page — an earlier decision binds round 1 exactly as a rejected round would:

- **Memory** — a `*-directions.md` record for the same page means there is already a canvas, a history of rejected ideas and possibly a pick. Continue that canvas; never restart from A.
- **The repo** — `git log --oneline -- <file>` and the commit/PR messages for that file; comments in the component that record a choice made on purpose.
- **`gh pr list --state all --search "<keywords>"`** — another session may already have built it.

Ask only what you cannot infer and what changes the drawing (for example "may /work merge into the home page?"). A garbled or dictated prompt that names no page is a question to confirm, not a task to guess at.

## 2. Ground it in the running site

Start the dev server first (`preview_start {name: "Next.js Dev"}` from `.claude/launch.json` — `references/canvas.md` §1), and read while it compiles: `src/app/globals.css` (the tokens and the `.mdx-content` rules), `src/app/layout.tsx` (fonts), the route's `page.tsx` and layout, and the components it composes.

Then **look at the page running**, at two widths: desktop (1280 wide) and phone (390 wide — `resize_window {preset: "mobile"}`). Frames are drawn from the site's real anatomy — the sticky mono header, the centred hero with the photo and status dot, the date-and-title post rows, the arrow CTAs, the hairline footer — because that is what reads as "this site" to the user; a frame that only gets the hexes right still looks like a template. If the user sent screenshots, those are the ground truth for "today".

Finish with a **diagnosis you can measure**, because "cleaner" and "more me" are not briefs. Pick the measures that fit the complaint:

- _Too much_: how many screen-heights the page scrolls at 1280×800 and at 390×844, how many blocks compete at one volume, what is said more than once (the header and footer both list GitHub / LinkedIn / X / Email), what wraps, clips or overflows on the phone.
- _Too little / unclear_: what a recruiter learns in the first viewport (name, role, where, how to reach), how many clicks to the work and to the newest post, whether there is a primary action at all, whether each item says what it _is_ (a post vs a project vs an external link).
- _Blog reading_: line length in characters, body size, heading scale against body, how code, callouts, tables and images actually render.

The diagnosis becomes the **Today** frames on the canvas and the yardstick every direction is compared against ("2.6 screens → 1.4", "first viewport: no way to reach the work → one link"). A direction may make a short page longer; say so rather than hiding it.

## 3. Load the design skills

Invoke these with the Skill tool — don't work from memory of them, they change. Use what the brief needs; the first three are the default set for any new-page or redesign request.

| Skill                                      | What it is for here                                                                                                                                                                                                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend-design`                          | The point of view: one idea per direction, one signature moment, copy as design material, the self-critique pass. Within the site's language unless the brief opens it up (see "What the site is").                                                                 |
| `ui-ux-pro-max`                            | Evidence for the choices: query the UX outcome you need (`--domain ux`), then the `--stack` value its SKILL.md lists for Next.js / Tailwind. Results are recommendations; where they fight the site's deliberate restraint, the site wins. Two or three queries; if it returns generic advice, say so and move on. Needs `python3`. |
| `design:design-critique`                   | Load it once, apply it twice: on **Today** (sharpens the diagnosis) and on your own draft frames before you publish them.                                                                                                                                            |
| `design:ux-copy`                           | Hero line, CTA labels, section names, empty states, the error-page voice. Copy is half of a personal site.                                                                                                                                                           |
| `design:accessibility-review`              | Contrast (the muted grey on paper), focus states, link-vs-text distinction, reduced motion — whenever a direction adds a control, a tinted surface or motion.                                                                                                        |
| `design:design-system`                     | When a direction needs a pattern `src/components/` doesn't have — decide whether it extends an existing component before inventing one.                                                                                                                              |
| `dataviz`                                  | A direction with a chart, stat, timeline or meter.                                                                                                                                                                                                                   |
| `vercel:react-best-practices`, `vercel:nextjs` | At build time (step 7), not while drawing.                                                                                                                                                                                                                      |
| `product-management:product-brainstorming` | The problem itself is unclear ("what should this site be for?") and drawing would be premature.                                                                                                                                                                      |

If a skill named here isn't in this session's list, carry on without it and say which one was missing — don't stall. If the brief touches something this table doesn't cover, look through the available skills for one that does; the table is a starting set, not a fence.

## 4. Draw 3–4 directions

**Different ideas, not different paint.** Each direction answers the diagnosis with a different structural bet — what comes first, what is grouped, what becomes its own page, what the hero is. If two directions differ only in colour, radius or icon, they are one direction; merge them and find another idea. Three strong directions beat four where one is filler.

- **Letter + name, and they stay stable**: "A · Name, role, then the work", "B · The writing is the front page". The user replies with letters, memory records them, PRs cite them. A new round continues the alphabet (round 2 is E–H; skip I and O, they read as digits) — a letter is never reused for a different idea.
- **Show the widths and states that decide it**, not one happy frame: desktop and phone for the landing, plus the edge that breaks weak designs — zero posts or twenty, a long post title, a role with a long company name, a post with code, a table and an image. Two or three frames per direction is typical.
- **Real content**: the real name, role, companies, project names and post titles from `src/components/` and `content/blogs/`. Don't invent jobs or posts; if a direction needs content that doesn't exist yet (a projects grid, a "now" section), mark it as placeholder on the frame and list it under cost.
- **The floors hold in a mockup too**: body text 16 px or larger, readable line length (about 60–80 characters) for posts, 4.5:1 contrast for text, visible focus and link affordance, targets at least 44 px on the phone, motion that has a reduced-motion answer.
- **Shared fixes go in every direction** and are listed once ("in every direction: the header gets Work, the footer year is computed"). That keeps the choice about the idea, not about who got the bug fix. It is fine — useful, even — for **A to be the shared fixes and nothing else**: a smallest-change baseline shows what the bets in B–D actually add.
- **Say what each costs**: new components, new routes, new copy the user has to write, content to produce, dependencies, SEO/metadata changes, anything that would move a URL (redirects).
- **Recommend one** and say why in a sentence. The user often overrules the recommendation; that is the canvas doing its job.

Build **one design canvas** (Artifact, design type) holding Today + all directions, so the user compares them side by side on one link. Don't write the frames from nothing: copy the bundled kit (`assets/kit/lib.mjs` + `build.example.mjs`) into the scratchpad and build on it. Mechanics — starting the canvas, where the canvas type's own rules override this skill, the kit, the two-pass measure-then-build, adding a round as a new page — are in `references/canvas.md`. Before publishing, look at your own frames on the kit's local contact sheet: text that wraps where it shouldn't, a CTA pushed below the fold you claimed, and a frame taller than you said are what the user will see first. The published canvas itself is not re-opened, so if its layout is a guess, say so.

## 5. Present, record, stop

The chat message is short, because the canvas does the talking:

```
Designing: <the say-back from step 1 — page, who is on it and what for>
Canvas: <link> (private to you)
Today — <the measured diagnosis, one line>
A · <name> — <the bet, one line> (<length / cost>)
B · …
C · …
In every direction: <shared fixes>
I'd pick <letter>: <why, one sentence>.
Open questions: <at most three, each answerable in a word — best of all, a question whose answer picks the direction>
Seen on the way, not part of this: <a problem next door you noticed, one line — or drop the line>
Pick a letter, mix them ("B with A's header"), or tell me what's off.
```

Write the memory record now, not after the build: `<topic>-directions.md` with the canvas link, the directions by letter and name, the recommendation, the open questions and "wait for a pick" — plus the `MEMORY.md` line. The next session (or the next round) starts from it.

Then stop. No branch, no component, no content edit until the user answers.

## 6. Read the reply

The reply is rarely a bare letter. Work out which of these it is — and when it could be two, ask one short question rather than building on a guess.

| They say                                                                    | It means                             | Do                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Go with B" · "B, build it" · "implement C"                                 | Pick **and** go-ahead                | Record PICKED, go to step 7. Open questions left unanswered take your recommended default — list each under _Decisions_ in the PR.                                                                                                                                 |
| "I like F" · "F looks good" — no build verb                                 | A pick, maybe not a go-ahead         | Record PICKED. If open questions remain, ask them with "…then I'll build it"; if none remain, say you're starting and start.                                                                                                                                       |
| "B, but keep the photo" · "A with C's footer"                               | Pick with a change, or a mix         | Redraw it as **the final** on page 1 of the same canvas, share it, then build on their OK. Small, unambiguous changes ("make the dot amber") can be drawn and built in one go — say so.                                                                            |
| "Too busy" · "keep it one page" · "must show everything" · "none of these"  | A **constraint** not stated before   | New round. Write the constraint down in their exact words — on the canvas page and in memory — then draw new letters that obey it. Don't re-offer a rejected idea in new clothes; if two rounds taught "never hide the work behind a click", round three doesn't. |
| "Looks generic" · "doesn't look like my site"                               | The grounding failed, not the ideas  | Back to step 2: fresh screenshots of the real pages, redraw the same ideas on the real anatomy.                                                                                                                                                                    |
| A question ("what does B look like on a phone?")                            | They are still deciding              | Answer it — add the frame if a picture answers it better. The canvas stands.                                                                                                                                                                                       |
| Three rounds, no pick                                                       | The brief is off, not the drawings   | Stop drawing. Say what the rounds had in common and ask what about _that_ is wrong.                                                                                                                                                                                |

Each new round goes on the **same canvas** as a new page that opens first, with earlier rounds kept behind it — the history of what was rejected, and why, is part of the design. Update the memory record every round: what was rejected, the constraint learned, the new letters.

## 7. Build the pick

Now it is an ordinary change to a Next.js 15 App Router site (Tailwind v4, MDX via `@next/mdx`, bun):

1. **Branch off `main`** — a worktree (`EnterWorktree`) if other work is in flight, otherwise a `design/<topic>` branch. Never commit on `main`.
2. **Tokens first**: a new colour, font or spacing value goes into `:root` / `@theme inline` in `src/app/globals.css`, never as a one-off hex in a component. Don't use a Tailwind colour class whose token isn't defined there (the `accent-*` classes in `src/components/mdx/` are already that bug).
3. **Build from what's there**: compose `src/components/`; keep server components server-side and push `"use client"` down to the smallest interactive piece. Content stays in its source (`content/blogs/*.mdx`, the data arrays in `work-ex.tsx` / `open-source-contri.tsx`). Update `metadata` when a page's purpose or title changes.
4. **Hold it against the picked frame.** Run it (`preview_start`), look at desktop and 390 wide, and compare to the canvas frame by frame — screenshots as proof. Then `bun run build` (it type-checks and lints). Report honestly what differs and what you couldn't check.
5. **PR only when the user asks.** The body names the direction by letter and links the canvas.
6. **Memory**: the directions record becomes "X PICKED and BUILT (see branch `<name>`)".

## What this skill is not for

- "Make the status dot amber" — the user has already designed it. Do it (on the canvas if a round is open, in code if the build is).
- A bug that looks like a design problem (inline code with no background because a token is missing, a heading size overridden by `.mdx-content`). Diagnose and fix it; a redesign doesn't fix a missing token.
- Writing the blog posts themselves, or OG images and favicons — `frontend-design` still helps with the last two; the canvas loop mostly doesn't.
