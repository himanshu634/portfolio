import { ComponentPropsWithoutRef } from "react";

export function InlineCode({
  children,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="bg-accent-1/30 text-foreground px-1.5 py-0.5 rounded text-sm font-mono border border-accent-2/50"
      {...props}
    >
      {children}
    </code>
  );
}
