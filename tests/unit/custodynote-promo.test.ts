import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CUSTODYNOTE_DOWNLOAD_HREF,
  CUSTODYNOTE_PROMO_BODY,
  CUSTODYNOTE_PROMO_HEADLINE,
  CUSTODYNOTE_SITE,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_TRIAL_HREF,
  cnHref,
} from '../../lib/custodynote-promo.ts';

const root = process.cwd();

const UNAVAILABLE_STORE_CLAIMS =
  /in\s+certification|not\s+yet\s+on\s+(the\s+)?store|coming\s+soon\s+(to\s+)?(the\s+)?(microsoft\s+)?store/i;

describe('custodynote-promo', () => {
  test('primary CTA targets /download with psrtrain UTMs', () => {
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

  test('Microsoft Store URL and CTA label for Windows (UK)', () => {
    expect(CUSTODYNOTE_STORE_HREF).toBe('https://apps.microsoft.com/detail/9NFSRVT3T45V');
    expect(CUSTODYNOTE_STORE_CTA_LABEL).toBe('Windows also available on Microsoft Store (UK)');
  });

  test('cnHref keeps campaign and path', () => {
    const url = new URL(cnHref('network', '/download'));
    expect(url.pathname).toBe('/download');
    expect(url.searchParams.get('utm_campaign')).toBe('network');
  });

  test('shared promo copy keeps Mac as download and mentions Store for Windows', () => {
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/windows/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/\bmac\b/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(/store/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/windows also available on microsoft store \(uk\)/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/\bmac\b/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/download/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/free trial/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(/mac[^.]*microsoft\s+store/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
  });

  test('partner surfaces place Store CTA label next to download path', () => {
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const legal = readFileSync(join(root, 'components/LegalPartnerStrip.tsx'), 'utf-8');
    const promo = readFileSync(join(root, 'components/SisterProductsPromo.tsx'), 'utf-8');
    for (const src of [partner, hero, legal, promo]) {
      expect(src).toMatch(/CUSTODYNOTE_STORE_HREF/);
      expect(src).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL|CUSTODYNOTE_TRIAL_HREF/);
      expect(src).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    }
    expect(partner).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(hero).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(promo).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(partner).toMatch(/download both/i);
    expect(hero).toMatch(/download both/i);
    expect(partner).toMatch(/\bmac\b/i);
    expect(hero).toMatch(/\bmac\b/i);
  });

  test('repo CTAs include Store URL and forbid unavailable-Store claims', () => {
    const promo = readFileSync(join(root, 'lib/custodynote-promo.ts'), 'utf-8');
    const footer = readFileSync(join(root, 'components/layout/Footer.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const blob = [promo, footer, hero, partner].join('\n');
    expect(blob).toMatch(/Windows also available on Microsoft Store \(UK\)/);
    expect(blob).toMatch(/apps\.microsoft\.com\/detail\/9NFSRVT3T45V/);
    expect(blob).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
  });
});
