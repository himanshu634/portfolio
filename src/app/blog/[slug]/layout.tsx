import { ReactNode } from "react";
import { Shell } from "@/components/shell";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <Shell current="writing">{children}</Shell>;
}
