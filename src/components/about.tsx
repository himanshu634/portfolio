import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const STATUS = "Tech Lead @ Bull Agritech";

export function About() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-6">
      {/* Photo */}
      <div className="mb-6 w-[148px] h-[148px] relative overflow-hidden rounded-2xl ring-2 ring-accent/40 photo-wiggle cursor-pointer">
        <Image
          src="https://github.com/himanshu634.png"
          alt="Himanshu Mendapara"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Name */}
      <h1 className="text-4xl sm:text-5xl font-semibold mb-3 tracking-tight">
        Himanshu Mendapara
      </h1>

      {/* Status — HUD-style chip */}
      <div className="flex items-center gap-2 text-sm font-mono text-foreground mb-6 rounded-full border border-border bg-panel px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        {STATUS}
      </div>

      {/* Tagline */}
      <p className="text-muted leading-relaxed mb-12 max-w-xl text-base sm:text-lg">
        An engineer solving for agritech.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-10 justify-center">
        <Link
          href="#work"
          className="group inline-flex items-center gap-3 text-xl font-mono text-accent hover:text-foreground transition-colors"
        >
          Begin tour
          <ArrowRight
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
            strokeWidth={1.5}
          />
        </Link>
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-3 text-xl font-mono text-foreground hover:text-accent transition-colors"
        >
          Writing
          <ArrowRight
            className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45"
            strokeWidth={1.5}
          />
        </Link>
      </div>

      {/* Scroll hint */}
      <p className="mt-12 text-[11px] font-mono tracking-[0.3em] text-muted animate-pulse">
        SCROLL TO FLY
      </p>
    </section>
  );
}
