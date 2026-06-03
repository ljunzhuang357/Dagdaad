import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inloggen",
  description:
    "Log in bij Dagdaad en begin met het noteren van je dagelijkse goede daad. Gratis account.",
  robots: { index: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
