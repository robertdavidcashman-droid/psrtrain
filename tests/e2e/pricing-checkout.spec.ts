/**
 * Pricing page auth wiring + mobile login click path.
 * Run: npm run test:e2e -- tests/e2e/pricing-checkout.spec.ts
 */
import path from 'node:path';
import dotenv from 'dotenv';
import { test, expect } from '@playwright/test';
import { suppressCookieBanner } from './helpers/cookies';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

test.describe('Pricing CTAs', () => {
  test('logged-out Create free account (monthly) reaches signup auth with plan preserved', async ({
    page,
  }) => {
    await suppressCookieBanner(page);
    await page.goto('/pricing');

    const cta = page.getByRole('link', { name: /Create free account/i }).first();
    await cta.click();

    await expect(page).toHaveURL(/\/auth/);
    await expect(page).toHaveURL(/mode=signup|plan=monthly|next=.*plan%3Dmonthly|\/signup/);
  });
});

test.describe('Mobile login click path', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Log in in mobile menu navigates to /auth', async ({ page }) => {
    await suppressCookieBanner(page);
    await page.goto('/');

    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Log in' }).click({ force: false });

    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 15_000,
    });
  });
});
