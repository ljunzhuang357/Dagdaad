"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PricingModal from "@/components/PricingModal";

export default function KalenderPage() {
  const t = useTranslations("calendar");
  const MONTHS_NL = t.raw("months") as string[];
  const DAYS_NL = t.raw("days") as string[];

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState<
    Record<number, { emoji?: string; text: string }>
  >({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [quota, setQuota] = useState<{
    isPro: boolean;
    monthlyUsed: number;
    monthlyLimit: number;
  } | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const touchStartX = useRef(0);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();
  const isFreeAndPastMonth = quota && !quota.isPro && !isCurrentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  useEffect(() => {
    fetch("/api/quota")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setQuota(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const m = `${year}-${String(month + 1).padStart(2, "0")}`;
    setLoading(true);
    setSelectedDay(null);
    fetch(`/api/deeds?month=${m}&limit=31`)
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        const map: Record<number, { text: string }> = {};
        (data.deeds || []).forEach((d: any) => {
          const day = parseInt(d.deedDate.split("-")[2], 10);
          map[day] = {
            text: d.description,
            ...(d.mood ? { emoji: d.mood } : {}),
          };
        });
        setEntries(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const entry = selectedDay ? entries[selectedDay] : null;

  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-16 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <button
          onClick={prevMonth}
          disabled={!!isFreeAndPastMonth}
          className="btn-ghost text-lg cursor-pointer disabled:opacity-20"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">
          {MONTHS_NL[month]} {year}
        </h1>
        <button
          onClick={nextMonth}
          disabled={!!isFreeAndPastMonth}
          className="btn-ghost text-lg cursor-pointer disabled:opacity-20"
        >
          →
        </button>
      </div>

      {isFreeAndPastMonth ? (
        <div className="text-center py-16 px-6 w-full">
          <span className="text-5xl block mb-4">⭐</span>
          <h2 className="text-xl font-bold mb-3">
            Alleen huidige maand
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xs mx-auto">
            Word Pro om alle maanden terug te kijken.
          </p>
          <button
            onClick={() => setShowPricing(true)}
            className="btn-primary inline-block cursor-pointer"
          >
            Upgrade naar Pro
          </button>
        </div>
      ) : (
        <>
          {quota && !quota.isPro && (
            <p className="text-xs text-[var(--text-secondary)] mb-2 self-start">
              Alleen huidige maand zichtbaar
            </p>
          )}

          <div
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const diffX = e.changedTouches[0].clientX - touchStartX.current;
              // 50px threshold — taps won't trigger, only intentional swipes
              if (Math.abs(diffX) > 50) {
                if (diffX > 0) prevMonth();
                else nextMonth();
              }
            }}
          >
            <div className="grid grid-cols-7 w-full mb-2">
              {DAYS_NL.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs text-[var(--text-secondary)] py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 w-full gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasEntry = !!entries[day];
                const isSelected = selectedDay === day;
                const isToday =
                  day === now.getDate() &&
                  month === now.getMonth() &&
                  year === now.getFullYear();
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all cursor-pointer
                      ${isSelected ? "ring-2 ring-[var(--accent-orange)] bg-[#FFF0E0]" : ""}
                      ${hasEntry && !isSelected ? "bg-[#FFE0B2]" : ""}
                      ${!hasEntry && !isSelected ? "hover:bg-[#F5F0E8]" : ""}`}
                  >
                    <span
                      className={
                        isToday ? "font-bold text-[var(--accent-orange)]" : ""
                      }
                    >
                      {day}
                    </span>
                    {hasEntry && (
                      <span className="text-[10px] leading-none mt-0.5">
                        {entries[day].emoji || "●"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {loading && (
            <div className="w-full mt-4 space-y-2">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-[#E8E0D0] animate-pulse" />
                ))}
              </div>
            </div>
          )}

          {entry && (
            <div className="card w-full mt-6 text-center">
              <span className="text-3xl block mb-2">{entry.emoji || "🌟"}</span>
              <p className="font-medium">&ldquo;{entry.text}&rdquo;</p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {selectedDay} {MONTHS_NL[month]} {year}
              </p>
            </div>
          )}

          {!entry && selectedDay && (
            <div className="card w-full mt-6 text-center">
              <span className="text-3xl block mb-2">🌸</span>
              <p className="text-sm text-[var(--text-secondary)]">{t("empty")}</p>
            </div>
          )}
        </>
      )}

      <Link href="/write" className="btn-primary mt-8">
        {t("cta")}
      </Link>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}
