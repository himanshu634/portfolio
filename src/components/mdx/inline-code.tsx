import { ComponentPropsWithoutRef } from "react";

export function InlineCode({
  children,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="border border-border px-1 font-mono text-[0.85em]"
      {...props}
    >
      {children}
    </code>
  );
}
