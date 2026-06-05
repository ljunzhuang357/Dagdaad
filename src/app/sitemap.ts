import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const base = "https://dagdaad.nl";
const today = new Date().toISOString().slice(0, 10);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: base, lastmod: today },
    { url: `${base}/write`, lastmod: today },
    { url: `${base}/calendar`, lastmod: today },
    { url: `${base}/stats`, lastmod: today },
    { url: `${base}/privacy`, lastmod: today },
    { url: `${base}/terms`, lastmod: today },
    { url: `${base}/blog`, lastmod: today },
  ];

  const blogPosts = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastmod: p.date,
  }));

  return [...pages, ...blogPosts];
}
