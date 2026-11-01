import Link from "next/link";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Part } from "@/components/part";
import { PRINCIPLES } from "@/components/principles";
import { Shell } from "@/components/shell";
import { Project } from "@/components/work-ex";

export const metadata: Metadata = {
  title: "Koshi — Himanshu Mendapara",
  description:
    "An app that helps village agro retailers manage their farmers and grow their business, with AI posters checked by OCR and approved by a person. Built end to end by Himanshu Mendapara.",
  keywords: [
    "Koshi",
    "Product Engineering",
    "AI Agents",
    "LangGraph",
    "Human-in-the-loop",
    "Evals",
    "OCR",
    "Offline-first",
    "React Native",
    "Agritech",
  ],
};

const POST = "/blog/gujarati-image-harness";

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="underline decoration-2 underline-offset-[3px] hover:bg-now">
      {children}
    </Link>
  );
}

/** Problem, what shipped and how the AI is kept honest: the case in one ruled row. */
const SUMMARY = [
  {
    heading: "Problem",
    body: "Agro retailers, the village shops that sell farmers seeds, fertiliser and crop protection, need to keep up with their farmers and grow their business. Many owners have limited literacy.",
  },
  {
    heading: "Shipped",
    body: "Farmer records, billing that works offline, a crop calendar, WhatsApp broadcasts and AI posters. On the Play internal track and TestFlight.",
  },
  {
    heading: "How AI is kept honest",
    body: "Every poster is read back with OCR and approved by a person. Evaluations took product extraction from about 42% to about 80% accuracy.",
    lit: true,
  },
];

/** The three parts and the one rule between them. */
const ARCHITECTURE = [
  { name: "Koshi app", role: "Billing works offline and syncs when the network returns." },
  { name: "Backend", role: "The system of record.", lit: true },
  { name: "AI agents", role: "Hand back results through jobs; never write to the backend." },
];

export default function KoshiPage() {
  return (
    <Shell current="projects">
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Koshi
      </h1>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b-2 border-border py-3">
        <p className="min-w-[16rem] flex-1 text-xl leading-snug font-medium sm:text-[22px]">
          An app that helps village agro retailers manage their farmers and grow their business.
          I&apos;m the sole engineer on the app and its backend.
        </p>
        <Link
          href={POST}
          className="py-3 text-base font-semibold underline decoration-2 underline-offset-[3px] hover:bg-now"
        >
          The poster harness post
        </Link>
      </div>

      <section aria-label="Summary" className="mt-5 border-2 border-border md:grid md:grid-cols-3">
        {SUMMARY.map(({ heading, body, lit }) => (
          <div
            key={heading}
            className={`border-t border-border p-3 text-lg leading-relaxed first:border-t-0 md:border-t-0 md:border-l md:p-4 md:first:border-l-0 ${lit ? "bg-now" : ""}`}
          >
            <h2 className="type-display mb-2 text-[30px]">{heading}</h2>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <Part label="2026, in testing" title="Built for the shop counter">
        <p>
          Koshi gives a retailer their farmers, billing, a crop calendar, WhatsApp broadcasts and
          AI posters in one app. The screens stay simple, and complex things, like a crop cycle,
          are shown in an easy form.
        </p>
        <Project name="Billing that works offline">
          <li>
            A bill is saved on the phone first and sent when the network returns, so a bill
            isn&apos;t lost when the network drops.
          </li>
        </Project>
        <Project name="One message to every farmer">
          <li>
            WhatsApp broadcasts with consent: a farmer who replies STOP stops getting them.
          </li>
        </Project>
        <Project name="Growth">
          <li>Analytics show which Facebook and Instagram ads bring retailers to the app.</li>
        </Project>
      </Part>

      <Part label="AI" title="Posters a person can trust">
        <Project name="Three agents, one approval">
          <li>
            A retailer&apos;s voice note becomes a Gujarati marketing poster with the pack, the
            price and the shop&apos;s number.
          </li>
          <li>
            Two pack photos become a catalogue entry: the product, a clean packshot, its Gujarati
            name and the crops it is for.
          </li>
          <li>
            A signboard or visiting-card photo, or a picture the retailer picks, becomes a logo
            for a shop that mostly never had one.
          </li>
          <li>A person approves or edits every result before it is used.</li>
        </Project>
        <Project name="Checked, not trusted">
          <li>
            Image models garble or invent Gujarati text, so every poster is read back with OCR and
            checked word for word against the intended text. One wrong digit in a price fails it,
            and a wrong line is redrawn, up to three times, before a person sees it.{" "}
            <TextLink href={POST}>How the harness works</TextLink>.
          </li>
          <li>
            I built evaluations around the product-onboarding agent. Its extraction accuracy rose
            from about 42% to about 80% on an 86-pack evaluation set.
          </li>
        </Project>
      </Part>

      <Part label="Architecture" title="How it fits together">
        <ul className="mt-2 grid gap-4 sm:grid-cols-3">
          {ARCHITECTURE.map(({ name, role, lit }) => (
            <li
              key={name}
              className={`border-2 border-border px-3 py-2.5 text-base ${lit ? "bg-now" : ""}`}
            >
              <span className="block font-bold">{name}</span>
              {role}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          The agents run apart from the backend and reach it only through jobs. They hand back a
          result, a person approves it, and only then is it saved, so an agent that fails cannot
          corrupt a retailer&apos;s data.
        </p>
      </Part>

      <Part label="How I build AI" title="Four rules">
        <ul className="list-[square] space-y-1 pl-5">
          {PRINCIPLES.map(({ rule, detail }) => (
            <li key={rule}>
              <b>{rule}</b> {detail}
            </li>
          ))}
        </ul>
      </Part>

      <Part label="Stack" title="Built with">
        <p>
          An Expo and React Native app, a Django backend, LangGraph agents, and a Next.js admin
          console for the team.
        </p>
        <p className="mt-4">
          I built it with Claude Code. I set the architecture and the rules the agents follow, and
          reviewed every change before it was merged.
        </p>
      </Part>
    </Shell>
  );
}
