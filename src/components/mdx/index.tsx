import { CodeBlock } from "./code-block";
import { InlineCode } from "./inline-code";
import { Callout } from "./callout";
import { MDXImage } from "./mdx-image";
import { MDXLink } from "./mdx-link";
import { ComponentPropsWithoutRef } from "react";

// Create a wrapper for pre that uses CodeBlock
function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return <CodeBlock {...props}>{children}</CodeBlock>;
}

export const mdxComponents = {
  a: MDXLink,
  pre: Pre,
  code: InlineCode,
  Callout,
  Image: MDXImage,
};
