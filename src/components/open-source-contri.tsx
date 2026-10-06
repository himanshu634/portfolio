import { ExperienceItem, Ext } from "@/components/work-ex";

export function OpenSourceContri() {
  return (
    <section>
      <h2 className="type-display border-b-2 border-border pt-12 pb-3 text-[clamp(2.5rem,6vw,4rem)]">
        Open source
      </h2>
      <ExperienceItem
        title="WrenAI"
        company="Canner.io"
        duration="2024"
        content={
          <>
            <p>
              An open-source, AI-powered data analysis platform that answers
              natural-language questions about your databases.
            </p>
            <ul className="mt-4 list-[square] space-y-1 pl-5">
              <li>
                Built the Trino connector for Wren&apos;s engine, enabling
                unified SQL and NoSQL queries (
                <Ext href="https://github.com/Canner/WrenAI/pull/535">#535</Ext>,
                merged August 2024).
              </li>
              <li>
                Improved the UI and fixed bugs (
                <Ext href="https://github.com/Canner/WrenAI/issues/746">#746</Ext>,{" "}
                <Ext href="https://github.com/Canner/WrenAI/issues/491">#491</Ext>).
              </li>
              <li>
                Featured on Trino Community Broadcast 66, October 2024, for the
                connector work.
              </li>
            </ul>
            <div className="relative mt-6 aspect-video border-2 border-border">
              <iframe
                src="https://www.youtube-nocookie.com/embed/pUh7DIaznPg?start=574"
                title="Trino Community Broadcast 66: Chat with Trino and Wren AI"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </>
        }
      />
    </section>
  );
}
