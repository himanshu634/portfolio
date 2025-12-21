import { CodeBlock } from "./code-block";
import { InlineCode } from "./inline-code";
import { Callout } from "./callout";
import { MDXImage } from "./mdx-image";
import { MDXLink } from "./mdx-link";
import { H1, H2, H3, H4 } from "./headings";
import { ComponentPropsWithoutRef } from "react";

// Create a wrapper for pre that uses CodeBlock
function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return <CodeBlock {...props}>{children}</CodeBlock>;
}

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: MDXLink,
  pre: Pre,
  code: InlineCode,
  Callout,
  Image: MDXImage,
};
