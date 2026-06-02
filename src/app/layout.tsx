import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dagdaad — 每天记一件好事",
  description: "记录你每天为别人做的一件好事。让自己看见善意的痕迹。",
  metadataBase: new URL("https://dagdaad.nl"),
  openGraph: {
    title: "Dagdaad",
    description: "记录你每天为别人做的一件好事。让自己看见善意的痕迹。",
    siteName: "Dagdaad",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
