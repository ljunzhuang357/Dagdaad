"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PricingModal from "@/components/PricingModal";

const MOODS_NL: Record<string, string> = {
  "😊": "Blij",
  "🙏": "Dankbaar",
  "😌": "Kalm",
  "🎉": "Feestelijk",
  "💪": "Krachtig",
  "🥰": "Liefdevol",
  "🤔": "Bedachtzaam",
  "😅": "Opgelucht",
  "🧘": "Meditatief",
};

export default function JaaroverzichtPage() {
  const t = useTranslations("stats");
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<{
    year: number;
    total: number;
    byMonth: { month: number; count: number }[];
    byMood: { mood: string; count: number }[];
    byImpact: { impact: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/stats/yearly?year=${year}`)
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        if (r.status === 403) {
          setError("Alleen voor Pro-leden");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => setError("Er ging iets mis"))
      .finally(() => setLoading(false));
  }, [year]);

  const MONTHS = [
    "Jan", "Feb", "Maa", "Apr", "Mei", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec",
  ];

  const maxMonth = Math.max(...(data?.byMonth.map((m) => m.count) || [1]), 1);

  // Show pricing modal for Pro-gated access
  useEffect(() => {
    if (error === "Alleen voor Pro-leden") {
      setShowPricing(true);
      setError("");
    }
  }, [error]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
        <span className="text-5xl block mb-4">⭐</span>
        <h2 className="text-2xl font-bold mb-3">Jaaroverzicht</h2>
        <p className="text-[var(--text-secondary)] mb-6">{error}</p>
        <button
          onClick={() => setShowPricing(true)}
          className="btn-primary cursor-pointer"
        >
          Upgrade naar Pro
        </button>
        <PricingModal
          open={showPricing}
          onClose={() => setShowPricing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pt-8 pb-16 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold">Jaaroverzicht</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Een jaar van goede daden
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="btn-ghost text-lg cursor-pointer"
            disabled={year <= 2025}
          >
            ←
          </button>
          <span className="text-xl font-bold min-w-[70px] text-center">{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="btn-ghost text-lg cursor-pointer"
            disabled={year >= new Date().getFullYear()}
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-2xl bg-[#E8E0D0] animate-pulse" />
          <div className="h-48 rounded-2xl bg-[#E8E0D0] animate-pulse" />
          <div className="h-32 rounded-2xl bg-[#E8E0D0] animate-pulse" />
        </div>
      ) : data ? (
        <>
          {/* Total */}
          <div className="card text-center mb-6 print:shadow-none print:border print:border-[#E8E0D0]">
            <p className="text-sm text-[var(--text-secondary)]">
              Goede daden in {data.year}
            </p>
            <p className="text-6xl font-bold text-[var(--accent-orange)] mt-2">
              {data.total}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              ~{Math.round(data.total / 12)} per maand
            </p>
          </div>

          {/* Monthly chart */}
          <div className="card mb-6 print:shadow-none print:border print:border-[#E8E0D0]">
            <h2 className="font-bold mb-4">Per maand</h2>
            <div className="flex items-end gap-1.5 h-32">
              {MONTHS.map((name, i) => {
                const m = data.byMonth.find((b) => b.month === i + 1);
                const count = m?.count || 0;
                const height = Math.max((count / maxMonth) * 100, count > 0 ? 8 : 0);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                      {count || ""}
                    </span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${height}%`,
                        background:
                          "linear-gradient(180deg, var(--accent-orange), var(--accent-pink))",
                        minHeight: count > 0 ? "4px" : "0",
                      }}
                    />
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood breakdown */}
          {data.byMood.length > 0 && (
            <div className="card mb-6 print:shadow-none print:border print:border-[#E8E0D0]">
              <h2 className="font-bold mb-4">Hoe voelde het</h2>
              <div className="space-y-2">
                {data.byMood.slice(0, 6).map((m) => {
                  const pct = Math.round((m.count / data.total) * 100);
                  return (
                    <div key={m.mood} className="flex items-center gap-3">
                      <span className="text-lg w-8 text-center">{m.mood}</span>
                      <span className="text-xs text-[var(--text-secondary)] w-16 shrink-0">
                        {MOODS_NL[m.mood] || m.mood}
                      </span>
                      <div className="flex-1 h-4 rounded-full bg-[#F5F0E8] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, var(--accent-orange), var(--accent-pink))",
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] w-8 text-right">
                        {m.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Impact breakdown */}
          {data.byImpact.length > 0 && (
            <div className="card mb-6 print:shadow-none print:border print:border-[#E8E0D0]">
              <h2 className="font-bold mb-4">Impact</h2>
              <div className="space-y-2">
                {data.byImpact.map((i) => (
                  <div key={i.impact} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "var(--accent-orange)" }}
                    />
                    <span className="flex-1 truncate">{i.impact}</span>
                    <span className="text-[var(--text-secondary)]">{i.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print button + export links */}
          <div className="flex gap-3 justify-center flex-wrap print:hidden">
            <button
              onClick={() => window.print()}
              className="btn-primary"
            >
              🖨️ Opslaan als PDF
            </button>
            <Link href="/stats" className="btn-ghost border border-[#E8E0D0]">
              ← Statistieken
            </Link>
          </div>
        </>
      ) : null}

      {/* Print styles */}
      <style>{`
        @media print {
          nav, .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}
