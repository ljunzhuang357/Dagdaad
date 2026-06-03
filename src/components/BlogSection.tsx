import Link from "next/link";
import postsData from "@/data/blog-summary.json";
import { getClusterStyle } from "@/lib/cluster";

// We only need minimal content for cluster detection
const recentPosts = (postsData as {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}[])
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);

export default function BlogSection() {
  if (recentPosts.length === 0) return null;

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">
        Van onze blog 📖
      </h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {recentPosts.map((post) => {
          const style = getClusterStyle(post.slug);
          const date = new Date(post.date + "T00:00:00+02:00").toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card no-underline hover:ring-2 hover:ring-[var(--accent-orange)] transition-all overflow-hidden"
            >
              {/* Color header */}
              <div
                className="h-24 flex items-center justify-center text-4xl"
                style={{ background: style.gradient }}
              >
                {style.emoji}
              </div>
              <article className="p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-2">{date}</p>
                <h3 className="font-bold mb-2 text-base">{post.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-6">
        <Link
          href="/blog"
          className="text-sm text-[var(--text-secondary)] underline hover:text-[var(--text-primary)] transition-colors"
        >
          Alle artikelen →
        </Link>
      </div>
    </section>
  );
}
