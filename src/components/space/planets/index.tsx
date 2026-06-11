"use client";

import type { PostShard } from "@/lib/content";
import { Sun } from "./sun";
import { Terra } from "./terra";
import { Forge } from "./forge";
import { GasGiant } from "./gas-giant";
import { Glacius } from "./glacius";
import { Comet } from "./comet";
import { Relay } from "./relay";

/** The whole system: one sun, six worlds, zero DOM cards. */
export function PlanetSystem({ posts }: { posts: PostShard[] }) {
  return (
    <>
      <Sun />
      <Terra />
      <Forge />
      <GasGiant />
      <Glacius />
      <Comet posts={posts} />
      <Relay />
    </>
  );
}
