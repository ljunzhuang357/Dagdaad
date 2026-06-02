"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StatsPage() {
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    recent: [] as { emoji?: string; text: string; date: string }[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/deeds?limit=999").then((r) => r.json()),
      fetch(`/api/deeds?month=${new Date().toISOString().slice(0, 7)}&limit=999`).then((r) => r.json()),
    ]).then(([allData, monthData]) => {
      const all = allData.deeds || [];
      const month = monthData.deeds || [];
      const recent = all.slice(0, 5).map((d: any) => ({
        emoji: d.mood || undefined,
        text: d.description,
        date: d.deed_date,
      }));
      setStats({ total: all.length, thisMonth: month.length, recent });
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold mb-8">📊 我的统计</h1>

      <div className="card text-center w-full mb-4">
        <span className="text-5xl font-bold gradient-text">{stats.total}</span>
        <p className="text-[var(--text-secondary)] mt-1">好事总数</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        <div className="card text-center">
          <span className="text-2xl font-bold">{stats.thisMonth}</span>
          <p className="text-xs text-[var(--text-secondary)]">本月</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl font-bold">🔥 —</span>
          <p className="text-xs text-[var(--text-secondary)]">当前连续（天）</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl font-bold">🏆 —</span>
          <p className="text-xs text-[var(--text-secondary)]">最长连续</p>
        </div>
        <div className="card text-center">
          <span className="text-2xl font-bold">—</span>
          <p className="text-xs text-[var(--text-secondary)]">最常用</p>
        </div>
      </div>

      <div className="w-full mb-8">
        <h2 className="font-bold mb-3">最近的好事</h2>
        <div className="space-y-2">
          {stats.recent.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)] text-center py-4">还没有记录，开始写第一条吧 ✍️</p>
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
        <Link href="/write" className="btn-primary">记一条新的 ✍️</Link>
        <Link href="/calendar" className="btn-ghost border border-[#E8E0D0]">看日历 📅</Link>
      </div>
    </div>
  );
}
