import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender — goede daden",
  description:
    "Bekijk je maandelijkse spoor van vriendelijkheid. Elke dag een vakje — zie jouw goede daden in één oogopslag.",
  robots: { index: false },
  openGraph: {
    title: "Kalender — goede daden | Dagdaad",
    description:
      "Bekijk je maandelijkse overzicht van goede daden. Elke dag een vakje.",
  },
  alternates: { canonical: "https://dagdaad.nl/calendar" },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
