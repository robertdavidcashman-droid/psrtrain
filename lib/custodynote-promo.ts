import { partnerHref } from '@/lib/utm';

export const CUSTODYNOTE_SITE = 'https://custodynote.com';

export function cnHref(campaign: string, path = ''): string {
  const base = path
    ? `${CUSTODYNOTE_SITE}${path.startsWith('/') ? path : `/${path}`}`
    : CUSTODYNOTE_SITE;
  return partnerHref(base, campaign, 'psrtrain');
}

/** Primary Windows CTA: Microsoft Store (UK). Mac is not on the Store. */
export const CUSTODYNOTE_STORE_HREF = 'https://apps.microsoft.com/detail/9NFSRVT3T45V';

/** Primary Windows CTA label — main button / first link. */
export const CUSTODYNOTE_STORE_CTA_LABEL = 'Get it on Microsoft Store (UK)';

/**
 * Backup / Mac CTA: product download page (keeps UTMs; campaign defaults to footer).
 * Prefer Store for Windows; use this for Mac and as a direct-download backup.
 */
export const CUSTODYNOTE_TRIAL_HREF = cnHref('footer', '/download');
export const CUSTODYNOTE_DOWNLOAD_HREF = CUSTODYNOTE_TRIAL_HREF;
export const CUSTODYNOTE_FEATURES_HREF = cnHref('footer', '/features');

/** Secondary framing shown next to the Store CTA. */
export const CUSTODYNOTE_DOWNLOAD_CTA_LABEL = 'or download directly (Mac / backup)';

export const CUSTODYNOTE_PROMO_HEADLINE = 'Custody Note — Windows and Mac';
export const CUSTODYNOTE_PROMO_BODY =
  'Structured PACE attendance notes for reps and solicitors. Windows: get it on Microsoft Store (UK). Mac / backup: download directly — 30-day free trial. Offline at the station, PDF export.';
