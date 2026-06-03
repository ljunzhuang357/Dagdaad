"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  useEffect(() => {
    const m = `${year}-${String(month + 1).padStart(2, "0")}`;
    setLoading(true);
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
          // deed_date 格式 "2026-06-02"，直接取日期数字，避免时区问题
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
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const entry = selectedDay ? entries[selectedDay] : null;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <button
          onClick={prevMonth}
          className="btn-ghost text-lg cursor-pointer"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">
          {MONTHS_NL[month]} {year}
        </h1>
        <button
          onClick={nextMonth}
          className="btn-ghost text-lg cursor-pointer"
        >
          →
        </button>
      </div>

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

      <Link href="/write" className="btn-primary mt-8">
        {t("cta")}
      </Link>
    </div>
  );
}
