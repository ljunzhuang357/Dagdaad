"use client";

import { useTranslations } from "next-intl";

export default function UpgradePrompt({
  monthlyUsed,
  monthlyLimit,
}: {
  monthlyUsed?: number;
  monthlyLimit?: number;
}) {
  const t = useTranslations("home");

  return (
    <div className="text-center py-16 px-6">
      <span className="text-5xl block mb-4">⭐</span>
      <h2 className="text-2xl font-bold mb-3">
        {t("pricing.pro.badge")} functie
      </h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
        {monthlyLimit && monthlyUsed !== undefined && monthlyUsed >= monthlyLimit
          ? "Je hebt deze maand je gratis limiet bereikt."
          : "Word Pro om toegang te krijgen tot deze functie."}
      </p>
      {monthlyUsed !== undefined && monthlyLimit && monthlyLimit !== Infinity && (
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {monthlyUsed}/{monthlyLimit} deze maand gebruikt
        </p>
      )}
      <a href="/login" className="btn-primary inline-block">
        Upgrade naar Pro
      </a>
    </div>
  );
}
