import Image from "next/image";
import { CONTACT_LINKS } from "@/components/footer";

/**
 * The home page's first box: who this is and how to reach him, on the index
 * table's own columns (150 | 1fr | 170) so its rules line up with Now below.
 * On a phone the sentence leads and the links become one row of four cells.
 */
export function Lede() {
  return (
    <section
      id="contact"
      aria-label="About and contact"
      className="scroll-mt-4 border-2 border-border md:grid md:grid-cols-[150px_minmax(0,1fr)_170px]"
    >
      <Image
        src="/himanshu.jpeg"
        alt="Himanshu Mendapara"
        width={150}
        height={150}
        className="hidden size-[150px] border-r border-border object-cover object-top grayscale md:block"
        priority
      />
      <p className="px-3 pt-3 pb-3.5 text-[22px] leading-[1.2] font-bold tracking-[-0.01em] md:flex md:items-center md:border-r md:border-border md:py-3.5 md:pr-5 md:pl-3.5 md:text-[31px] md:leading-[1.16]">
        Product engineer and tech lead. I build AI products end to end, from the agent to the app it ships in.
      </p>
      <ul className="grid grid-cols-4 border-t border-border text-[15px] font-semibold md:grid-cols-1 md:grid-rows-4 md:border-t-0 md:text-base">
        {CONTACT_LINKS.map(({ label, href }) => {
          const external = href.startsWith("http");
          return (
            <li
              key={label}
              className="border-l border-border first:border-l-0 md:border-t md:border-l-0 md:first:border-t-0"
            >
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-12 items-center justify-center hover:bg-now md:h-full md:justify-start md:px-3.5"
              >
                {label}
                {external && (
                  <>
                    <span aria-hidden="true">&nbsp;↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
