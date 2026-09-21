import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CUSTODYNOTE_DOWNLOAD_CTA_LABEL,
  CUSTODYNOTE_DOWNLOAD_HREF,
  CUSTODYNOTE_PROMO_BODY,
  CUSTODYNOTE_PROMO_HEADLINE,
  CUSTODYNOTE_SITE,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_STORE_PROMO_CTA_LABEL,
  CUSTODYNOTE_TRIAL_HREF,
  cnHref,
} from '../../lib/custodynote-promo.ts';

const root = process.cwd();

const UNAVAILABLE_STORE_CLAIMS =
  /in\s+certification|not\s+yet\s+on\s+(the\s+)?store|coming\s+soon\s+(to\s+)?(the\s+)?(microsoft\s+)?store/i;

describe('custodynote-promo', () => {
  test('backup download CTA targets /download with psrtrain UTMs', () => {
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

  test('Microsoft Store is the primary Windows CTA (UK)', () => {
    expect(CUSTODYNOTE_STORE_HREF).toBe('https://apps.microsoft.com/detail/9NFSRVT3T45V');
    expect(CUSTODYNOTE_STORE_CTA_LABEL).toBe('Get it on Microsoft Store (UK)');
    expect(CUSTODYNOTE_STORE_PROMO_CTA_LABEL).toBe('Get Custody Note on Microsoft Store (UK)');
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/download directly/i);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/mac/i);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/backup/i);
  });

  test('cnHref keeps campaign and path', () => {
    const url = new URL(cnHref('network', '/download'));
    expect(url.pathname).toBe('/download');
    expect(url.searchParams.get('utm_campaign')).toBe('network');
  });

  test('shared promo copy puts Store first for Windows; Mac stays download', () => {
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/windows/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).toMatch(/\bmac\b/i);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(/store/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/get it on microsoft store \(uk\)/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/mac\s*\/\s*backup/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/download directly/i);
    expect(CUSTODYNOTE_PROMO_BODY).toMatch(/free trial/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(/mac[^.]*microsoft\s+store/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(/windows also available/i);
    expect(CUSTODYNOTE_PROMO_BODY).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    expect(CUSTODYNOTE_PROMO_HEADLINE).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
    const storeIdx = CUSTODYNOTE_PROMO_BODY.toLowerCase().indexOf('microsoft store');
    const downloadIdx = CUSTODYNOTE_PROMO_BODY.toLowerCase().indexOf('download directly');
    expect(storeIdx).toBeGreaterThanOrEqual(0);
    expect(downloadIdx).toBeGreaterThan(storeIdx);
  });

  test('partner surfaces make Store the primary Windows path and download the backup', () => {
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const legal = readFileSync(join(root, 'components/LegalPartnerStrip.tsx'), 'utf-8');
    const promo = readFileSync(join(root, 'components/SisterProductsPromo.tsx'), 'utf-8');
    const storePromo = readFileSync(join(root, 'components/CustodyNoteStorePromo.tsx'), 'utf-8');
    const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf-8');
    const footer = readFileSync(join(root, 'components/layout/Footer.tsx'), 'utf-8');
    const sidebar = readFileSync(join(root, 'components/layout/SidebarPartnerLinks.tsx'), 'utf-8');

    for (const src of [partner, hero, legal, promo, storePromo, footer, sidebar]) {
      expect(src).toMatch(/CUSTODYNOTE_STORE_HREF/);
      expect(src).toMatch(/CUSTODYNOTE_TRIAL_HREF|CUSTODYNOTE_DOWNLOAD/);
      expect(src).toMatch(/CUSTODYNOTE_STORE_CTA_LABEL|CUSTODYNOTE_STORE_PROMO_CTA_LABEL/);
      expect(src).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL/);
      expect(src).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
      expect(src).not.toMatch(/windows also available/i);
      const storePos = src.indexOf('CUSTODYNOTE_STORE_HREF');
      const trialPos = src.indexOf('CUSTODYNOTE_TRIAL_HREF');
      expect(storePos).toBeGreaterThanOrEqual(0);
      expect(trialPos).toBeGreaterThan(storePos);
    }

    expect(promo).toMatch(/bg-\[#0B3C5D\][\s\S]*CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(promo).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL/);
    expect(storePromo).toMatch(/CUSTODYNOTE_STORE_PROMO_CTA_LABEL/);
    expect(storePromo).toMatch(/bg-\[#D4AF37\][\s\S]*CUSTODYNOTE_STORE_PROMO_CTA_LABEL|CUSTODYNOTE_STORE_PROMO_CTA_LABEL[\s\S]*ExternalLink/);
    expect(storePromo).toMatch(/Mac is not on the Store/);
    expect(storePromo).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL/);
    expect(layout).toMatch(/CustodyNoteStorePromo/);
    expect(layout).toMatch(/FreeAccessStrip[\s\S]*CustodyNoteStorePromo/);
    expect(partner).toMatch(/bg-\[#0B3C5D\][\s\S]*CUSTODYNOTE_STORE_CTA_LABEL|CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(partner).toMatch(/rounded-md[\s\S]*CUSTODYNOTE_STORE_CTA_LABEL|inline-flex[\s\S]*CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(partner).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL/);
    expect(hero).toMatch(/inline-flex[\s\S]*CUSTODYNOTE_STORE_CTA_LABEL/);
    expect(hero).toMatch(/CUSTODYNOTE_DOWNLOAD_CTA_LABEL/);
    expect(CUSTODYNOTE_DOWNLOAD_CTA_LABEL).toMatch(/\bmac\b/i);
  });

  test('repo CTAs include Store URL, backup download framing, and forbid unavailable-Store claims', () => {
    const promoLib = readFileSync(join(root, 'lib/custodynote-promo.ts'), 'utf-8');
    const footer = readFileSync(join(root, 'components/layout/Footer.tsx'), 'utf-8');
    const hero = readFileSync(join(root, 'components/PartnerHeroMention.tsx'), 'utf-8');
    const partner = readFileSync(join(root, 'components/CustodyNotePartnerLine.tsx'), 'utf-8');
    const storePromo = readFileSync(join(root, 'components/CustodyNoteStorePromo.tsx'), 'utf-8');
    const blob = [promoLib, footer, hero, partner, storePromo].join('\n');
    expect(blob).toMatch(/Get it on Microsoft Store \(UK\)/);
    expect(blob).toMatch(/Get Custody Note on Microsoft Store \(UK\)/);
    expect(blob).toMatch(/or download directly \(Mac \/ backup\)/);
    expect(blob).toMatch(/apps\.microsoft\.com\/detail\/9NFSRVT3T45V/);
    expect(blob).not.toMatch(/windows also available/i);
    expect(blob).not.toMatch(UNAVAILABLE_STORE_CLAIMS);
  });
});
