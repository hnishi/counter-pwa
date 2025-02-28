import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "カウンターアプリ",
  description: "シンプルなPWAカウンターアプリケーション",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    userScalable: false,
    maximumScale: 1.0,
    minimumScale: 1.0,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "カウンター",
  },
  other: {
    "mobile-web-app-capable": "yes",
    version: "0.1.0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="apple-touch-icon"
          href="/icons/icon-192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/icon-152x152.png"
          sizes="152x152"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/icon-180x180.png"
          sizes="180x180"
        />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        <style>{`:root { --sat: env(safe-area-inset-top); }`}</style>
      </head>
      <body className={`${inter.className} overscroll-none`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
