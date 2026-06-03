import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schrijf je goede daad",
  description:
    "Noteer wat je vandaag voor een ander hebt gedaan. Een klein gebaar, een luisterend oor, een verrassing — alles telt. Houd je vriendelijkheids-dagboek bij.",
  openGraph: {
    title: "Schrijf je goede daad | Dagdaad",
    description:
      "Noteer wat je vandaag voor een ander hebt gedaan. Houd je dagelijkse goede daad bij.",
  },
  alternates: { canonical: "https://dagdaad.nl/write" },
};

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
