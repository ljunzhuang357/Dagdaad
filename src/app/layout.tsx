import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Nav from "@/components/Nav";
import "./globals.css";
import nlMessages from "../../messages/nl.json";

export const metadata: Metadata = {
  title: "Dagdaad — elke dag een goede daad",
  description:
    "Noteer elke dag één goede daad die je voor iemand deed. Zie je eigen spoor van vriendelijkheid.",
  metadataBase: new URL("https://dagdaad.nl"),
  openGraph: {
    title: "Dagdaad",
    description: "Noteer elke dag één goede daad die je voor iemand deed.",
    siteName: "Dagdaad",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="nl" messages={nlMessages} timeZone="Europe/Amsterdam">
          <Nav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
