import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export function MDXLink({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isExternal = href?.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className="text-accent-blue hover:underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="text-accent-blue hover:underline underline-offset-2"
      {...props}
    >
      {children}
    </Link>
  );
}
