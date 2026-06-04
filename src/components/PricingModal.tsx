"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

export default function PricingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("home");
  const [checking, setChecking] = useState(false);
  if (!open) return null;

  const freeFeatures = t.raw("pricing.free.features") as string[];
  const proFeatures = t.raw("pricing.pro.features") as string[];

  const handleProClick = async () => {
    setChecking(true);
    try {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch("/api/creem/checkout", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Er ging iets mis");
        return;
      }
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      alert("Er ging iets mis");
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-[var(--bg-warm)] rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t("pricing.title")}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#E8E0D0] flex items-center justify-center text-sm cursor-pointer hover:bg-[#D8D0C0] transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {/* Free card */}
            <div className="card border-2 border-[var(--accent-orange)]/30 relative">
              <span className="absolute -top-3 -right-3 bg-[var(--accent-orange)] text-white text-sm px-3 py-1 rounded-full font-bold">
                🌟 {t("pricing.free.badge")}
              </span>
              <p className="text-3xl font-bold mb-1">{t("pricing.free.price")}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {t("pricing.free.period")}
              </p>
              <ul className="space-y-2 text-sm">
                {freeFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Pro card */}
            <button
              onClick={handleProClick}
              disabled={checking}
              className="card border-2 border-[var(--accent-orange)] relative text-left cursor-pointer hover:shadow-lg transition-shadow disabled:opacity-60"
            >
              <span className="absolute -top-3 -right-3 bg-[var(--accent-orange)] text-white text-sm px-3 py-1 rounded-full font-bold">
                ⭐ {t("pricing.pro.badge")}
              </span>
              <p className="text-3xl font-bold mb-1">{t("pricing.pro.price")}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {t("pricing.pro.period")}
              </p>
              <ul className="space-y-2 text-sm">
                {proFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-semibold text-[var(--accent-orange)]">
                {checking ? "Bezig..." : "Abonneren →"}
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.2s ease-out; }
      `}</style>
    </>
  );
}
