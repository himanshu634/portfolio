/** How I build AI, as shown on the Koshi case study. */
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
