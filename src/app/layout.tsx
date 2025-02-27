"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
        />
        <style>
          {`
            :root {
              --sat: env(safe-area-inset-top);
            }
          `}
        </style>
        <meta
          name="description"
          content="シンプルなPWAカウンターアプリケーション"
        />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="カウンター" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="version" content="0.1.0" />
        <link rel="manifest" href="/manifest.json" />
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
        <title>カウンターアプリ</title>
      </head>
      <body className={`${inter.className} overscroll-none`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
