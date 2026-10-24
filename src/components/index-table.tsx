"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KINDS, type IndexItem, type Kind } from "@/lib/index-items";

const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.kind, k.label])) as Record<Kind, string>;

// Year | Kind | Item | Link, from md up. Below md each row stacks.
const COLUMNS = "md:grid md:grid-cols-[120px_150px_minmax(0,1fr)_170px]";

function kindFromHash(hash: string): Kind | null {
  return KINDS.find((k) => `#${k.hash}` === hash)?.kind ?? null;
}

/** The home page: every role, project, post and contribution in one ruled table, filterable by kind. */
export function IndexTable({ items }: { items: IndexItem[] }) {
  const [filter, setFilter] = useState<Kind | null>(null);

  // "/#projects" (the header's Projects link) and friends open the table pre-filtered.
  useEffect(() => {
    const sync = () => {
      const { hash } = window.location;
      const kind = kindFromHash(hash);
      if (kind) {
        setFilter(kind);
        document.getElementById("index")?.scrollIntoView();
      } else if (!hash) {
        setFilter(null);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function choose(kind: Kind | null) {
    setFilter(kind);
    const hash = KINDS.find((k) => k.kind === kind)?.hash;
    history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname);
  }

  const shown = filter ? items.filter((item) => item.kind === filter) : items;
  const filters = [
    { kind: null, label: "All", count: items.length },
    ...KINDS.map((k) => ({
      kind: k.kind,
      label: k.filter,
      count: items.filter((item) => item.kind === k.kind).length,
    })),
  ];

  return (
    <section id="index" aria-label="Everything, newest first" className="scroll-mt-4">
      <div className="flex overflow-x-auto pt-4 pb-3" role="group" aria-label="Filter by kind">
        {filters.map(({ kind, label, count }, i) => {
          const active = filter === kind;
          return (
            <button
              key={label}
              type="button"
              onClick={() => choose(kind)}
              aria-pressed={active}
              className={`h-11 shrink-0 cursor-pointer border-2 border-border px-4 text-[15px] font-bold ${
                i > 0 ? "border-l-0" : ""
              } ${active ? "bg-foreground text-background" : "bg-background hover:bg-now"}`}
            >
              {label} {count}
            </button>
          );
        })}
      </div>

      <div className="border-2 border-border">
        <div
          aria-hidden="true"
          className={`hidden h-9 items-center bg-foreground text-sm font-bold text-background ${COLUMNS} md:items-center`}
        >
          <span className="px-3.5">Year</span>
          <span className="px-3.5">Kind</span>
          <span className="px-3.5">Item</span>
          <span className="px-3.5">Link</span>
        </div>
        <ul>
          {shown.map((item) => (
            <li key={item.href + item.title} className="border-b border-border last:border-b-0">
              <IndexRow item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IndexRow({ item }: { item: IndexItem }) {
  const external = item.href.startsWith("http");
  const when = item.now ? "Now" : String(item.year);
  const nowCell = item.now || item.featured ? "bg-now font-bold" : "";

  const cells = (
    <>
      <span className={`hidden items-center border-r border-border px-3.5 tabular-nums md:flex ${nowCell}`}>
        {when}
      </span>
      <span className="hidden items-center border-r border-border px-3.5 md:flex">
        {KIND_LABEL[item.kind]}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 px-3 pt-2.5 pb-3 md:block md:border-r md:border-border md:px-3.5 md:py-3.5">
        <span className="flex justify-between text-sm font-semibold md:hidden">
          <span>
            {item.now ? <span className="bg-now px-1.5">Now</span> : item.year}, {KIND_LABEL[item.kind]}
          </span>
          <span>{item.linkLabel}</span>
        </span>
        <span className="text-[19px] leading-snug font-bold md:mr-3 md:text-lg">
          {item.featured && (
            <span className="mr-2 inline-block bg-foreground px-1.5 align-[0.1em] text-sm text-background">
              Featured
            </span>
          )}
          {item.title}
        </span>
        {item.description && <span className="text-muted">{item.description}</span>}
      </span>
      <span className="hidden items-center px-3.5 md:flex">
        {item.linkLabel}
        {external && (
          <>
            <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        )}
      </span>
    </>
  );

  const className = `${COLUMNS} flex flex-col md:min-h-[52px] hover:bg-now`;

  return external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {cells}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {cells}
    </Link>
  );
}
