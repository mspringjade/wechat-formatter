import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_HOST,
  SITE_OG_SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_URL,
} from "@/lib/site-config";
import { JsonLd } from "./json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_BRAND,
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s · ${SITE_BRAND}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "TypeZen",
    "typezen",
    SITE_HOST,
    "公众号排版",
    "微信公众号排版",
    "Markdown排版",
    "微信编辑器",
    "公众号编辑器",
    "Markdown转微信",
    "一键排版",
    "文章排版工具",
    "公众号美化",
    "微信文章排版",
  ],
  authors: [{ name: SITE_BRAND, url: SITE_URL }],
  creator: SITE_BRAND,
  publisher: SITE_BRAND,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: SITE_OG_SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${SITE_OG_SITE_NAME} · ${SITE_HOST}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E96JLD0RWJ"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E96JLD0RWJ');
          `}
        </Script>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              var savedTheme = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
