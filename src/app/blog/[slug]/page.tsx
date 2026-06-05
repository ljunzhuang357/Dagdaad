import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { getClusterStyle } from "@/lib/cluster";
import BlogContent from "@/components/BlogContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | Dagdaad`,
      description: post.description,
      url: `https://dagdaad.nl/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date + "T00:00:00+02:00",
      tags: post.tags,
    },
    alternates: {
      canonical: `https://dagdaad.nl/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 2);

  const cluster = getClusterStyle(slug);
  const date = new Date(post.date + "T00:00:00+02:00").toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://dagdaad.nl/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date + "T00:00:00+02:00",
        author: {
          "@type": "Organization",
          name: "Dagdaad",
          url: "https://dagdaad.nl",
        },
        publisher: {
          "@type": "Organization",
          name: "Dagdaad",
          url: "https://dagdaad.nl",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://dagdaad.nl/blog/${post.slug}`,
        },
        image: {
          "@type": "ImageObject",
          url: `https://dagdaad.nl/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://dagdaad.nl/blog/${post.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://dagdaad.nl" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://dagdaad.nl/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://dagdaad.nl/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 px-6 py-12 max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1 mb-8"
        >
          ← Blog
        </Link>

        {/* Hero image */}
        <div
          className="rounded-2xl mb-8 flex flex-col items-center justify-center text-center px-6 py-16"
          style={{ background: cluster.gradient }}
        >
          <span className="text-5xl mb-4 block">{cluster.emoji}</span>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3 max-w-lg">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{date}</p>
        </div>

        <article>

          <div className="text-[var(--text-primary)] leading-relaxed">
            <BlogContent content={post.content} />
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl text-center" style={{ background: "var(--gradient-hero)" }}>
          <p className="text-lg font-bold mb-2">
            Begin vandaag met 1 goede daad per dag
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Noteer elke dag wat je voor een ander hebt gedaan. Gratis, eenvoudig, wetenschappelijk onderbouwd.
          </p>
          <Link
            href="/"
            className="btn-primary inline-block text-base"
          >
            Probeer Dagdaad gratis →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold mb-4">Verder lezen</h2>
            <div className="space-y-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card block no-underline hover:ring-2 hover:ring-[var(--accent-orange)] transition-all"
                >
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm text-[var(--text-secondary)] underline hover:text-[var(--text-primary)] transition-colors"
          >
            ← Alle artikelen
          </Link>
        </div>
      </main>
    </>
  );
}
