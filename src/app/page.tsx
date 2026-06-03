"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  const t = useTranslations("home");
  const steps = t.raw("steps") as {
    emoji: string;
    title: string;
    desc: string;
  }[];
  const freeFeatures = t.raw("pricing.free.features") as string[];
  const proFeatures = t.raw("pricing.pro.features") as string[];

  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section
          className="text-center px-6 pt-20 pb-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="max-w-2xl mx-auto">
            <span className="text-5xl mb-6 block" aria-hidden="true">{t("heroEmoji")}</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
              })}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              {t("subtitle")}
            </p>
            <Link href="/write" className="btn-primary text-lg inline-block">
              {t("cta")}
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-4 text-2xl opacity-60 flex-wrap" aria-hidden="true">
            <span>☕</span> <span>🌻</span> <span>🎈</span> <span>🍪</span>
            <span>🌈</span> <span>🦋</span> <span>🎵</span> <span>🌿</span>
          </div>
        </section>

        {/* Hoe het werkt */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            {t("howItWorks")}
          </h2>
          <div className="flex flex-col gap-4">
            {steps.map((item, i) => (
              <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <span className="text-2xl mt-0.5 shrink-0" aria-hidden="true">{item.emoji}</span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-orange)]">
                    {t("stepLabel", { n: i + 1 })}
                  </span>
                  <h3 className="font-bold text-base mt-0.5">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">{t("pricing.title")}</h2>
            <p className="text-[var(--text-secondary)] mb-10 max-w-md mx-auto">
              {t("pricing.subtitle")}
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="card border-2 border-[var(--accent-orange)]/30 relative">
                <span className="absolute -top-3 -right-3 bg-[var(--accent-orange)] text-white text-sm px-3 py-1 rounded-full font-bold">
                  🌟 {t("pricing.free.badge")}
                </span>
                <p className="text-3xl font-bold mb-1">
                  {t("pricing.free.price")}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {t("pricing.free.period")}
                </p>
                <ul className="space-y-2 text-sm">
                  {freeFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="card border-2 border-[var(--accent-orange)] relative">
                <span className="absolute -top-3 -right-3 bg-[var(--accent-orange)] text-white text-sm px-3 py-1 rounded-full font-bold">
                  ⭐ {t("pricing.pro.badge")}
                </span>
                <p className="text-3xl font-bold mb-1">
                  {t("pricing.pro.price")}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {t("pricing.pro.period")}
                </p>
                <ul className="space-y-2 text-sm">
                  {proFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-6">
              {t("pricing.footnote")}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {(t.raw("faq.items") as { q: string; a: string }[]).map(
              (item, i) => (
                <details
                  key={i}
                  className="card cursor-pointer group open:ring-2 open:ring-[var(--accent-orange)]"
                >
                  <summary className="font-semibold text-base list-none flex items-center justify-between py-1 cursor-pointer">
                    {item.q}
                    <span className="text-lg transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              )
            )}
          </div>
        </section>

        {/* Blog preview */}
        <BlogSection />

        {/* Footer */}
        <footer className="text-center text-sm text-[var(--text-secondary)] py-8 px-6">
          <p>{t("footer.line1")}</p>
          <p className="mt-1">{t("footer.line2")}</p>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <Link href="/blog" className="underline hover:text-[var(--text-primary)]">
              Blog
            </Link>
            <Link href="/privacy" className="underline hover:text-[var(--text-primary)]">
              Privacy
            </Link>
            <Link href="/terms" className="underline hover:text-[var(--text-primary)]">
              Voorwaarden
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
