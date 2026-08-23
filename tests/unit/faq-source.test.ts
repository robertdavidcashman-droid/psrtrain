import { describe, expect, test } from 'vitest';
import {
  SITE_FAQS,
  HOMEPAGE_FAQ_QUESTIONS,
  PRICING_FAQS,
  faqsForQuestions,
} from '../../lib/faq.ts';

describe('site FAQ source of truth', () => {
  test('homepage FAQ questions resolve from SITE_FAQS', () => {
    const items = faqsForQuestions(HOMEPAGE_FAQ_QUESTIONS);
    expect(items).toHaveLength(HOMEPAGE_FAQ_QUESTIONS.length);
    expect(items.every((f) => SITE_FAQS.includes(f))).toBe(true);
  });

  test('cost answer is free-while-testing and does not sell live checkout', () => {
    const cost = SITE_FAQS.find((f) => f.question === 'What does PSR Train cost?');
    expect(cost?.answer).toMatch(/completely free while we are in testing/i);
    expect(cost?.answer).toMatch(/no card required/i);
    expect(cost?.answer).toMatch(/Coming soon/i);
    expect(cost?.answer).not.toMatch(/cancel any time from your billing/i);
  });

  test('pricing FAQs include cost and accreditation from shared source', () => {
    expect(PRICING_FAQS.some((f) => f.question === 'What does PSR Train cost?')).toBe(true);
    expect(
      PRICING_FAQS.some((f) =>
        f.question.startsWith('Does completing this training qualify'),
      ),
    ).toBe(true);
  });
});
