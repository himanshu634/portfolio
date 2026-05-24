import Link from "next/link";

export function OpenSourceContri() {
  return (
    <section className="pb-12">
      <h2 className="text-2xl font-semibold mb-8">Open Source</h2>

      <div>
        <div className="mb-3">
          <h3 className="font-semibold text-lg">
            <Link
              href="https://github.com/Canner/WrenAI"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              Wren-AI
            </Link>
          </h3>
          <p className="text-sm text-muted">Canner.io</p>
        </div>

        <p className="mb-3 text-foreground">
          An open-source AI-powered data analysis platform enabling natural
          language queries on databases.
        </p>

        <ul className="space-y-2 text-sm text-foreground list-none pl-0">
          <li>
            — Developed the Trino connector for Wren-AI&apos;s engine, enabling
            unified SQL and NoSQL queries. (
            <Link
              href="https://github.com/Canner/WrenAI/issues/535"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              #535
            </Link>
            )
          </li>
          <li>
            — Improved UI and fixed bugs. (
            <Link
              href="https://github.com/Canner/WrenAI/issues/746"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              #746
            </Link>
            ,{" "}
            <Link
              href="https://github.com/Canner/WrenAI/issues/491"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70"
            >
              #491
            </Link>
            )
          </li>
          <li>
            — Featured on the Trino Community Broadcast for the Trino connector
            work.
          </li>
        </ul>

        <div className="relative pb-[56.25%] h-0 mt-6 overflow-hidden">
          <iframe
            src="https://www.youtube-nocookie.com/embed/pUh7DIaznPg?si=XuR9mOueKEym7GFW&amp;start=574"
            title="Trino Community Broadcast — Wren-AI"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
