import { CARD_SIZE, CARD_TYPE, renderShareCard } from "@/lib/share-card";

export const alt = "Koshi, a project by Himanshu Mendapara";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

export default function Image() {
  return renderShareCard({
    title: "Koshi",
    facts: ["Project"],
    line: "An app that helps village agro retailers manage their farmers and grow their business.",
  });
}
