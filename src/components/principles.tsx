/** How I build AI, as shown on the home page and the Koshi case study. */
export const PRINCIPLES = [
  {
    rule: "Agents never write to the system of record.",
    detail: "They return a result; the backend decides what is saved.",
  },
  {
    rule: "LLMs never do arithmetic.",
    detail: "Prices, totals and quantities come from code.",
  },
  {
    rule: "Generated output is checked.",
    detail: "Posters are read back with OCR; agents are held to an evaluation set.",
  },
  {
    rule: "A person approves.",
    detail: "Every poster, catalogue entry and logo, before it ships.",
  },
];

/** The home page's strip: four ruled cells on desktop, stacked on a phone. */
export function Principles() {
  return (
    <section aria-labelledby="principles-heading" className="mt-5 border-2 border-border">
      <h2
        id="principles-heading"
        className="type-display flex h-14 items-center border-b-2 border-border px-3 text-[30px] md:px-3.5 md:text-[34px]"
      >
        How I build AI
      </h2>
      <ul className="md:grid md:grid-cols-4">
        {PRINCIPLES.map(({ rule, detail }) => (
          <li
            key={rule}
            className="border-t border-border px-3 pt-2.5 pb-3 first:border-t-0 md:border-t-0 md:border-l md:px-3.5 md:py-3.5 md:first:border-l-0"
          >
            <p className="text-[19px] leading-tight font-bold">{rule}</p>
            <p className="mt-1.5 text-muted">{detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
