'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAnalyticsEnabled } from '@/lib/analytics';
import {
  CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_KEY,
  hasAnalyticsConsent,
  LEGACY_COOKIES_ACCEPTED_KEY,
} from '@/lib/cookie-consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

/** Loads GA4 after analytics consent is accepted; tracks page views on route change. */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const enabled = isAnalyticsEnabled();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !consented || typeof window.gtag !== 'function') return;
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    window.gtag('config', GA_ID, { page_path: path });
  }, [enabled, consented, pathname, searchParams]);

  if (!enabled || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          var consent = localStorage.getItem('${COOKIE_CONSENT_KEY}');
          var legacy = localStorage.getItem('${LEGACY_COOKIES_ACCEPTED_KEY}');
          if (consent === 'accepted' || (!consent && legacy === 'true')) {
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          }
        `}
      </Script>
    </>
  );
}
