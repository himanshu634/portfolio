import { ComponentPropsWithoutRef } from "react";

export function InlineCode({
  children,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  );
}
