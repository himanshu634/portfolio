import { CARD_SIZE, CARD_TYPE, renderShareCard } from "@/lib/share-card";

export const alt = "Writing, by Himanshu Mendapara";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

export default function Image() {
  return renderShareCard({
    title: "Writing",
    facts: [],
    line: "Thought experiments and things I've learned.",
  });
}
