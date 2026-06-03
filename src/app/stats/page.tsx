"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function StatsPage() {
  const t = useTranslations("stats");
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    recent: [] as { emoji?: string; text: string; date: string }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);

    fetch(`/api/deeds?limit=999`)
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        const all = data.deeds || [];
        const month = all.filter(
          (d: any) => d.deedDate && d.deedDate.startsWith(thisMonth)
        );
        const recent = all.slice(0, 5).map((d: any) => ({
          emoji: d.mood || undefined,
          text: d.description,
          date: d.deedDate,
        }));
        setStats({ total: all.length, thisMonth: month.length, recent });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
        <div className="w-48 h-7 rounded-lg bg-[#E8E0D0] animate-pulse mb-8" />
        <div className="card w-full mb-6 text-center">
          <div className="w-24 h-4 mx-auto rounded bg-[#E8E0D0] animate-pulse mb-3" />
          <div className="w-16 h-10 mx-auto rounded bg-[#E8E0D0] animate-pulse" />
        </div>
        <div className="w-full space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-16 bg-[#E8E0D0] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>

      <div className="card w-full mb-6 text-center">
        <p className="text-[var(--text-secondary)] text-sm">{t("totalLabel")}</p>
        <p className="text-5xl font-bold text-[var(--accent-orange)] mt-1">{stats.total}</p>
        {stats.thisMonth > 0 && (
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {t("thisMonth", { n: stats.thisMonth })}
          </p>
        )}
      </div>

      {stats.recent.length >= 7 && (
        <div className="w-full mb-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">{t("rhythm")}</h2>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(stats.recent.length, 14) }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 rounded-lg"
                style={{
                  background: `linear-gradient(180deg, var(--accent-orange) 0%, var(--accent-pink) 100%)`,
                  opacity: Math.max(0.3, 1 - i * 0.05),
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="w-full mb-8">
        <h2 className="font-bold mb-3">{t("recentTitle")}</h2>
        <div className="space-y-2">
          {stats.recent.length === 0 && (
            <div className="card text-center py-8">
              <span className="text-3xl block mb-2">🌱</span>
              <p className="text-sm text-[var(--text-secondary)]">
                {t("empty")}
              </p>
            </div>
          )}
          {stats.recent.map((e, i) => (
            <div key={i} className="card flex items-center gap-3 py-3">
              <span className="text-xl">{e.emoji || "🌟"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{e.text}</p>
                <p className="text-xs text-[var(--text-secondary)]">{e.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/write" className="btn-primary">
          {t("ctaWrite")}
        </Link>
        <Link href="/calendar" className="btn-ghost border border-[#E8E0D0]">
          {t("ctaCalendar")}
        </Link>
      </div>
    </div>
  );
}
