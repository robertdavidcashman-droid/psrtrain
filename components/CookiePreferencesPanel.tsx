'use client';

import { useEffect, useState } from 'react';
import {
  type CookieConsentValue,
  readCookieConsent,
  setCookieConsent,
} from '@/lib/cookie-consent';

/**
 * Inline accept / reject control for the Cookie Policy “Manage preferences” section.
 */
export function CookiePreferencesPanel() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
  }, []);

  const save = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setConsent(value);
    setSaved(true);
  };

  return (
    <div
      id="manage"
      className="rounded-xl border border-border bg-slate-50 p-5 space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-navy">Analytics preferences</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Optional analytics help us understand how the site is used (Vercel Analytics,
          Speed Insights, and Google Analytics when configured). Essential cookies for
          sign-in and security always run and do not require consent.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Current choice:{' '}
        <strong className="text-foreground">
          {consent === 'accepted'
            ? 'Analytics allowed'
            : consent === 'rejected'
              ? 'Analytics rejected'
              : 'Not set yet'}
        </strong>
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => save('accepted')}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#0B3C5D] px-4 text-sm font-semibold text-white hover:bg-[#0B3C5D]/90"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => save('rejected')}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-semibold text-[#0B3C5D] hover:border-[#D4AF37]"
        >
          Reject analytics
        </button>
      </div>
      {saved && (
        <p className="text-sm text-emerald-700" role="status">
          Preference saved. You can change it any time on this page.
        </p>
      )}
    </div>
  );
}
