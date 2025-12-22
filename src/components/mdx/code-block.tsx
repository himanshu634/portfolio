import { ComponentPropsWithoutRef } from "react";

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={`rounded-lg border border-accent-2 bg-accent-1/20 p-4 overflow-x-auto my-4 ${className || ""}`}
      {...props}
    >
      {children}
    </pre>
  );
}
