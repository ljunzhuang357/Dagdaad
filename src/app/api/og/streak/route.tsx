import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const STREAK_EMOJIS = ["🌱", "🌿", "🌳", "🔥", "⭐", "💪", "🏆", "👑", "🌟", "💎"];
const STREAK_MSGS = [
  "Goed bezig!",
  "Hou vol!",
  "Wat een doorzetter!",
  "Ongelooflijk!",
  "Legendarisch!",
  "Bijna een maand!",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("s") || "0", 10);
  const emoji = STREAK_EMOJIS[Math.min(days, STREAK_EMOJIS.length - 1)] || "🌟";
  const msg = STREAK_MSGS[Math.min(Math.floor(days / 5), STREAK_MSGS.length - 1)] || "Ongelooflijk!";

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
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 48,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <span style={{ fontSize: 28 }}>✨</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#2D2D2D" }}>Dagdaad</span>
        </div>
        <div style={{ fontSize: 80, marginBottom: 16 }}>{emoji}</div>
        <div style={{ fontSize: 96, fontWeight: 800, color: "#FF8C42", lineHeight: 1 }}>
          {days}
        </div>
        <div style={{ fontSize: 24, color: "#6B6B6B", marginTop: 8, marginBottom: 24 }}>
          {days === 1 ? "dag op rij" : "dagen op rij"}
        </div>
        <div style={{ fontSize: 20, color: "#2D2D2D", fontWeight: 600 }}>
          {msg}
        </div>
        <div style={{ marginTop: "auto", fontSize: 14, color: "#999", display: "flex", gap: 4 }}>
          <span>dagdaad.nl</span>
        </div>
      </div>
    ),
    { width: 600, height: 600 }
  );
}
