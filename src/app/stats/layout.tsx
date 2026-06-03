import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistieken — overzicht",
  description:
    "Zie je statistieken en patronen: totaal aantal goede daden, maandelijkse streak, meest gekozen impact. Ontdek je eigen vriendelijkheids-patronen.",
  openGraph: {
    title: "Statistieken — overzicht | Dagdaad",
    description:
      "Zie je statistieken en patronen: totaal aantal goede daden, streaks, impact.",
  },
  alternates: { canonical: "https://dagdaad.nl/stats" },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
