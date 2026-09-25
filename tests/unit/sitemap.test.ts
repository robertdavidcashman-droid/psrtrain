import { describe, expect, it } from 'vitest';
import sitemap from '../../app/sitemap';

describe('sitemap', () => {
  it('returns a valid urlset with real lastmod values', () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(50);

    const stale = entries.filter((e) => e.lastModified?.toISOString() === '2026-01-01T00:00:00.000Z');
    expect(stale).toHaveLength(0);

    const home = entries.find((e) => e.url === 'https://psrtrain.com' || e.url.endsWith('psrtrain.com'));
    expect(home?.lastModified).toBeInstanceOf(Date);
    expect(home?.lastModified?.getTime()).toBeGreaterThan(0);
  });

  it('includes blog posts with published dates', () => {
    const cit = sitemap().find((e) => e.url.includes('/blog/how-to-pass-critical-incidents-test'));
    expect(cit?.lastModified).toBeDefined();
    expect(cit?.lastModified?.getFullYear()).toBeGreaterThanOrEqual(2026);
  });
});
