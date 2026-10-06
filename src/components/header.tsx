import Link from "next/link";

export type Section = "home" | "work" | "writing";

export function Header({ current }: { current?: Section }) {
  const linkClass = (section?: Section) =>
    `py-3 hover:bg-now ${
      current === section
        ? "underline decoration-2 underline-offset-4"
        : "no-underline"
    }`;

  return (
    <header className="border-b-2 border-border">
      <nav className="flex flex-wrap items-center justify-between gap-x-8 text-[15px] font-semibold sm:h-12">
        {current === "home" ? (
          <span className="hidden sm:block">Ahmedabad, India</span>
        ) : (
          <Link
            href="/"
            className="type-display pt-3 text-[22px] hover:bg-now sm:pt-0"
          >
            Himanshu Mendapara
          </Link>
        )}
        <div className="flex w-full justify-between sm:w-auto sm:gap-7">
          <Link
            href="/work"
            className={linkClass("work")}
            aria-current={current === "work" ? "page" : undefined}
          >
            Work
          </Link>
          {/* A plain anchor: next/link changes the hash without a hashchange event,
              so on the home page the index would not switch to Projects. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#projects" className={linkClass()}>
            Projects
          </a>
          <Link
            href="/blogs"
            className={linkClass("writing")}
            aria-current={current === "writing" ? "page" : undefined}
          >
            Writing
          </Link>
          <a href="#contact" className={linkClass()}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
