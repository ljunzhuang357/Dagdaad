"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type MoodEmoji =
  | "😊"
  | "🙏"
  | "😌"
  | "🎉"
  | "💪"
  | "🥰"
  | "🤔"
  | "😅"
  | "🧘";

const PENDING_KEY = "dagdaad_pending";

export default function SchrijvenPage() {
  const t = useTranslations("write");
  const moods = t.raw("moods") as { emoji: MoodEmoji; label: string }[];
  const impacts = t.raw("impacts") as string[];

  const [step, setStep] = useState(0);
  const [goodThing, setGoodThing] = useState("");
  const [mood, setMood] = useState<MoodEmoji | null>(null);
  const [impact, setImpact] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const restored = useRef(false);

  // 登录后恢复未保存的数据并自动提交
  useEffect(() => {
    if (restored.current) return;
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    restored.current = true;
    localStorage.removeItem(PENDING_KEY);

    try {
      const data = JSON.parse(raw);
      if (!data.description || !data.mood || !data.impact) return;

      // 先恢复表单状态
      setGoodThing(data.description);
      setMood(data.mood);
      setImpact(data.impact);
      setStep(2);

      // state 稳定后自动保存
      setTimeout(async () => {
        setSaving(true);
        setError("");
        try {
          const res = await fetch("/api/deeds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description: data.description,
              mood: data.mood,
              impact: data.impact,
            }),
          });
          if (!res.ok) {
            if (res.status === 401) {
              // 仍然未登录——再存回去，跳到登录页
              localStorage.setItem(PENDING_KEY, raw);
              window.location.href = "/login";
              return;
            }
            const errData = await res.json();
            throw new Error(errData.error || t("error"));
          }
          setSaved(true);
        } catch (e: any) {
          setError(e.message || t("error"));
        }
        setSaving(false);
      }, 100);
    } catch {
      /* JSON 解析失败就跳过 */
    }
  }, [t]);

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
        if (res.status === 401) {
          // 未登录→暂存数据→跳到登录页
          localStorage.setItem(
            PENDING_KEY,
            JSON.stringify({ description: goodThing, mood, impact })
          );
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        throw new Error(data.error || t("error"));
      }
      setSaved(true);
    } catch (e: any) {
      setError(e.message || t("error"));
    }
    setSaving(false);
  };

  if (saved) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <span className="text-6xl block mb-6">🌟</span>
          <h1 className="text-3xl font-bold mb-3">{t("savedTitle")}</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {t("savedSubtitle")}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/write" className="btn-primary">
              {t("writeAnother")}
            </Link>
            <Link
              href="/calendar"
              className="btn-ghost border border-[#E8E0D0]"
            >
              {t("viewCalendar")}
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
          <span className="text-4xl mb-4">{t("step0.emoji")}</span>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("step0.title")}
          </h2>
          <textarea
            className="input-field min-h-[140px] resize-none"
            placeholder={t("step0.placeholder")}
            value={goodThing}
            onChange={(e) => setGoodThing(e.target.value)}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2 self-start">
            {t("charCount", { count: goodThing.length })}
          </p>
          <button
            onClick={() => setStep(1)}
            disabled={!goodThing.trim()}
            className="btn-primary mt-6 disabled:opacity-40"
          >
            {t("next")}
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <span className="text-4xl mb-4">{t("step1.emoji")}</span>
          <h2 className="text-2xl font-bold mb-2 text-center">
            {t("step1.title")}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 text-center">
            {t("step1.subtitle")}
          </p>
          <div className="grid grid-cols-3 gap-3 w-full">
            {moods.map((m) => (
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
              {t("back")}
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!mood}
              className="btn-primary disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <span className="text-4xl mb-4">{t("step2.emoji")}</span>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("step2.title")}
          </h2>
          <div className="w-full space-y-3">
            {impacts.map((opt) => (
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
              placeholder={t("step2.placeholder")}
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost">
              {t("back")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !impact}
              className="btn-primary disabled:opacity-40"
            >
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
