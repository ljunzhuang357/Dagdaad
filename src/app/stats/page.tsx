"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PricingModal from "@/components/PricingModal";

export default function StatsPage() {
  const t = useTranslations("stats");
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    recent: [] as { emoji?: string; text: string; date: string }[],
  });
  const [quota, setQuota] = useState<{
    isPro: boolean;
    monthlyUsed: number;
    monthlyLimit: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [referral, setReferral] = useState<{ code: string; url: string; redemptions: number } | null>(null);

  useEffect(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);

    Promise.all([
      fetch(`/api/deeds?limit=999`).then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      }),
      fetch("/api/quota").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/referral/code").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([data, quotaData, refData]) => {
        if (!data) return;
        if (quotaData) setQuota(quotaData);
        if (refData) setReferral(refData);

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
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-16 max-w-lg mx-auto w-full">
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
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        {quota?.isPro && (
          <span className="text-xs bg-[var(--accent-orange)] text-white px-2 py-0.5 rounded-full font-semibold">
            Pro
          </span>
        )}
      </div>

      {quota && !quota.isPro && (
        <div className="w-full mb-6 text-xs text-[var(--text-secondary)] text-center">
          Je ziet alleen de huidige maand.{" "}
          <a href="/" className="text-[var(--accent-orange)] underline">
            Upgrade naar Pro
          </a>{" "}
          voor het volledige overzicht.
        </div>
      )}

      <div className="card w-full mb-6 text-center">
        <p className="text-[var(--text-secondary)] text-sm">{t("totalLabel")}</p>
        <p className="text-5xl font-bold text-[var(--accent-orange)] mt-1">
          {quota?.isPro ? stats.total : stats.thisMonth}
        </p>
        {stats.thisMonth > 0 && (
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {t("thisMonth", { n: stats.thisMonth })}
          </p>
        )}
        {quota?.isPro && stats.total > stats.thisMonth && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {stats.total} totaal
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

      {/* Pro features */}
      <div className="w-full mb-6 card print:shadow-none">
        <h2 className="font-bold mb-3">Pro functies</h2>
        <div className="flex flex-wrap gap-2">
          {quota?.isPro ? (
            <>
              <Link href="/jaaroverzicht" className="btn-primary text-sm">
                📊 Jaaroverzicht
              </Link>
              <a
                href="/api/export/csv"
                download
                className="btn-ghost border border-[#E8E0D0] text-sm cursor-pointer"
              >
                📥 CSV exporteren
              </a>
              <a
                href="/api/export/json"
                download
                className="btn-ghost border border-[#E8E0D0] text-sm cursor-pointer"
              >
                📥 JSON exporteren
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowPricing(true)}
                className="btn-primary text-sm cursor-pointer"
              >
                📊 Jaaroverzicht
              </button>
              <button
                onClick={() => setShowPricing(true)}
                className="btn-ghost border border-[#E8E0D0] text-sm cursor-pointer"
              >
                📥 CSV exporteren
              </button>
              <button
                onClick={() => setShowPricing(true)}
                className="btn-ghost border border-[#E8E0D0] text-sm cursor-pointer"
              >
                📥 JSON exporteren
              </button>
            </>
          )}
        </div>
      </div>

      {/* Referral section */}
      <div className="w-full mb-6 card print:shadow-none">
        <h2 className="font-bold mb-3">👥 Nodig vrienden uit</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Nodig een vriend uit en jullie krijgen allebei <strong>+5 goede daden</strong> extra per maand!
        </p>
        {referral ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-[#F5F0E8] rounded-xl px-3 py-2">
              <input
                readOnly
                value={referral.url}
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: "Dagdaad",
                        text: "Doe ook mee met Dagdaad — noteer elke dag een goede daad! 🌟",
                        url: referral.url,
                      });
                    } catch {
                      /* user cancelled */
                    }
                  } else {
                    navigator.clipboard.writeText(referral.url);
                  }
                }}
                className="btn-ghost border border-[#E8E0D0] text-xs shrink-0 cursor-pointer"
              >
                📱 Deel
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referral.url);
                }}
                className="btn-primary text-xs shrink-0 cursor-pointer"
              >
                Kopiëren
              </button>
            </div>
            {referral.redemptions > 0 && (
              <p className="text-xs text-[var(--accent-orange)]">
                {referral.redemptions} vriend{referral.redemptions !== 1 ? "en" : ""} uitgenodigd — +{referral.redemptions * 5} extra!
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)]">
            Log in om je uitnodigingslink te zien
          </p>
        )}
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/write" className="btn-primary">
          {t("ctaWrite")}
        </Link>
        <Link href="/calendar" className="btn-ghost border border-[#E8E0D0]">
          {t("ctaCalendar")}
        </Link>
      </div>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}
