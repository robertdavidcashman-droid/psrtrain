/**
 * Redact PII before logging API errors (contact, newsletter, etc.).
 */

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const SENSITIVE_KEYS = new Set([
  'email',
  'name',
  'replyto',
  'reply_to',
  'to',
  'from',
  'subject',
  'message',
  'text',
  'body',
  'phone',
  'address',
]);

function redactString(value: string): string {
  return value.replace(EMAIL_RE, '[redacted-email]');
}

function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 6) return '[truncated]';
  if (typeof value === 'string') return redactString(value);
  if (Array.isArray(value)) return value.map((v) => redactValue(v, depth + 1));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        out[key] = '[redacted]';
      } else {
        out[key] = redactValue(val, depth + 1);
      }
    }
    return out;
  }
  return value;
}

/** Log an error without echoing subscriber/contact PII from upstream payloads. */
export function safeErrorLog(label: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(label, redactString(error.message));
    return;
  }
  console.error(label, JSON.stringify(redactValue(error)));
}
