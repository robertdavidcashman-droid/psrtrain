import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  CUSTODYNOTE_DOWNLOAD_CTA_LABEL,
  CUSTODYNOTE_DOWNLOAD_HREF,
  CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL,
  CUSTODYNOTE_PROMO_BODY,
  CUSTODYNOTE_PROMO_HEADLINE,
  CUSTODYNOTE_SITE,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_STORE_PROMO_CTA_LABEL,
  CUSTODYNOTE_TRIAL_HREF,
  cnHref,
  cnStoreHref,
} from '../../lib/custodynote-promo.ts';

const root = process.cwd();

const UNAVAILABLE_STORE_CLAIMS =
  /in\s+certification|not\s+yet\s+on\s+(the\s+)?store|coming\s+soon\s+(to\s+)?(the\s+)?(microsoft\s+)?store/i;

/** Complete literal Store URLs only (dynamic cnStoreHref templates are covered by unit tests). */
const STORE_URL_LITERAL = /https:\/\/apps\.microsoft\.com\/detail\/[0-9a-z]+\?[^\s'"`]+/gi;

function walkSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '.next' || name === 'dist') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walkSourceFiles(path, acc);
    } else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(name)) {
      acc.push(path);
    }
  }
  return acc;
}

function assertStoreUrlHasCampaignParams(url: string, fileHint: string) {
  expect(url, fileHint).toMatch(/hl=en-GB/i);
  expect(url, fileHint).toMatch(/gl=GB/i);
  expect(url, fileHint).toMatch(/cid=psr-/i);
}

