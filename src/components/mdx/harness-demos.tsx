"use client";

import { ReactNode, useId, useState } from "react";

// Interactive figures for the Gujarati image-harness post. Every number here
// comes from the post itself; the line check is a sketch of the two rules,
// not KOSHI's code.

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mdx-demo my-8 border-2 border-border text-base">
      <div className="flex items-center justify-between bg-foreground px-3 py-1.5 text-sm font-bold text-background">
        <span>{label}</span>
        <span aria-hidden="true">Interactive</span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function Toggle<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`min-h-10 cursor-pointer border-2 border-border px-3 text-sm font-bold ${
              active ? "bg-foreground text-background" : "bg-background hover:bg-now"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Line check: the first version against the strict one ---------- */

const norm = (s: string) => s.trim().replace(/\s+/g, " ");
const digits = (s: string) => s.match(/\d+/g) ?? ([] as string[]);
const letters = (s: string) => norm(s.replace(/\d+/g, ""));

function editDistance(a: string, b: string) {
  const x = Array.from(a);
  const y = Array.from(b);
  let row = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const next = [i];
    for (let j = 1; j <= y.length; j++) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[y.length];
}

type Verdict = { pass: boolean; why: string };

/** Up to 15% of letters wrong, and each planned number found anywhere in the reading. */
function firstVersion(planned: string, read: string): Verdict {
  const p = letters(planned);
  const share = p.length ? editDistance(p, letters(read)) / Array.from(p).length : 0;
  const pct = Math.round(share * 100);
  if (share > 0.15) return { pass: false, why: `${pct}% of letters wrong, over the 15% allowance` };
  const missing = digits(planned).find((n) => !read.includes(n));
  if (missing) return { pass: false, why: `${missing} not found anywhere` };
  const nums = digits(planned);
  const inside = nums.find((n) => !digits(read).includes(n));
  if (inside) return { pass: true, why: `found ${inside} inside ${digits(read).find((d) => d.includes(inside))}` };
  return { pass: true, why: pct ? `${pct}% of letters wrong, within 15%` : "matches" };
}

/** Character for character, and each number on its own, digit for digit. */
function strictVersion(planned: string, read: string): Verdict {
  if (norm(planned) === norm(read)) return { pass: true, why: "matches character for character" };
  const want = digits(planned);
  const got = digits(read);
  const wrong = want.find((n, i) => got[i] !== n);
  if (wrong) return { pass: false, why: `planned ${wrong}, read ${got[want.indexOf(wrong)] ?? "nothing"}` };
  const n = editDistance(norm(planned), norm(read));
  return { pass: false, why: `${n} character${n === 1 ? "" : "s"} differ` };
}

const PRESETS = [
  { label: "593 inside 2593", planned: "₹593", read: "₹2593" },
  { label: "C read as O", planned: "Chlorfenapyr 10% SC", read: "Chlorfenapyr 10% SO" },
  { label: "Exact", planned: "300 ગ્રામ", read: "300 ગ્રામ" },
];

export function LineCheck() {
  const [planned, setPlanned] = useState(PRESETS[0].planned);
  const [read, setRead] = useState(PRESETS[0].read);
  const id = useId();
  const verdicts = [
    { name: "First version", ...firstVersion(planned, read) },
    { name: "Now", ...strictVersion(planned, read) },
  ];

  return (
    <Demo label="Check a line">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold">Try:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setPlanned(preset.planned);
              setRead(preset.read);
            }}
            className="min-h-9 cursor-pointer border-2 border-border px-2.5 text-sm font-semibold hover:bg-now"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { key: "planned", label: "Planned line", value: planned, set: setPlanned },
          { key: "read", label: "What the reader saw", value: read, set: setRead },
        ].map((field) => (
          <label key={field.key} htmlFor={`${id}-${field.key}`} className="flex flex-col gap-1 text-sm font-bold">
            {field.label}
            <input
              id={`${id}-${field.key}`}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              spellCheck={false}
              className="h-11 border-2 border-border bg-background px-2.5 text-lg font-medium"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 grid border-2 border-border sm:grid-cols-2" aria-live="polite">
        {verdicts.map((v, i) => (
          <div
            key={v.name}
            className={`flex flex-col gap-0.5 px-3 py-2.5 ${i > 0 ? "border-t-2 border-border sm:border-t-0 sm:border-l-2" : ""}`}
          >
            <span className="text-sm font-semibold">{v.name}</span>
            <span
              className={`w-fit px-1.5 text-lg font-black uppercase ${
                v.pass ? "bg-now" : "bg-foreground text-background"
              }`}
            >
              {v.pass ? "Passes" : "Fails"}
            </span>
            <span className="text-muted">{v.why}</span>
          </div>
        ))}
      </div>
      {verdicts[0].pass && !verdicts[1].pass && (
        <p className="mt-2 text-sm font-semibold">The first version would have shipped this poster.</p>
      )}
    </Demo>
  );
}

/* ---------- Squares: a count out of a total, one square each ---------- */

type Bucket = { label: string; count: number; className: string };

function Squares({ buckets, columns, label }: { buckets: Bucket[]; columns: number; label: string }) {
  const cells = buckets.flatMap((b) => Array.from({ length: b.count }, () => b.className));
  return (
    <div>
      <div
        role="img"
        aria-label={label}
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {cells.map((className, i) => (
          <span
            key={i}
            className={`aspect-square border-2 border-border transition-colors duration-300 ${className}`}
            style={{ transitionDelay: `${i * 12}ms` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        {buckets.map((b) => (
          <li key={b.label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`inline-block size-3.5 border-2 border-border ${b.className}`} />
            {b.count} {b.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const VERIFIED = "bg-foreground";
const FLAGGED = "bg-now";
const OPEN = "bg-background";

const GALLERY = {
  first: [
    { label: "every line right", count: 1, className: VERIFIED },
    { label: "not right yet", count: 19, className: OPEN },
  ],
  final: [
    { label: "verified", count: 14, className: VERIFIED },
    { label: "flagged, faults named", count: 6, className: FLAGGED },
    { label: "refused", count: 0, className: OPEN },
  ],
} satisfies Record<string, Bucket[]>;

export function GalleryOutcome() {
  const [stage, setStage] = useState<keyof typeof GALLERY>("first");
  const buckets = GALLERY[stage];
  return (
    <Demo label="October gallery: 20 product posters">
      <Toggle
        label="Stage"
        value={stage}
        onChange={setStage}
        options={[
          { value: "first", label: "First try" },
          { value: "final", label: "After repairs and the second reader" },
        ]}
      />
      <div className="mt-4 max-w-[420px]">
        <Squares
          buckets={buckets}
          columns={10}
          label={buckets.map((b) => `${b.count} ${b.label}`).join(", ") + ", of 20 product posters"}
        />
      </div>
    </Demo>
  );
}

const SPLIT = {
  clean: { label: "Art free of lettering", count: 96 },
  panels: { label: "Panels left empty", count: 88 },
  open: { label: "Text on open areas worked", count: 48 },
};

export function SplitTest() {
  const [key, setKey] = useState<keyof typeof SPLIT>("clean");
  const { label, count } = SPLIT[key];
  return (
    <Demo label="The split: model draws the art, code sets the text">
      <Toggle
        label="Result"
        value={key}
        onChange={setKey}
        options={Object.entries(SPLIT).map(([value, s]) => ({
          value: value as keyof typeof SPLIT,
          label: s.label,
        }))}
      />
      <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="w-full max-w-[280px]">
          <Squares
            columns={10}
            label={`${count} of 100 posters: ${label.toLowerCase()}`}
            buckets={[
              { label: "yes", count, className: VERIFIED },
              { label: "no", count: 100 - count, className: OPEN },
            ]}
          />
        </div>
        <p className="type-display text-[5rem]" aria-hidden="true">
          {count}
          <span className="text-2xl">/100</span>
        </p>
      </div>
    </Demo>
  );
}
