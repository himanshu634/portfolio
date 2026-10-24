import Image from "next/image";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Shell } from "@/components/shell";
import { Project } from "@/components/work-ex";

export const metadata: Metadata = {
  title: "Citadel — Himanshu Mendapara",
  description:
    "A company brain on FalkorDB that Claude agents answer from, and the Keeper agent that repairs it. Built for Graph Hacks, October 2026.",
  keywords: [
    "Citadel",
    "FalkorDB",
    "Knowledge Graph",
    "GraphRAG",
    "AI Agents",
    "LLM",
    "Claude",
    "Cypher",
    "Evals",
  ],
};

const REPO = "https://github.com/himanshu634/citadel";

/** One part of the write-up: its label in the left column, the detail beside it (the work page's grid). */
function Part({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-10 gap-y-3 border-b-2 border-border py-8 md:grid-cols-[260px_minmax(0,680px)]">
      <p className="text-[15px] font-semibold">{label}</p>
      <div className="text-lg leading-relaxed">
        <h2 className="mb-3 text-[28px] leading-tight font-extrabold">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Diagram({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="mt-6">
      <Image
        src={src}
        alt={alt}
        width={1950}
        height={620}
        className="h-auto w-full border-2 border-border bg-white"
      />
      <figcaption className="mt-2 text-base text-muted">{caption}</figcaption>
    </figure>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="text-[0.9em]">{children}</code>;
}

export default function CitadelPage() {
  return (
    <Shell current="projects">
      <h1 className="type-display border-b-2 border-border pt-5 pb-3.5 text-[clamp(3.5rem,9.4vw,7.5rem)]">
        Citadel
      </h1>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b-2 border-border py-3">
        <p className="min-w-[16rem] flex-1 text-xl leading-snug font-medium sm:text-[22px]">
          A company brain that AI agents can query, and the Keeper: the agent that repairs it.
        </p>
        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold underline decoration-2 underline-offset-[3px] hover:bg-now"
        >
          GitHub<span aria-hidden="true">&nbsp;↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <Part label="October 2026" title="What it is">
        <p>
          Every team asks the same questions: who knows this system, why was this decided, what
          breaks if we change it. The answers are already in commits, pull requests, reviews,
          tickets and docs, but nobody can hold all of it, and an AI assistant without that
          context guesses.
        </p>
        <p className="mt-4">
          Citadel puts it all in one FalkorDB graph per company and answers from it, with the
          sources and the graph path behind every answer. When the graph does not know
          something, it does not guess: the Keeper finds out, checks the answer against the
          sources and writes it back. My entry for Graph Hacks: Context for AI Agents (FalkorDB ×
          WeMakeDevs), on the Company Brain and Agent Memory tracks.
        </p>
        <Diagram
          src="/projects/citadel/overview.png"
          alt="Sources are ingested into one FalkorDB graph per company. The Ask agent answers from it with sources and a graph path. Questions it cannot answer go to the Keeper, which writes checked claims back; the Archivist loads older history on demand."
          caption="Sources become one graph per company. Whatever Ask can't answer goes to the Keeper."
        />
      </Part>

      <Part label="LLM and AI engineering" title="Agents that cite what they saw">
        <Project name="Five Claude agents, one job each">
          <li>
            Ask answers questions. The Keeper keeps the brain right, with <Code>pm</Code> and{" "}
            <Code>qa</Code> agents advising it. The Archivist fetches history older than the
            ingest window from GitHub or Linear and loads it into the graph.
          </li>
          <li>
            Agents never message each other. The graph is the only channel: a handoff is a
            record that shows up in the next agent&apos;s queue query.
          </li>
          <li>
            Every job also has a deterministic offline policy, so the test suite calls no API.
          </li>
        </Project>
        <Project name="Grounded answers">
          <li>
            Ask reads the graph only through 22 named, reviewed Cypher tools. It may cite only
            nodes it saw in this run&apos;s tool results; a grounding check rejects any other
            citation.
          </li>
          <li>
            The person asking picks the model per question (Haiku, Sonnet, Opus or Fable),
            and the page shows what each costs against Haiku.
          </li>
        </Project>
        <Project name="Rules in code, not in the model">
          <li>
            Sources win: a claim the sources contradict is never written, and <Code>pm</Code>{" "}
            opens a follow-up to fix the source instead.
          </li>
          <li>
            A critical claim (it replaces a claim, touches a high-impact system, or has no
            source behind it) waits for a lead&apos;s approval.
          </li>
        </Project>
        <Project name="Memory that changes">
          <li>
            Accepted claims become dated <Code>Claim</Code> nodes linked to their evidence, with{" "}
            <Code>valid_from</Code> and <Code>valid_to</Code>. A newer claim supersedes the old
            one, and nothing is deleted.
          </li>
          <li>
            Every Ask turn is stored as a graph (
            <Code>Thread → Turn → LLMCall → ToolCall → Ref</Code>), and every Keeper review as
            its steps.
          </li>
        </Project>
        <Project name="Evals with deterministic graders">
          <li>
            <Code>make eval</Code> asks Claude fixed questions on a loaded brain and grades each
            answer on cited uids, tools run, answer text and step count. No model grades
            another model.
          </li>
          <li>
            One prompt rule, to cite each ranked row by its own uid, took Sonnet 5.5 from 88% to
            100% (51/51) on the synthetic company and from 93% to 99% (68/69) on the
            FalkorDB/FalkorDB repo, three runs per case.
          </li>
        </Project>
        <Diagram
          src="/projects/citadel/self-healing-loop.png"
          alt="The self-healing loop: a failed question opens a gap, the Keeper consults pm and qa, fixed checks run in code, an accepted claim is written to the brain, and the next answer cites it."
          caption="Every question the brain can't answer makes it better for the next person."
        />
      </Part>

      <Part label="FalkorDB" title="How I used FalkorDB">
        <Project name="Three graphs per company">
          <li>
            <Code>brain_&lt;slug&gt;</Code> holds what the company knows: people, teams,
            systems, changes, PRs, issues, tickets and documents.
          </li>
          <li>
            <Code>agent_&lt;slug&gt;</Code> holds chat memory, and{" "}
            <Code>keeper_&lt;slug&gt;</Code> the Keeper&apos;s ledger, in its own graph so a
            rebuild of the brain cannot remove it.
          </li>
          <li>
            Each agent connects as its own database user, and a permission table says which
            graph it may touch.
          </li>
        </Project>
        <Project name="Idempotent ingest">
          <li>
            Adapters fetch into a raw cache, records get stable uids, and the loader{" "}
            <Code>MERGE</Code>s on uid, so a re-ingest changes nothing and makes no API calls.
          </li>
          <li>
            Range indexes on every uid, and a shared <Code>Node</Code> label so a lookup by uid
            alone is an index scan.
          </li>
        </Project>
        <Project name="Graph algorithms in the answers">
          <li>
            <Code>algo.SPpaths</Code> for how two things connect, in either direction.
          </li>
          <li>
            <Code>algo.pageRank</Code> for the central systems. The Keeper uses it too: a
            system in the top quarter by PageRank counts as high impact, so claims about it
            need a lead.
          </li>
          <li>
            <Code>algo.betweenness</Code> over <Code>BLOCKS</Code>, <Code>CLOSES</Code> and{" "}
            <Code>MENTIONS</Code> for bottleneck tickets, and variable-length{" "}
            <Code>BLOCKS</Code> paths for what a ticket waits on.
          </li>
        </Project>
        <Project name="Search">
          <li>Full-text indexes on work items and documents.</li>
          <li>
            An HNSW cosine vector index on text chunks of work items and documents for semantic search,
            embedded locally with fastembed (no text leaves the machine) or with Gemini.
          </li>
        </Project>
        <Project name="Guard rails">
          <li>
            When no tool fits, Ask may write one query. It runs as <Code>GRAPH.RO_QUERY</Code>,
            so writes are refused, with a 5 s timeout and a required <Code>LIMIT</Code>.
          </li>
          <li>
            Every status change is guarded in its Cypher, so of two racing approvals one wins
            and the other gets HTTP 409.
          </li>
        </Project>
        <Diagram
          src="/projects/citadel/brain-internals.png"
          alt="Adapters, normalisation and an idempotent loader write into three FalkorDB graphs. The Ask agent reads the brain only through named Cypher tools and one guarded read-only query, saves every turn to chat memory and opens a gap in the Keeper's ledger when it fails."
          caption="Data goes one way into the graph. Agents read it back only through tools I wrote."
        />
      </Part>

      <Part label="Stack" title="Built with">
        <p>
          Python with uv, FastAPI, SvelteKit, FalkorDB in Docker, and Claude through the
          Anthropic API.
        </p>
        <p className="mt-4">
          I built it with Claude Code. I set the architecture, the rules the agents follow and
          every screen; Claude wrote the code and tests on branches, and I reviewed each change
          before it was merged.
        </p>
      </Part>
    </Shell>
  );
}
