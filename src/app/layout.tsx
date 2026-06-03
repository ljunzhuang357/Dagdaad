import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Nav from "@/components/Nav";
import "./globals.css";
import nlMessages from "../../messages/nl.json";

export const metadata: Metadata = {
  title: {
    default: "Dagdaad — elke dag een goede daad",
    template: "%s | Dagdaad",
  },
  description:
    "Noteer elke dag één goede daad die je voor iemand deed. Zie je eigen spoor van vriendelijkheid. Dagelijks een klein gebaar, een luisterend oor, een verrassing — alles telt.",
  metadataBase: new URL("https://dagdaad.nl"),
  keywords: [
    "goede daad",
    "dagelijks noteren",
    "vriendelijkheid",
    "dankbaarheid",
    "dagboek",
    "Nederland",
    "goede daden",
    "positiviteit",
    "mindfulness",
  ],
  openGraph: {
    title: "Dagdaad — elke dag een goede daad",
    description:
      "Noteer elke dag één goede daad die je voor iemand deed. Zie je eigen spoor van vriendelijkheid.",
    url: "https://dagdaad.nl",
    siteName: "Dagdaad",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Dagdaad — elke dag een goede daad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dagdaad — elke dag een goede daad",
    description:
      "Noteer elke dag één goede daad die je voor iemand deed.",
    images: ["/og-default.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://dagdaad.nl",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dagdaad.nl/#organization",
      name: "Dagdaad",
      url: "https://dagdaad.nl",
      description:
        "Noteer elke dag één goede daad. Een vriendelijkheids-dagboek.",
      slogan: "Elke dag een goede daad",
      foundingDate: "2026",
      areaServed: "NL",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@dagdaad.nl",
        availableLanguage: "nl",
      },
      knowsLanguage: "nl",
    },
    {
      "@type": "WebSite",
      "@id": "https://dagdaad.nl/#website",
      url: "https://dagdaad.nl",
      name: "Dagdaad",
      description:
        "Noteer elke dag één goede daad die je voor iemand deed.",
      inLanguage: "nl",
      publisher: { "@id": "https://dagdaad.nl/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://dagdaad.nl/#software",
      name: "Dagdaad",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "0",
        highPrice: "3.99",
        offerCount: "2",
        offers: [
          { "@type": "Offer", name: "Gratis", price: "0", priceCurrency: "EUR" },
          {
            "@type": "Offer",
            name: "Pro",
            price: "3.99",
            priceCurrency: "EUR",
          },
        ],
      },
      inLanguage: "nl",
      description:
        "Noteer elke dag één goede daad en zie je spoor van vriendelijkheid.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <link rel="llms-txt" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale="nl" messages={nlMessages} timeZone="Europe/Amsterdam">
          <Nav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
