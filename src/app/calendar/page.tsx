"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MONTHS_CN = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];
const DAYS_CN = ["一", "二", "三", "四", "五", "六", "日"];

export default function KalenderPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [entries, setEntries] = useState<Record<number, { emoji?: string; text: string }>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  useEffect(() => {
    const m = `${year}-${String(month + 1).padStart(2, "0")}`;
    fetch(`/api/deeds?month=${m}&limit=31`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<number, { text: string }> = {};
        (data.deeds || []).forEach((d: any) => {
          const day = new Date(d.deed_date).getDate();
          map[day] = { text: d.description, ...(d.mood ? { emoji: d.mood } : {}) };
        });
        setEntries(map);
      });
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const entry = selectedDay ? entries[selectedDay] : null;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <button onClick={prevMonth} className="btn-ghost text-lg cursor-pointer">←</button>
        <h1 className="text-xl font-bold">{MONTHS_CN[month]} {year}</h1>
        <button onClick={nextMonth} className="btn-ghost text-lg cursor-pointer">→</button>
      </div>

      <div className="grid grid-cols-7 w-full mb-2">
        {DAYS_CN.map((d) => (
          <div key={d} className="text-center text-xs text-[var(--text-secondary)] py-1">{d}</div>
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
          const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all cursor-pointer
                ${isSelected ? "ring-2 ring-[var(--accent-orange)] bg-[#FFF0E0]" : ""}
                ${hasEntry && !isSelected ? "bg-[var(--gradient-card)]" : ""}
                ${!hasEntry && !isSelected ? "hover:bg-[#F5F0E8]" : ""}`}
            >
              <span className={isToday ? "font-bold text-[var(--accent-orange)]" : ""}>{day}</span>
              {hasEntry && <span className="text-xs">{entries[day].emoji || "🌟"}</span>}
            </button>
          );
        })}
      </div>

      {entry && (
        <div className="card w-full mt-6 text-center">
          <span className="text-3xl block mb-2">{entry.emoji || "🌟"}</span>
          <p className="font-medium">&quot;{entry.text}&quot;</p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">{selectedDay} {MONTHS_CN[month]} {year}</p>
        </div>
      )}

      {!entry && selectedDay && (
        <div className="card w-full mt-6 text-center text-[var(--text-secondary)]">
          <p>这天还没记过好事 📭</p>
        </div>
      )}

      <Link href="/write" className="btn-primary mt-8">记今天的好事 ✍️</Link>
    </div>
  );
}
