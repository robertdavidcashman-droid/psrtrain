'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import {
  CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL,
  CUSTODYNOTE_PROMO_HEADLINE,
  cnStoreHref,
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
 * Custody Note strip: full Store+Mac promo on desktop; single compact row on
 * mobile so the product hero stays above the fold (audit: strip was burying CTAs).
 */
export function CustodyNoteStorePromo() {
  const pathname = usePathname() ?? '';
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <aside
      className="relative overflow-hidden border-b border-[#082a42] bg-gradient-to-r from-[#0B3C5D] via-[#0d4a72] to-[#0B3C5D] px-3 py-1.5 text-white sm:px-4 sm:py-3"
      aria-label="Custody Note for Windows and Mac"
      data-testid="custodynote-store-promo"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(212,175,55,0.12)_50%,transparent_60%)]"
        aria-hidden
      />
      {/* Mobile: one compact row — label + two side-by-side CTAs (no stack) */}
      <div className="relative mx-auto flex max-w-5xl items-center gap-2 sm:hidden">
        <p className="shrink-0 text-[11px] font-bold leading-none tracking-tight">Custody Note</p>
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <a
            href={cnStoreHref('strip')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1 rounded-md bg-[#D4AF37] px-2 text-[11px] font-bold leading-tight text-[#0B3C5D] no-underline shadow-sm transition hover:bg-[#e0c04a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            data-testid="custodynote-store-cta-mobile"
          >
            Store (UK)
            <ExternalLink className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
          </a>
          <a
            href={CUSTODYNOTE_TRIAL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1 rounded-md border-2 border-white/70 bg-white/10 px-2 text-[11px] font-bold leading-tight text-white no-underline transition hover:border-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            data-testid="custodynote-download-cta-mobile"
          >
            Mac
            <ExternalLink className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
          </a>
        </div>
      </div>

      {/* Desktop / tablet: full prominent strip */}
      <div className="relative mx-auto hidden max-w-5xl items-center justify-between gap-4 sm:flex">
        <div className="min-w-0 text-left">
          <p className="text-[0.95rem] font-bold leading-snug tracking-tight">
            {CUSTODYNOTE_PROMO_HEADLINE}
          </p>
          <p className="mt-0.5 text-sm text-slate-200">
            Structured PACE attendance notes — Windows on Microsoft Store (UK). Mac: notarised direct
            download (not on the Store).
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={cnStoreHref('strip')}
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
