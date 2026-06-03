import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const base = "https://dagdaad.nl";
const lastmod = "2026-06-02";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: base, lastmod },
    { url: `${base}/write`, lastmod },
    { url: `${base}/calendar`, lastmod },
    { url: `${base}/stats`, lastmod },
    { url: `${base}/privacy`, lastmod },
    { url: `${base}/terms`, lastmod },
    { url: `${base}/blog`, lastmod: "2026-06-03" },
  ];

  const blogPosts = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastmod: p.date,
  }));

  return [...pages, ...blogPosts];
}
