import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import RescueLegacyHash from "@/components/auth/RescueLegacyHash";
import { FreeAccessStrip } from "@/components/FreeAccessStrip";
import { CustodyNoteStorePromo } from "@/components/CustodyNoteStorePromo";
import { SupportWidget } from "@/components/SupportWidget";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CookieBanner } from "@/components/CookieBanner";
import { AnalyticsEventBinder } from "@/components/AnalyticsEventBinder";
import { OptionalAnalytics } from "@/components/OptionalAnalytics";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: '#0B3C5D',
};

export const metadata: Metadata = {
  title: {
    default: "PSR Train - Police Station Representative Training",
    template: "%s | PSR Train"
  },
  description: "Professional training platform for Police Station Representatives. Practice questions, mock exams, PACE codes, and study materials to prepare for the Police Station Representative Accreditation Scheme (PSRAS).",
  keywords: ["PSR", "Police Station Representative", "PSRAS", "PACE", "Training", "Legal Training", "Police Station", "Accreditation", "Mock Exam"],
  authors: [{ name: "PSR Train" }],
  creator: "PSR Train",
  publisher: "PSR Train",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://psrtrain.com'),
  openGraph: {
    title: "PSR Train - Police Station Representative Training",
    description: "Practical training for police station representatives. Prepare for the PSRAS with practice questions, mock exams, and PACE materials.",
    siteName: "PSR Train",
    locale: "en_GB",
    type: "website",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PSR Train - Police Station Representative Training' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSR Train - Police Station Representative Training",
    description: "Practical training for police station representatives. Prepare for the PSRAS.",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'ZIkPA3Q0x_BUfA5rVLu8ebQKBtP5l8DzabsxU0TqgTE',
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed', title: 'PSR Train RSS' }],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className={`scroll-smooth ${jakarta.variable} ${fraunces.variable}`}>
      <body className={jakarta.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#0B3C5D] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <RescueLegacyHash />
        <SiteJsonLd />
        <FreeAccessStrip />
        <CustodyNoteStorePromo />
        <ThemeProvider>{children}</ThemeProvider>
        <SupportWidget />
        <CookieBanner />
        <Suspense fallback={null}>
          <GoogleAnalytics />
          <AnalyticsEventBinder />
        </Suspense>
        <OptionalAnalytics />
      </body>
    </html>
  );
}
