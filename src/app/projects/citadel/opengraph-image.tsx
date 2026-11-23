import { CARD_SIZE, CARD_TYPE, renderShareCard } from "@/lib/share-card";

export const alt = "Citadel, a project by Himanshu Mendapara";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

export default function Image() {
  return renderShareCard({
    title: "Citadel",
    facts: ["Project", "Graph Hacks, October 2026"],
    line: "A company brain that AI agents can query, and the Keeper: the agent that repairs it.",
  });
}
