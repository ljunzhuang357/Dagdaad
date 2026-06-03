import { ImageResponse } from "next/og";
import postsData from "@/data/blog-summary.json";

export const runtime = "edge";

export const alt = "Dagdaad blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = (postsData as { slug: string; title: string; description: string; date: string; tags: string[] }[]).find(
    (p) => p.slug === slug
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 30%, #FFCC80 60%, #FFB74D 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
          }}
        />

        {/* Tags */}
        {post?.tags && post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 18,
              marginBottom: 24,
            }}
          >
            {post.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: 999,
                  padding: "6px 16px",
                  color: "#6B4F3A",
                  fontSize: 16,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#3E2723",
            margin: 0,
            display: "flex",
          }}
        >
          {post?.title || "Dagdaad blog"}
        </h1>

        {/* Description */}
        {post?.description && (
          <p
            style={{
              fontSize: 24,
              color: "#5D4037",
              marginTop: 20,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {post.description}
          </p>
        )}

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: "auto",
            paddingTop: 40,
          }}
        >
          <span style={{ fontSize: 28 }}>✨</span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#4E342E",
            }}
          >
            Dagdaad
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
