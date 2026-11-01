import { ReactNode } from "react";

/** One part of the write-up: its label in the left column, the detail beside it (the work page's grid). */
export function Part({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-10 gap-y-3 border-b-2 border-border py-8 md:grid-cols-[260px_minmax(0,680px)]">
      <p className="text-[15px] font-semibold">{label}</p>
      <div className="text-lg leading-relaxed">
        <h2 className="mb-3 text-[28px] leading-tight font-extrabold">{title}</h2>
        {children}
      </div>
    </section>
  );
}
