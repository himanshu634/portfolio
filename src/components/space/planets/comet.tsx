"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Billboard, Text } from "@react-three/drei";
import { useTravelStore } from "@/lib/store";
import { SUN_POSITION, WAYPOINT_BY_ID } from "@/lib/flight/path";
import { PLANET_THEMES, type PostShard } from "@/lib/content";
import { useWarpHandlers } from "./common";
import {
  FONT_DISPLAY,
  FONT_MONO,
  HoloText,
  Reveal,
  useOrbitPos,
} from "../content/orbit-panel";

const W = WAYPOINT_BY_ID.comet;
const THEME = PLANET_THEMES.comet;

/** Dust tail always points away from the sun, as comets insist on doing. */
function useTailDirection(): THREE.Vector3 {
  return useMemo(
    () => W.position.clone().sub(SUN_POSITION).normalize(),
    []
  );
}

function CometTail() {
  const tailDir = useTailDirection();
  const geometry = useMemo(() => {
    const count = 700;
    const positions = new Float32Array(count * 3);
    const basis = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const along = Math.pow(Math.random(), 1.6) * 26;
      const spread = 0.25 + along * 0.16;
      basis
        .copy(tailDir)
        .multiplyScalar(along)
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread
          )
        );
      positions[i * 3] = basis.x;
      positions[i * 3 + 1] = basis.y;
      positions[i * 3 + 2] = basis.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [tailDir]);

  return (
    <points geometry={geometry} raycast={() => null}>
      <pointsMaterial
        size={0.22}
        color="#ffe9b3"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** Blog posts trail off the comet as shards — newest nearest the nucleus. */
function PostShards({ posts }: { posts: PostShard[] }) {
  const router = useRouter();
  const tailDir = useTailDirection();
  const shards = useMemo(
    () =>
      posts.slice(0, 5).map((post, i) => ({
        post,
        position: tailDir
          .clone()
          .multiplyScalar(5 + i * 5.5)
          .add(
            new THREE.Vector3(
              Math.sin(i * 2.4) * 1.6,
              Math.cos(i * 1.8) * 1.4 + 1.2,
              Math.sin(i * 3.1) * 1.2
            )
          ),
      })),
    [posts, tailDir]
  );

  return (
    <>
      {shards.map(({ post, position }, i) => (
        <Reveal key={post.slug} at={0.12 + i * 0.16} position={position}>
          <Billboard follow>
            <Text
              font={FONT_MONO}
              fontSize={0.42}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={9}
              textAlign="center"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/blog/${post.slug}`);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => (document.body.style.cursor = "auto")}
            >
              {post.title}
            </Text>
            <Text
              font={FONT_MONO}
              fontSize={0.26}
              color="#b8a86f"
              position={[0, -0.75, 0]}
              anchorX="center"
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) + (post.readTime ? ` · ${post.readTime}` : "")}
            </Text>
          </Billboard>
        </Reveal>
      ))}
    </>
  );
}

export function Comet({ posts }: { posts: PostShard[] }) {
  const currentPlanet = useTravelStore((s) => s.currentPlanet);
  const active = currentPlanet === "comet";
  const router = useRouter();
  const nucleus = useRef<THREE.Mesh>(null);
  const { handlers } = useWarpHandlers("comet");

  // Retrograde: the contrarian — every team has one.
  useFrame((_, delta) => {
    if (nucleus.current) nucleus.current.rotation.y -= delta * 0.4;
  });

  const headingPos = useOrbitPos(W, 0.3, 1.5, 3.0);
  const blurbPos = useOrbitPos(W, 0.55, 1.5, 2.0);
  const allPostsPos = useOrbitPos(W, 1.9, 1.6, 2.0);

  return (
    <>
      <group position={W.position}>
        <mesh ref={nucleus} {...handlers}>
          <icosahedronGeometry args={[W.radius, 1]} />
          <meshStandardMaterial color="#cdc4ae" roughness={0.95} metalness={0} />
        </mesh>
        {/* coma glow */}
        <mesh scale={1.7} raycast={() => null}>
          <sphereGeometry args={[W.radius, 20, 10]} />
          <meshBasicMaterial
            color="#ffe9b3"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <CometTail />
        {active && <PostShards posts={posts} />}
      </group>
      {active && (
        <>
          <Reveal at={0.02} position={headingPos}>
            <HoloText font={FONT_DISPLAY} size={0.95} color="#ffffff" emissive>
              WRITING // COMET SCRIPTOR
            </HoloText>
          </Reveal>
          <Reveal at={0.06} position={blurbPos}>
            <HoloText font={FONT_MONO} size={0.34} color="#b8a86f" maxWidth={10}>
              Posts trail off the nucleus. Newest closest — drafts get flung
              into deep space.
            </HoloText>
          </Reveal>
          <Reveal at={0.85} position={allPostsPos}>
            <Billboard follow>
              <Text
                font={FONT_MONO}
                fontSize={0.45}
                color={THEME.accent}
                anchorX="center"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/blogs");
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => (document.body.style.cursor = "auto")}
              >
                All posts →
              </Text>
            </Billboard>
          </Reveal>
        </>
      )}
    </>
  );
}
