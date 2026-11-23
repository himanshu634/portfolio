import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_HOST, SITE_NAME } from "@/lib/site";

/**
 * The picture a link shows when it is shared (direction A, "The headline",
 * of the share-cards canvas): the page's title in the condensed display cut,
 * black on white, between a ruled strip of facts and a strip with the name
 * and the domain. Every opengraph-image.tsx renders through here.
 */

export const CARD_SIZE = { width: 1200, height: 630 };
export const CARD_TYPE = "image/png";

// The image renderer can't use Archivo's width axis, so the condensed cut
// and the text weights are static instances kept in assets/fonts.
async function loadFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [display, semibold, bold] = await Promise.all([
    readFile(join(dir, "Archivo-ExtraCondensed-Black.ttf")),
    readFile(join(dir, "Archivo-SemiBold.ttf")),
    readFile(join(dir, "Archivo-Bold.ttf")),
  ]);
  return [
    { name: "Archivo Display", data: display, weight: 900 as const, style: "normal" as const },
    { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Archivo", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

const display = {
  fontFamily: "Archivo Display",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.01em",
} as const;

/** Big for a one-word page name, smaller as a post title grows, so it stays within three lines. */
function titleSize(title: string): number {
  const n = title.length;
  if (n <= 10) return 240;
  if (n <= 28) return 150;
  if (n <= 48) return 128;
  if (n <= 72) return 100;
  return 96;
}

function Byline() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: "2px solid #000",
        paddingTop: 18,
      }}
    >
      <span style={{ ...display, fontSize: 44, lineHeight: 0.9 }}>{SITE_NAME}</span>
      <span style={{ fontSize: 24, fontWeight: 600 }}>{SITE_HOST}</span>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "48px 64px 44px",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "Archivo",
      }}
    >
      {children}
    </div>
  );
}

export async function renderShareCard({
  title,
  facts = [],
  line,
}: {
  title: string;
  /** Short facts in ruled cells above the title: "Writing", the date, the read time. */
  facts?: string[];
  /** One sentence under a short title, for the section and project pages. */
  line?: string;
}) {
  const size = titleSize(title);
  return new ImageResponse(
    (
      <Frame>
        {facts.length > 0 && (
          <div
            style={{
              display: "flex",
              borderTop: "2px solid #000",
              borderBottom: "2px solid #000",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {facts.map((fact, i) => (
              <span
                key={fact}
                style={{
                  padding: i === 0 ? "10px 24px 10px 0" : "10px 24px",
                  borderRight: i < facts.length - 1 ? "2px solid #000" : "none",
                }}
              >
                {fact}
              </span>
            ))}
          </div>
        )}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div style={{ ...display, fontSize: size, lineHeight: 0.88 }}>{title}</div>
          {line && (
            <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>{line}</div>
          )}
        </div>
        <Byline />
      </Frame>
    ),
    { ...CARD_SIZE, fonts: await loadFonts() },
  );
}

/** The home card: the name as the headline, the lede on the ruled strip under it. */
export async function renderHomeCard(lede: string) {
  return new ImageResponse(
    (
      <Frame>
        <div style={{ ...display, display: "flex", flexDirection: "column", fontSize: 212, lineHeight: 0.86, paddingTop: 8 }}>
          <span>Himanshu</span>
          <span>Mendapara</span>
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            borderTop: "2px solid #000",
            paddingTop: 22,
          }}
        >
          <span style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15, maxWidth: 780 }}>{lede}</span>
          <span style={{ fontSize: 24, fontWeight: 600, whiteSpace: "nowrap" }}>{SITE_HOST}</span>
        </div>
      </Frame>
    ),
    { ...CARD_SIZE, fonts: await loadFonts() },
  );
}
