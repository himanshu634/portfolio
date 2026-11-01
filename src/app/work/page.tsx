import { Metadata } from "next";
import { OpenSourceContri } from "@/components/open-source-contri";
import { Shell } from "@/components/shell";
import { WorkEx } from "@/components/work-ex";

export const metadata: Metadata = {
  title: "Work — Himanshu Mendapara",
  description:
    "Himanshu Mendapara's work: tech lead at Bull Agritech on a procurement CRM, production AI agents and the Koshi app; earlier, the Genuin web app and SDK.",
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
