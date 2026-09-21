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
 */
export function CustodyNoteStorePromo() {
  const pathname = usePathname() ?? '';
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <aside
      className="relative overflow-hidden border-b border-[#082a42] bg-gradient-to-r from-[#0B3C5D] via-[#0d4a72] to-[#0B3C5D] px-4 py-3 text-white"
      aria-label="Custody Note for Windows and Mac"
      data-testid="custodynote-store-promo"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(212,175,55,0.12)_50%,transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-sm font-bold tracking-tight sm:text-[0.95rem]">
            {CUSTODYNOTE_PROMO_HEADLINE}
          </p>
          <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
            Structured PACE attendance notes — Windows on Microsoft Store (UK). Mac: notarised direct
            download (not on the Store).
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <a
            href={CUSTODYNOTE_STORE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 text-sm font-bold text-[#0B3C5D] no-underline shadow-md transition hover:bg-[#e0c04a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            data-testid="custodynote-store-cta"
          >
            {CUSTODYNOTE_STORE_PROMO_CTA_LABEL}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </a>
          <a
            href={CUSTODYNOTE_TRIAL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border-2 border-white/70 bg-white/10 px-5 text-sm font-bold text-white no-underline shadow-sm transition hover:border-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            data-testid="custodynote-download-cta"
          >
            {CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </a>
        </div>
      </div>
    </aside>
  );
}
