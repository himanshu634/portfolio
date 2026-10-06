import { ComponentPropsWithoutRef } from "react";

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={`my-6 overflow-x-auto border-2 border-border p-4 ${className || ""}`}
      {...props}
    >
      {children}
    </pre>
  );
}
