"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { KINDS, type IndexItem, type Kind } from "@/lib/index-items";

const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.kind, k.label])) as Record<Kind, string>;

// Now: Kind | Item | Link. A section: Year | Item | Link. Below md each row stacks.
const NOW_COLUMNS = "md:grid md:grid-cols-[150px_minmax(0,1fr)_170px]";
const SECTION_COLUMNS = "md:grid md:grid-cols-[120px_minmax(0,1fr)_170px]";

const DISPLAY = "font-black [font-stretch:62%] uppercase leading-none";

function kindFromHash(hash: string): Kind | null {
  return KINDS.find((k) => `#${k.hash}` === hash)?.kind ?? null;
}

/** "Maester, Citadel, coin-launch and 3 more": what a closed section holds. */
function peek(items: IndexItem[]): string {
  const names = items.slice(0, 3).map((item) => item.title).join(", ");
  return items.length > 3 ? `${names} and ${items.length - 3} more` : names;
}

/**
 * The home page: what is live now, always shown, then one folded section per
 * kind. Sections start closed and any number can be open at once.
 */
export function IndexTable({ items }: { items: IndexItem[] }) {
  const [open, setOpen] = useState<string[]>([]);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  // "/#projects" (the header's Projects link) and friends open that section.
  useEffect(() => {
    const sync = () => {
      const kind = kindFromHash(window.location.hash);
      if (!kind) return;
      setOpen((current) => (current.includes(kind) ? current : [...current, kind]));
      setScrollTarget(window.location.hash.slice(1));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Scroll once the section has rendered open, so the page's height is final.
  useEffect(() => {
    if (!scrollTarget) return;
    document.getElementById(scrollTarget)?.scrollIntoView();
    setScrollTarget(null);
  }, [scrollTarget]);

  const now = items
    .filter((item) => item.now || item.featured)
    .sort((a, b) => KINDS.findIndex((k) => k.kind === a.kind) - KINDS.findIndex((k) => k.kind === b.kind));

  return (
    <div id="index" className="scroll-mt-4">
      {now.length > 0 && (
        <section aria-labelledby="now-heading" className="mt-5 border-2 border-border">
          <h2 id="now-heading" className={`flex h-14 items-center bg-now px-3 text-[30px] md:px-3.5 md:text-[34px] ${DISPLAY}`}>
            Now
          </h2>
          <ul>
            {now.map((item) => (
              <li key={item.href + item.title} className="border-t border-border">
                <Row item={item} first={item.featured ? "Featured post" : KIND_LABEL[item.kind]} columns={NOW_COLUMNS} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Accordion.Root type="multiple" value={open} onValueChange={setOpen} className="mt-5 border-2 border-border">
        {KINDS.map(({ kind, section, hash }, i) => {
          const sectionItems = items.filter((item) => item.kind === kind);
          if (sectionItems.length === 0) return null;
          const isOpen = open.includes(kind);
          return (
            <Accordion.Item
              key={kind}
              value={kind}
              id={hash}
              className={`scroll-mt-4 ${i > 0 ? "border-t-2 border-border" : ""}`}
            >
              <Accordion.Header asChild>
                <h2>
                  <Accordion.Trigger className="group flex min-h-16 w-full cursor-pointer flex-col justify-center gap-1 bg-background px-3 py-2.5 text-left hover:bg-now data-[state=open]:bg-foreground data-[state=open]:text-background data-[state=open]:hover:bg-foreground md:flex-row md:items-center md:justify-start md:gap-3.5 md:px-3.5">
                    <span className="flex items-center gap-3 md:contents">
                      <span className={`text-[30px] md:text-[34px] ${DISPLAY}`}>{section}</span>
                      <span className="text-base font-bold">{sectionItems.length}</span>
                      <span aria-hidden="true" className="ml-auto text-[28px] leading-none font-bold md:order-last md:text-[30px]">
                        {isOpen ? "−" : "+"}
                      </span>
                    </span>
                    <span className="truncate text-base text-muted group-data-[state=open]:hidden md:ml-2.5 md:min-w-0">
                      {peek(sectionItems)}
                    </span>
                  </Accordion.Trigger>
                </h2>
              </Accordion.Header>
              {/* Mounted while closed, so every link stays in the page's HTML; forceMount
                  leaves hiding it to us. */}
              <Accordion.Content forceMount className="data-[state=closed]:hidden">
                <ul>
                  {sectionItems.map((item) => (
                    <li key={item.href + item.title} className="border-t border-border">
                      <Row item={item} first={item.now ? "Now" : String(item.year)} columns={SECTION_COLUMNS} lit={item.now || item.featured} />
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
}

/** One linked row: a first cell (the kind in Now, the year in a section), the item, and where it goes. */
function Row({ item, first, columns, lit }: { item: IndexItem; first: string; columns: string; lit?: boolean }) {
  const external = item.href.startsWith("http");
  const firstCell = lit ? "bg-now font-bold" : "";

  const cells = (
    <>
      <span className={`hidden items-center border-r border-border px-3.5 tabular-nums md:flex ${firstCell} ${lit === undefined ? "font-bold" : ""}`}>
        {first}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 px-3 pt-2.5 pb-3 md:block md:border-r md:border-border md:px-3.5 md:py-3.5">
        <span className="flex justify-between text-sm font-semibold md:hidden">
          <span className={lit ? "bg-now px-1.5" : ""}>{first}</span>
          <span>{item.linkLabel}</span>
        </span>
        <span className="text-[19px] leading-snug font-bold md:mr-3 md:text-lg">{item.title}</span>
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

  const className = `${columns} flex flex-col md:min-h-[52px] hover:bg-now`;

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
