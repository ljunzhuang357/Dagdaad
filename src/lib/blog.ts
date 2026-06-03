import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

function parseFrontmatter(
  raw: string
): { metadata: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter");

  const metadata: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(": ");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 2).trim();
    // strip surrounding quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    metadata[key] = value;
  });

  return { metadata, content: match[2].trim() };
}

function parseTags(raw: string): string[] {
  const t = raw.trim();
  if (!t.startsWith("[") || !t.endsWith("]")) return [];
  return t
    .slice(1, -1)
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
}

const contentDir = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPost[] {
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { metadata, content } = parseFrontmatter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: metadata.title || "",
      description: metadata.description || "",
      date: metadata.date || "",
      tags: metadata.tags ? parseTags(metadata.tags) : [],
      content,
    };
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getRecentPosts(count: number = 3): BlogPost[] {
  return getAllPosts().slice(0, count);
}
