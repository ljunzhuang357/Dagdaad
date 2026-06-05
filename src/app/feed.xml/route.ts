import { getAllPosts } from "@/lib/blog";

const base = "https://dagdaad.nl";

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (p) => `
    <entry>
      <id>${base}/blog/${p.slug}</id>
      <title>${escapeXml(p.title)}</title>
      <link href="${base}/blog/${p.slug}" rel="alternate" type="text/html"/>
      <published>${p.date}T00:00:00+02:00</published>
      <updated>${p.date}T00:00:00+02:00</updated>
      <summary type="text">${escapeXml(p.description)}</summary>
      <author>
        <name>Dagdaad</name>
      </author>
      ${p.tags.map((t) => `<category term="${escapeXml(t)}" />`).join("\n      ")}
    </entry>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Dagdaad Blog</title>
  <subtitle>Artikelen over vriendelijkheid, positiviteit en de wetenschap van goede daden</subtitle>
  <link href="${base}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${base}/blog" rel="alternate" type="text/html"/>
  <id>${base}/blog</id>
  <updated>${posts[0]?.date || "2026-06-03"}T00:00:00+02:00</updated>
  <author>
    <name>Dagdaad</name>
  </author>
  <rights>© ${new Date().getFullYear()} Dagdaad</rights>
  ${items}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
