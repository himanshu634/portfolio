import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border py-4">
      <nav className="max-w-[680px] mx-auto px-4 flex flex-wrap items-center justify-between gap-y-2">
        <Link
          href="/"
          className="font-semibold text-foreground hover:opacity-70 text-sm mr-4"
        >
          Himanshu Mendapara
        </Link>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <Link href="/blogs" className="hover:text-foreground transition-colors">
            Writing
          </Link>
          <Link
            href="https://github.com/himanshu634"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/himanshu-mendapara-a732051aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href="https://x.com/himanshu_btw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            X
          </Link>
          <Link
            href="mailto:himanshumendapra@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            Email
          </Link>
        </div>
      </nav>
    </header>
  );
}
