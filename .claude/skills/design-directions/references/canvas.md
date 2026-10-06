# The canvas: seeing the site, drawing the frames, adding rounds

Read this when you are about to take screenshots or build/extend the canvas (steps 2, 4 and 6 of the skill). Building the canvas is where most of a round's time goes; the bundled kit and the notes below exist to cut that.

## Contents

1. Seeing the real pages (dev server + Browser pane)
2. Starting the canvas — and where the type's rules override this skill
3. The bundled frame kit and generator
4. Measuring, so heights and length claims are true
5. Checking your frames before publishing
6. Rounds and finals on the same canvas
7. When the scratchpad is gone

## 1. Seeing the real pages

The point is the **anatomy** of the live pages — copy it, don't approximate it from `globals.css`. If the user sent screenshots, use them; they beat anything you render. Otherwise run the site yourself, and start it _before_ the reading in step 2 so it compiles while you read.

- `preview_start {name: "Next.js Dev"}` — the config is in `.claude/launch.json` (bun, port 3000, `autoPort`). Never start the dev server from Bash.
- Routes: `/`, `/work`, `/blogs`, `/blog/<slug>` (slugs are the file names in `content/blogs/`), and any unknown path for the 404. The 500 page needs a thrown error; draw it from `src/app/error.tsx` rather than breaking the site.
- Two widths for every page: desktop (pane default, or `resize_window {width: 1280, height: 800}`) and phone (`resize_window {preset: "mobile"}`, 390 wide in the frames). Reset with `preset: "desktop"` when done.
- The site is light-only. If the pane comes up dark, `resize_window {colorScheme: "light"}`.
- The body has a 0.4 s fade-in; wait a beat before screenshotting or the first frame is half-transparent.
- The home photo loads from `github.com`; if the pane is offline it is a broken box — draw it from `public/himanshu.jpeg` instead.
- The Browser pane may be hidden: `computer` clicks can time out there, but `javascript_tool`, `read_page` and `screenshot` work.
- Measure the running page for the diagnosis: `document.documentElement.scrollHeight` at each width, divided by the viewport height (800 desktop, 844 phone).
- Pages worth having for almost any brief: the page being redesigned, the page a visitor reaches it from, and one blog post (it shares the header and is where most visitors land).

## 2. Starting the canvas

Use the Artifact tool — it is the first call when making a new canvas:

1. `Artifact {action: "quickstart", intent: "design"}` — returns the Design canvas type. The site's tokens come from `src/app/globals.css`, not from a design system; pass `design_systems: false` unless the user wants one.
2. Publish with that `type_url`, a `title`, no files, `auto_open: "after_first_write"`. The create result carries the type's own instructions.
3. Fill it by publishing your data files (`project/*.dc.html` + `project/canvas.json`) to the returned `url`.

Title: what it is, two to four words — "Home · Directions", "Blog Post Reading", "Work Page Redesign". For a continuation, update the existing canvas by its `url` (read it first) instead of creating a second one.

**The type's instructions win over this file.** They arrive at the moment you want to draw. As last seen (2026-09-21, from the Koshi version of this skill) they mapped like this — re-check against the live text:

| This skill wants                                              | The type says                                          | So                                                                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| a caption per frame: letter, name, width, state               | each board's name strip shows its `title`              | the caption **is** `boards[file].title` — "B1 · Writing first — desktop"                                                        |
| the diagnosis, shared fixes, each direction's cost, questions | notes never go inside an artboard                      | `canvas.json` `notes`: one sticky per row beside its frames, a `kind: "title1"` heading above the row, one sticky for questions |
| a browser or phone frame                                      | no fake chrome / status bars                           | the kit's `desktop()` and `mobile()` have none — the board edge is the viewport edge                                            |
| you look at your frames before the user does                  | don't read back, render or open the published artifact | review local copies (§5); the published canvas is not re-opened                                                                 |

Also from the type: the first artboard is `Main.dc.html`; a board's root element is exactly the board's `w`×`h`, which also equals `$preview`; keep the `support.js` script line verbatim; inline styles (the properties panel edits those); no `<iframe>`; network is Google Fonts `css2` only; real `<button>`s and `<a>`s, with an `aria-label` on icon-only ones.

