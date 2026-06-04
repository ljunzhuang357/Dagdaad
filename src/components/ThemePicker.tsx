"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "warm", label: "Warm", emoji: "☀️" },
  { id: "forest", label: "Forest", emoji: "🌿" },
  { id: "ocean", label: "Ocean", emoji: "🌊" },
] as const;

const STORAGE_KEY = "dagdaad_theme";

export default function ThemePicker() {
  const [theme, setTheme] = useState("warm");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || "warm";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const pick = (id: string) => {
    setTheme(id);
    localStorage.setItem(STORAGE_KEY, id);
    document.documentElement.setAttribute("data-theme", id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost text-sm min-h-[44px] flex items-center gap-1 cursor-pointer"
        title="Thema"
      >
        {THEMES.find((t) => t.id === theme)?.emoji || "☀️"}
        <span className="hidden md:inline text-xs">Thema</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-[#E8E0D0] p-2 z-50 min-w-[140px]">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  theme === t.id
                    ? "bg-[var(--accent-orange)]/10 font-semibold"
                    : "hover:bg-[#F5F0E8]"
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
                {theme === t.id && <span className="ml-auto text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
