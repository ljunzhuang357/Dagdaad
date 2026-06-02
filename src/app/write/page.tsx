"use client";

import { useState } from "react";
import Link from "next/link";

type MoodEmoji = "😊" | "🙏" | "😌" | "🎉" | "💪" | "🥰" | "🤔" | "😅" | "🧘";

const moodOptions: { emoji: MoodEmoji; label: string }[] = [
  { emoji: "😊", label: "开心" },
  { emoji: "🥰", label: "有爱" },
  { emoji: "🙏", label: "感恩" },
  { emoji: "😌", label: "满足" },
  { emoji: "🎉", label: "雀跃" },
  { emoji: "💪", label: "自豪" },
  { emoji: "🤔", label: "若有所思" },
  { emoji: "😅", label: "松了一口气" },
  { emoji: "🧘", label: "平静" },
];

const impactOptions = [
  "让人家的今天变好了一点 ☀️",
  "感觉和世界有了连接 🤝",
  "给了我能量 ⚡",
  "对一件事有了新的看法 👀",
  "很小，但很暖 🌱",
];

export default function SchrijvenPage() {
  const [step, setStep] = useState(0);
  const [goodThing, setGoodThing] = useState("");
  const [mood, setMood] = useState<MoodEmoji | null>(null);
  const [impact, setImpact] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!goodThing.trim() || !mood || !impact) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/deeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: goodThing, mood, impact }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "保存失败");
      }
      setSaved(true);
    } catch (e: any) {
      setError(e.message || "保存失败");
    }
    setSaving(false);
  };

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <span className="text-6xl block mb-6">🌟</span>
          <h1 className="text-3xl font-bold mb-3">
            记下来了！
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            你的好事已经保存。明天再来一条新的！
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/write" className="btn-primary">
              再记一条 ✍️
            </Link>
            <Link href="/calendar" className="btn-ghost border border-[#E8E0D0]">
              看日历 📅
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12 max-w-lg mx-auto w-full">
      {/* Progress */}
      <div className="flex gap-2 mb-8 w-full">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= s ? "bg-[var(--accent-orange)]" : "bg-[#E8E0D0]"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <>
          <span className="text-4xl mb-4">✍️</span>
          <h2 className="text-2xl font-bold mb-6 text-center">
            今天你做了什么好事？
          </h2>
          <textarea
            className="input-field min-h-[140px] resize-none"
            placeholder="比如：帮同事倒了杯咖啡、给朋友发了条暖心的消息、打电话陪爸妈聊了会儿天……"
            value={goodThing}
            onChange={(e) => setGoodThing(e.target.value)}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2 self-start">
            {goodThing.length} 字
          </p>
          <button
            onClick={() => setStep(1)}
            disabled={!goodThing.trim()}
            className="btn-primary mt-6 disabled:opacity-40"
          >
            下一步 →
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <span className="text-4xl mb-4">💭</span>
          <h2 className="text-2xl font-bold mb-2 text-center">
            你感觉怎么样？
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 text-center">
            选一个，或者自己写
          </p>
          <div className="grid grid-cols-3 gap-3 w-full">
            {moodOptions.map((m) => (
              <button
                key={m.emoji}
                onClick={() => setMood(m.emoji)}
                className={`card text-center py-4 cursor-pointer ${
                  mood === m.emoji
                    ? "border-2 border-[var(--accent-orange)]"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl block">{m.emoji}</span>
                <span className="text-xs mt-1 block">{m.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(0)} className="btn-ghost">
              ← 上一步
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!mood}
              className="btn-primary disabled:opacity-40"
            >
              下一步 →
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <span className="text-4xl mb-4">🌱</span>
          <h2 className="text-2xl font-bold mb-6 text-center">
            这件事带来了什么影响？
          </h2>
          <div className="w-full space-y-3">
            {impactOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setImpact(opt)}
                className={`card w-full text-left cursor-pointer ${
                  impact === opt
                    ? "border-2 border-[var(--accent-orange)]"
                    : "border-2 border-transparent"
                }`}
              >
                {opt}
              </button>
            ))}
            <input
              className="input-field mt-2"
              placeholder="或者自己写一个影响……"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost">
              ← 上一步
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !impact}
              className="btn-primary disabled:opacity-40"
            >
              {saving ? "保存中…" : "保存 🌟"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
