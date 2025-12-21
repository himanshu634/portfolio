import { ComponentPropsWithoutRef } from "react";

export function H1({ children, ...props }: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className="text-4xl font-bold mt-8 mb-4 text-foreground border-b border-accent-2 pb-2"
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className="text-3xl font-bold mt-8 mb-4 text-foreground"
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className="text-2xl font-semibold mt-6 mb-3 text-foreground"
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ children, ...props }: ComponentPropsWithoutRef<"h4">) {
  return (
    <h4
      className="text-xl font-semibold mt-4 mb-2 text-foreground"
      {...props}
    >
      {children}
    </h4>
  );
}
