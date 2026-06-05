import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ontdek hoe kleine goede daden je gelukkiger maken. Praktische tips over dankbaarheid, vriendelijkheid en positiviteit — vanuit wetenschappelijk perspectief.",
  openGraph: {
    title: "Blog | Dagdaad",
    description:
      "Ontdek hoe kleine goede daden je gelukkiger maken. Praktische artikelen over positiviteit en verbinding.",
    url: "https://dagdaad.nl/blog",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Dagdaad blog",
      },
    ],
  },
  alternates: {
    canonical: "https://dagdaad.nl/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "Blog"],
    "@id": "https://dagdaad.nl/blog",
    name: "Blog | Dagdaad",
    description:
      "Artikelen over vriendelijkheid, positiviteit en de wetenschap van goede daden.",
    publisher: { "@id": "https://dagdaad.nl/#organization" },
    url: "https://dagdaad.nl/blog",
    inLanguage: "nl",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://dagdaad.nl/blog/${p.slug}`,
      datePublished: p.date + "T00:00:00+02:00",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main className="flex-1 px-6 py-12 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Artikelen over vriendelijkheid, positiviteit en de wetenschap van goede daden.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-center py-12">
          Nog geen artikelen. Kom later terug!
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/" className="text-sm text-[var(--text-secondary)] underline hover:text-[var(--text-primary)] transition-colors">
          ← Terug naar Dagdaad
        </Link>
      </div>
    </main>
    </>
  );
}
