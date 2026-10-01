import crypto from 'node:crypto';

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, 'hex');
  const b = Buffer.from(bHex, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Lemon Squeezy signs the raw request body with HMAC-SHA256 (hex digest). */
export function computeLemonWebhookSignature(rawBody: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

export function verifyLemonWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = computeLemonWebhookSignature(rawBody, secret);
  return timingSafeEqualHex(expected, signatureHeader.trim());
}
