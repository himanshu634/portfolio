import { Metadata } from "next";
import { OpenSourceContri } from "@/components/open-source-contri";
import { Shell } from "@/components/shell";
import { WorkEx } from "@/components/work-ex";

export const metadata: Metadata = {
  title: "Work — Himanshu Mendapara",
  description:
    "Roles and open-source work by Himanshu Mendapara: Bull Agritech, Genuin and WrenAI.",
};

export default function WorkPage() {
  return (
    <Shell current="work">
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Work
      </h1>
      <WorkEx />
      <OpenSourceContri />
    </Shell>
  );
}
