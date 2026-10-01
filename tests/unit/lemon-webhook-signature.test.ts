import { describe, expect, test } from 'vitest';
import {
  computeLemonWebhookSignature,
  verifyLemonWebhookSignature,
} from '../../lib/billing/lemon-webhook-signature.ts';

const secret = 'test-webhook-secret';
const body = '{"meta":{"event_name":"order_created"}}';

describe('verifyLemonWebhookSignature', () => {
  test('accepts a valid signature', () => {
    const sig = computeLemonWebhookSignature(body, secret);
    expect(verifyLemonWebhookSignature(body, sig, secret)).toBe(true);
  });

  test('rejects an invalid signature', () => {
    expect(verifyLemonWebhookSignature(body, 'deadbeef', secret)).toBe(false);
    expect(verifyLemonWebhookSignature(body, '00'.repeat(32), secret)).toBe(false);
  });

  test('rejects missing signature', () => {
    expect(verifyLemonWebhookSignature(body, null, secret)).toBe(false);
    expect(verifyLemonWebhookSignature(body, undefined, secret)).toBe(false);
    expect(verifyLemonWebhookSignature(body, '', secret)).toBe(false);
  });

  test('rejects when secret is empty', () => {
    const sig = computeLemonWebhookSignature(body, secret);
    expect(verifyLemonWebhookSignature(body, sig, '')).toBe(false);
  });
});