describe('custodynote-promo', () => {
  test('Mac download CTA targets /download with psrtrain UTMs', () => {
    const url = new URL(CUSTODYNOTE_TRIAL_HREF);
    expect(url.origin + url.pathname).toBe('https://custodynote.com/download');
    expect(url.searchParams.get('utm_source')).toBe('psrtrain');
    expect(url.searchParams.get('utm_medium')).toBe('web');
    expect(url.searchParams.get('utm_campaign')).toBe('footer');
  });

  test('download alias matches trial CTA', () => {
    expect(CUSTODYNOTE_DOWNLOAD_HREF).toBe(CUSTODYNOTE_TRIAL_HREF);
  });

  test('site root remains available for sameAs / identity links', () => {
    expect(CUSTODYNOTE_SITE).toBe('https://custodynote.com');
  });

  test('cnStoreHref builds UK Microsoft Store URLs with psr- campaign ids', () => {
    const url = new URL(cnStoreHref('strip'));
    expect(url.pathname.toLowerCase()).toBe('/detail/9nfsrvt3t45v');
    expect(url.searchParams.get('hl')).toBe('en-GB');
    expect(url.searchParams.get('gl')).toBe('GB');
    expect(url.searchParams.get('cid')).toBe('psr-strip');
    expect(cnStoreHref('psr-home').includes('cid=psr-home')).toBe(true);
  });

  test('CUSTODYNOTE_STORE_HREF defaults to blog placement (llms.txt)', () => {
    expect(CUSTODYNOTE_STORE_HREF).toBe(cnStoreHref('blog'));
    assertStoreUrlHasCampaignParams(CUSTODYNOTE_STORE_HREF, 'CUSTODYNOTE_STORE_HREF');
  });

  test('Microsoft Store is the primary Windows CTA; Mac is a proper notarised download CTA', () => {
    expect(CUSTODYNOTE_STORE_CTA_LABEL).toBe('Get it on Microsoft Store (UK)');
    expect(CUSTODYNOTE_STORE_PROMO_CTA_LABEL).toBe('Get Custody Note on Microsoft Store (UK)');
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toBe('Download for Mac (notarised)');
    expect(CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL).toBe('Download Custody Note for Mac');
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/mac/i);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/notarised/i);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).not.toMatch(/^or\s/i);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).not.toMatch(/app\s+store/i);
    expect(CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL).not.toMatch(/app\s+store/i);
  });

  test('cnHref keeps campaign and path', () => {
    const url = new URL(cnHref('network', '/download'));
    expect(url.pathname).toBe('/download');
    expect(url.searchParams.get('utm_campaign')).toBe('network');
  });

  test('shared promo copy puts Store first for Windows; Mac is notarised download', () => {
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/windows/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/\bmac\b/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(/store/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/get it on microsoft store \(uk\)/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/\bmac\b/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/notarised direct download/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/free trial/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(/mac[^.]*microsoft\s+store/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(/windows also available/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    const storeIdx = CUSTODYNOTE_PROMO_BODY.toLowerCase().indexOf('microsoft store');
    const macIdx = CUSTODYNOTE_PROMO_BODY.toLowerCase().indexOf('notarised direct download');
    expect(storeIdx).toBeGreaterThanOrEqual(0);
    expect(macIdx).toBeGreaterThan(storeIdx);
  });

  test('partner surfaces show Store + Mac as two clear CTAs (Mac is a button, not buried text)', () => {
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const legal = readFileSync(join(root, 'components/LegalPartnerStrip.tsx'), 'utf-8');
    const promo = readFileSync(join(root, 'components/SisterProductsPromo.tsx'), 'utf-8');
    const storePromo = readFileSync(join(root, 'components/CustodyNoteStorePromo.tsx'), 'utf-8');
    const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf-8');
    const footer = readFileSync(join(root, 'components/layout/Footer.tsx'), 'utf-8');
    const sidebar = readFileSync(join(root, 'components/layout/SidebarPartnerLinks.tsx'), 'utf-8');

    for (const src of [partner, hero, legal, promo, storePromo, footer, sidebar]) {
      expect(src).toMatch(/cnStoreHref/);
      expect(src).toMatch(/CUSTODYNOTE_TRIAL_HREF|CUSTODYNOTE_DOWNLOAD/);
      expect(src).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL|CUSTODYNOTE_STORE_PROMO_CTA_LABEL/);
      expect(src).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL|CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL/);
      expect(src).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
      expect(src).not.toMatch(/windows also available/i);
      expect(src).not.toMatch(/or download directly/i);
      const storePos = src.indexOf('cnStoreHref');
      const trialPos = src.indexOf('CUSTODYNOTE_TRIAL_HREF');
      expect(storePos).toBeGreaterThanOrEqual(0);
      expect(trialPos).toBeGreaterThan(storePos);
    }

    // Loud surfaces: Mac is a bordered button beside Store, not a tiny underline-only link
    for (const src of [partner, hero, promo, storePromo]) {
      expect(src).toMatch(/border-2[\s\S]*(CUSTODYNOTE_DOWNLOAD_CTA_LABEL|CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL)/);
      expect(src).toMatch(/inline-flex[\s\S]*(CUSTODYNOTE_DOWNLOAD_CTA_LABEL|CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL)/);
    }

    expect(promo).toMatch(/bg-\[#0B3C5D\][\s\S]*CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(storePromo).toMatch(/CUSTODYNOTE_STORE_PROMO_CTA_LABEL/);
    expect(storePromo).toMatch(/CUSTODYNOTE_DOWNLOAD_PROMO_CTA_LABEL/);
    expect(storePromo).toMatch(/bg-\[#D4AF37\][\s\S]*CUSTODYNOTE_STORE_PROMO_CTA_LABEL|CUSTODYNOTE_STORE_PROMO_CTA_LABEL[\s\S]*ExternalLink/);
    expect(storePromo).toMatch(/notarised direct[\s\S]*download/i);
    expect(storePromo).toMatch(/custodynote-download-cta/);
    expect(layout).toMatch(/CustodyNoteStorePromo/);
    expect(layout).toMatch(/FreeAccessStrip[\s\S]*CustodyNoteStorePromo/);
    expect(partner).toMatch(/bg-\[#0B3C5D\][\s\S]*CUSTODYNOTE_STORE_CTA_LABEL|CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(partner).toMatch(/custodynote-partner-mac-cta/);
    expect(hero).toMatch(/inline-flex[\s\S]*CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(hero).toMatch(/partner-hero-mac-cta/);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/\bmac\b/i);
  });

  test('repo CTAs include Store URL, Mac notarised download framing, and forbid unavailable-Store claims', () => {
    const promoLib = readFileSync(join(root, 'lib/custodynote-promo.ts'), 'utf-8');
    const footer = readFileSync(join(root, 'components/layout/Footer.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const storePromo = readFileSync(join(root, 'components/CustodyNoteStorePromo.tsx'), 'utf-8');
    const blob = [promoLib, footer, hero, partner, storePromo].join('\n');
    expect(blob).toMatch(/Get it on Microsoft Store \(UK\)/);
    expect(blob).toMatch(/Get Custody Note on Microsoft Store \(UK\)/);
    expect(blob).toMatch(/Download for Mac \(notarised\)/);
    expect(blob).toMatch(/Download Custody Note for Mac/);
    expect(blob).toMatch(/cnStoreHref/);
    expect(blob).not.toMatch(/or download directly/i);
    expect(blob).not.toMatch(/get (it |custody note )?on (the )?mac app store/i);
    expect(blob).not.toMatch(/available on (the )?mac app store/i);
    expect(blob).not.toMatch(/windows also available/i);
    expect(blob).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
  });

  test('no literal Microsoft Store URL in the repo lacks gl=GB and psr- cid', () => {
    const files = walkSourceFiles(root);
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const matches = content.match(STORE_URL_LITERAL) ?? [];
      for (const raw of matches) {
        assertStoreUrlHasCampaignParams(raw, file);
      }
    }
  });

  test('placement-specific Store hrefs use psr- campaign ids', () => {
    const checks: Array<{ file: string; pattern: RegExp }> = [
      { file: 'components/CustodyNoteStorePromo.tsx', pattern: /cnStoreHref\(['"]strip['"]\)/ },
      { file: 'components/PartnerHeroMention.tsx', pattern: /cnStoreHref\(['"]home['"]\)/ },
      { file: 'components/layout/Footer.tsx', pattern: /cnStoreHref\(['"]footer['"]\)/ },
      { file: 'components/layout/SidebarPartnerLinks.tsx', pattern: /cnStoreHref\(['"]nav['"]\)/ },
      { file: 'components/LegalPartnerStrip.tsx', pattern: /cnStoreHref\(['"]legal['"]\)/ },
      { file: 'app/auth/page.tsx', pattern: /cnStoreHref\(['"]auth['"]\)/ },
      { file: 'app/legal/about/page.tsx', pattern: /cnStoreHref\(['"]about['"]\)/ },
      { file: 'app/pricing/page.tsx', pattern: /custodyNoteStorePlacement="pricing"/ },
      { file: 'app/training/page.tsx', pattern: /custodyNoteStorePlacement="training"/ },
    ];
    for (const { file, pattern } of checks) {
      const src = readFileSync(join(root, file), 'utf-8');
      expect(src, file).toMatch(pattern);
    }
  });
});
