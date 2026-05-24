"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="text-muted hover:text-foreground transition-colors text-sm"
      aria-label="Go to top"
    >
      ↑ top
    </button>
  ) : null;
}

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <p>© 2025 Himanshu Mendapara</p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/himanshu634"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
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
            href="https://www.linkedin.com/in/himanshu-mendapara-a732051aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:himanshumendapra@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            Email
          </Link>
          <ScrollToTop />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