## 3. The bundled frame kit

Hand-written frames drift apart; generated ones stay consistent and make round 2 a ten-minute job. The skill ships a seed in `assets/kit/` — copy both files into a folder in the session scratchpad and work there:

- `lib.mjs` — tokens from `globals.css`, Lora + Fira Code from Google Fonts, the two viewports (`desktop()` 1280, `mobile()` 390) with the 680 px column, the sticky site header, the hero (photo, name, status dot, tagline, arrow CTAs), section heading, post row (date + underlined title), experience block, prose block with the `.mdx-content` sizes, code block, callout, footer, hairline separator, lucide icon paths, and the `.dc.html` / twin file wrappers.
- `build.example.mjs` → rename to `build.mjs`: the frame list, the two-pass build (§4), the measuring page, a contact sheet, and the `canvas.json` row layout with sticky notes.

The kit is a starting point, and it ages: before a round, check its hexes against `globals.css` and its anatomy against the page you are redesigning, then add what your page has that the kit lacks by copying from the screenshot. If you add a piece other pages will need, put it back into `assets/kit/lib.mjs` in the build PR.

Keep copy real (see the skill, step 4) and keep the floors: the kit's body text is 16 px and its column 680 px, so a frame has to go out of its way to cheat.

## 4. Measuring

Two reasons to measure. A **full-length board needs its height before it can be written** (the root must equal the board's `h`), so the build is two-pass: build → measure → rebuild with `heights.json`. And claims like "1.4 screens instead of 2.6" are what let the user choose — so they have to be true.

- Serve the scratchpad folder on localhost (`python3 -m http.server <port>` in the background), open `twins/measure.html` in the Browser pane, run `await measureAll()` with `javascript_tool`, save the result as `heights.json`, run `node build.mjs heights.json`. One call measures every frame.
- The measuring twin renders the viewport at `height: auto` (`fn(null)` in the kit). A fixed-height frame with a `flex: 1` body reports the frame, not the content.
- A block with `overflow: hidden` inside a flex column **shrinks** unless it has `flex-shrink: 0`. The kit's blocks set it; your own must too.
- Wait for `document.fonts.ready` (the kit's `measureAll` does) — Lora's line boxes change every height.
- **Calibrate against Today**: compare your Today twin's height with the running page's `scrollHeight` at the same width. If they agree within a few percent, the other numbers on the canvas can be trusted; if not, fix the kit before drawing directions on it.
- Screens = height ÷ viewport height (800 desktop, 844 phone). Put the number in the row's sticky and the chat summary. For a "fits the first viewport" claim, check the twin, don't assume.

## 5. Checking your frames before publishing

Open `twins/sheet.html` — every board at its real size — and look for what the user would see first: a title wrapping onto three lines on the phone, a CTA below the fold you claimed, a date column squeezing the title, a link that doesn't look like a link, a direction with no way to reach the work or the writing. Apply `design:design-critique` to this sheet.

The published canvas itself is not re-opened (the type asks for that). So the canvas _layout_ — whether a long sticky fits its `maxH`, whether notes overlap boards — is computed, not seen. Keep stickies short, and tell the user the layout is unverified if you had to guess.

## 6. Rounds and finals

- A new round is a **new page that opens first**; earlier rounds move behind it, untouched. Name pages for what they are: "Round 2 · One page", "Round 3 · Writing first, keep the photo".
- A pick with changes becomes **the final** on page 1 (same letter, e.g. "F · final"); the explored alternatives stay on later pages. The build is held against this page.
- Build the round by loading the published canvas state and appending, not by regenerating everything — that is how earlier rounds survive exactly as the user saw them.

## 7. When the scratchpad is gone

Scratchpads are per-session and get wiped. The kit in `assets/kit/` gets you the shell back at once; the published artifact is the durable copy of the frames themselves (`Artifact {action: "read", url}` and its files listing). Record in the memory file which canvas a round lives on and what you added to the kit, so the next session knows where to pick up.
