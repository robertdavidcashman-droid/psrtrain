import { partnerHref } from '@/lib/utm';

export const CUSTODYNOTE_SITE = 'https://custodynote.com';

/** Microsoft Store product id (lowercase in generated URLs). */
const CUSTODYNOTE_STORE_APP_ID = '9nfsrvt3t45v';

export function cnHref(campaign: string, path = ''): string {
  const base = path
    ? `${CUSTODYNOTE_SITE}${path.startsWith('/') ? path : `/${path}`}`
    : CUSTODYNOTE_SITE;
  return partnerHref(base, campaign, 'psrtrain');
}

/**
 * Microsoft Store (UK) link with locale and campaign id for attribution.
 * @param placement Short slug (e.g. `home`) or full cid (`psr-home`).
 */
export function cnStoreHref(placement: string): string {
  const cid = placement.startsWith('psr-') ? placement : `psr-${placement}`;
  const url = new URL(`https://apps.microsoft.com/detail/${CUSTODYNOTE_STORE_APP_ID}`);
  url.searchParams.set('hl', 'en-GB');
  url.searchParams.set('gl', 'GB');
  url.searchParams.set('cid', cid);
  return url.toString();
}

/** Default Store href when no placement-specific link is needed (e.g. llms.txt). */
export const CUSTODYNOTE_STORE_HREF = cnStoreHref('blog');

/** Primary Windows CTA label — main button / first link. */
export const CUSTODYNOTE_STORE_CTA_LABEL = 'Get it on Microsoft Store (UK)';

/**
 * Stronger label for the high-visibility marketing Store strip / button.
 * Inline partner lines keep the shorter CUSTODYNOTE_STORE_CTA_LABEL.
 */
export const CUSTODYNOTE_STORE_PROMO_CTA_LABEL = 'Get Custody Note on Microsoft Store (UK)';

/**
 * Mac CTA: notarised .dmg via product download page (keeps UTMs; campaign defaults to footer).
 * Direct download only (not Apple’s store listing). Prefer Microsoft Store for Windows.
 */
export const CUSTODYNOTE_TRIAL_HREF = cnHref('footer', '/download');
export const CUSTODYNOTE_DOWNLOAD_HREF = CUSTODYNOTE_TRIAL_HREF;
export const CUSTODYNOTE_FEATURES_HREF = cnHref('footer', '/features');

/**
 * Proper secondary button label shown next to the Store CTA.
 * Mac = direct notarised download (not a buried “or download…” link).
 */
export const CUSTODYNOTE_DOWNLOAD_CTA_LABEL = 'Download for Mac (notarised)';

/**
 * Stronger Mac label for the high-visibility marketing strip / button.
 * Inline partner lines keep the shorter CUSTODYNOTE_DOWNLOAD_CTA_LABEL.
 */
export const CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL = 'Download Custody Note for Mac';

export const CUSTODYNOTE_PROMO_HEADLINE = 'Custody Note — Windows and Mac';
export const CUSTODYNOTE_PROMO_BODY =
  'Structured PACE attendance notes for reps and solicitors. Windows: get it on Microsoft Store (UK). Mac: notarised direct download — 30-day free trial. Offline at the station, PDF export.';
