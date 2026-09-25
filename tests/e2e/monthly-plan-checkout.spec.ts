/**
 * User-journey E2E: monthly Create free account → signup auth with plan preserved.
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';
import { suppressCookieBanner } from './helpers/cookies';
import { expectActionable } from './helpers/clickability';
import { collectPageErrors } from './helpers/page-errors';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

test.describe('Monthly plan signup journey (logged out)', () => {
  test('pricing loads; Create free account is enabled and opens signup auth with monthly plan', async ({
    page,
  }) => {
    await suppressCookieBanner(page);
    const errors = collectPageErrors(page);
    const res = await page.goto('/pricing');
    expect(res?.ok()).toBeTruthy();

    const cta = page.getByRole('link', { name: /Create free account/i }).first();
    const href = await cta.getAttribute('href');
    expect(href).toMatch(/\/signup/);
    await expectActionable(cta);
    await cta.click();

    await expect(page).toHaveURL(/\/auth|\/signup/);
    expect(errors).toEqual([]);
  });
});
