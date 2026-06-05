import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const STREAK_MSGS = [
  "Goed bezig!",
  "Hou vol!",
  "Wat een doorzetter!",
  "Ongelooflijk!",
  "Legendarisch!",
  "Bijna een maand!",
];

// Satori-safe emoji: use text labels instead of native emoji
const STREAK_LABELS = [
  { label: "BEGIN", color: "#6B8F71" },
  { label: "GROEI", color: "#4A7C59" },
  { label: "STERK", color: "#2D5A3D" },
  { label: "VUUR", color: "#E67E22" },
  { label: "STER", color: "#F1C40F" },
  { label: "KRACHT", color: "#E74C3C" },
  { label: "GOUD", color: "#F39C12" },
  { label: "KROON", color: "#9B59B6" },
  { label: "TOP", color: "#FF8C42" },
  { label: "SUPER", color: "#8E44AD" },
];

async function loadFont(weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((r) => r.text());
  const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for weight ${weight}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("s") || "0", 10);
  const idx = Math.min(days, STREAK_LABELS.length - 1);
  const lev = STREAK_LABELS[idx] || STREAK_LABELS[0];
  const msgIdx = Math.min(Math.floor(days / 5), STREAK_MSGS.length - 1);
  const msg = STREAK_MSGS[msgIdx] || "Ongelooflijk!";

  const [inter400, inter700] = await Promise.all([
    loadFont(400),
    loadFont(700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 600,
          height: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0EC 50%, #E8E0FF 100%)",
          fontFamily: "Inter",
          padding: 48,
          textAlign: "center",
        }}
      >
        {/* Dagdaad logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#FF8C42",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            D
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#2D2D2D", display: "flex" }}>
              Dagdaad
            </span>
          </div>
        </div>

        {/* Streak level badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 50,
            background: lev.color,
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {lev.label}
        </div>

        {/* Day number */}
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#FF8C42",
            lineHeight: 1,
          }}
        >
          {days}
        </div>

        {/* "dagen op rij" */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#6B6B6B",
            marginTop: 8,
            marginBottom: 24,
          }}
        >
          {days === 1 ? "dag op rij" : "dagen op rij"}
        </div>

        {/* Message */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#2D2D2D",
            fontWeight: 700,
          }}
        >
          {msg}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#FF8C42",
              fontWeight: 700,
              gap: 6,
              alignItems: "center",
            }}
          >
            <span style={{ display: "flex" }}>Doe ook mee</span>
            <span style={{ display: "flex", fontSize: 18 }}>{">"}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#999",
            }}
          >
            dagdaad.nl
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
      fonts: [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
      ],
    }
  );
}
