import { CARD_SIZE, CARD_TYPE, renderHomeCard } from "@/lib/share-card";

export const alt = "Himanshu Mendapara: product engineer, curious about AI and how to implement it well.";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

export default function Image() {
  return renderHomeCard("Product engineer, curious about AI and how to implement it well.");
}
