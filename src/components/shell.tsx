import { ReactNode } from "react";
import { Header, type Section } from "@/components/header";
import { Footer } from "@/components/footer";

/** Page frame: the rules stop at the side margins instead of running edge to edge. */
export function Shell({
  current,
  children,
}: {
  current?: Section;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-10">
      <Header current={current} />
      <main>{children}</main>
      <Footer showContact={current !== "home"} />
    </div>
  );
}
