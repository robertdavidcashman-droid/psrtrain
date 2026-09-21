import { partnerHref } from '@/lib/utm';

export const CUSTODYNOTE_SITE = 'https://custodynote.com';

export function cnHref(campaign: string, path = ''): string {
  const base = path
    ? `${CUSTODYNOTE_SITE}${path.startsWith('/') ? path : `/${path}`}`
    : CUSTODYNOTE_SITE;
  return partnerHref(base, campaign, 'psrtrain');
}

/** Preferred CTA: product download page (keeps UTMs; campaign defaults to footer). */
export const CUSTODYNOTE_TRIAL_HREF = cnHref('footer', '/download');
export const CUSTODYNOTE_DOWNLOAD_HREF = CUSTODYNOTE_TRIAL_HREF;
export const CUSTODYNOTE_FEATURES_HREF = cnHref('footer', '/features');

/** Windows (UK) Microsoft Store listing — live. Mac remains download-only. */
export const CUSTODYNOTE_STORE_HREF = 'https://apps.microsoft.com/detail/9NFSRVT3T45V';

/** Short line shown next to the download / free-trial CTA. */
export const CUSTODYNOTE_STORE_CTA_LABEL = 'Windows also available on Microsoft Store (UK)';

export const CUSTODYNOTE_PROMO_HEADLINE = 'Custody Note — Windows and Mac';
export const CUSTODYNOTE_PROMO_BODY =
  'Structured PACE attendance notes for reps and solicitors on Windows and Mac. Offline at the station, PDF export. Download both from the free trial page — 30-day free trial. Windows also available on Microsoft Store (UK).';
