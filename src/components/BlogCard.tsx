import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { getClusterStyle } from "@/lib/cluster";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.date + "T00:00:00+02:00").toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const style = getClusterStyle(post.slug);

  return (
    <Link href={`/blog/${post.slug}`} className="card block hover:ring-2 hover:ring-[var(--accent-orange)] transition-all no-underline overflow-hidden">
      <article className="flex gap-4">
        {/* Cluster color bar */}
        <div
          className="w-2 shrink-0 rounded-full"
          style={{ background: style.accent }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--text-secondary)] mb-1">
            <span className="mr-1">{style.emoji}</span>
            {date}
          </p>
          <h2 className="font-bold text-lg mb-2">{post.title}</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
