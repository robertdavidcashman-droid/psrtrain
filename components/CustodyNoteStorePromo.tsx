'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import {
  CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL,
  CUSTODYNOTE_PROMO_HEADLINE,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_STORE_PROMO_CTA_LABEL,
  CUSTODYNOTE_TRIAL_HREF,
} from '@/lib/custodynote-promo';

/** Hide on app shell, admin, and legal pages (those keep quieter partner links). */
const HIDDEN_PREFIXES = [
  '/admin',
  '/dashboard',
  '/modules',
  '/practice',
  '/mock-exam',
  '/critical-incidents',
  '/certificates',
  '/progress',
  '/search',
  '/syllabus',
  '/settings',
  '/billing',
  '/legal',
  '/gate',
  '/api',
];

/**
 * High-visibility Custody Note strip: Microsoft Store (Windows) primary +
 * notarised Mac download as a proper secondary button alongside it.
 * Compact on mobile so it stays loud without crowding the product hero.
 */
export function CustodyNoteStorePromo() {
  const pathname = usePathname() ?? '';
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <aside
      className="relative overflow-hidden border-b border-[#082a42] bg-gradient-to-r from-[#0B3C5D] via-[#0d4a72] to-[#0B3C5D] px-3 py-2.5 text-white sm:px-4 sm:py-3"
      aria-label="Custody Note for Windows and Mac"
      data-testid="custodynote-store-promo"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(212,175,55,0.12)_50%,transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-[0.8125rem] font-bold leading-snug tracking-tight sm:text-[0.95rem]">
            {CUSTODYNOTE_PROMO_HEADLINE}
          </p>
          <p className="mt-0.5 hidden text-xs text-slate-200 sm:block sm:text-sm">
            Structured PACE attendance notes — Windows on Microsoft Store (UK). Mac: notarised direct
            download (not on the Store).
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
          <a
            href={CUSTODYNOTE_STORE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 text-sm font-bold text-[#0B3C5D] no-underline shadow-md transition hover:bg-[#e0c04a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-5"
            data-testid="custodynote-store-cta"
          >
            <span className="sm:hidden">Microsoft Store (UK)</span>
            <span className="hidden sm:inline">{CUSTODYNOTE_STORE_PROMO_CTA_LABEL}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </a>
          <a
            href={CUSTODYNOTE_TRIAL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white/70 bg-white/10 px-4 text-sm font-bold text-white no-underline shadow-sm transition hover:border-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-5"
            data-testid="custodynote-download-cta"
          >
            <span className="sm:hidden">Mac download</span>
            <span className="hidden sm:inline">{CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </a>
        </div>
      </div>
    </aside>
  );
}
