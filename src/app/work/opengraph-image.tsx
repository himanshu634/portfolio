import { CARD_SIZE, CARD_TYPE, renderShareCard } from "@/lib/share-card";

export const alt = "Work, by Himanshu Mendapara";
export const size = CARD_SIZE;
export const contentType = CARD_TYPE;

export default function Image() {
  return renderShareCard({
    title: "Work",
    facts: [],
    line: "A procurement CRM, production AI agents and the Koshi app at Bull Agritech. Earlier, the Genuin web app and SDK.",
  });
}
