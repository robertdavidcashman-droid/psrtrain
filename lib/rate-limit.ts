/**
 * Lightweight in-memory per-IP rate limiter for API routes.
 * Resets on cold starts (serverless); sufficient to blunt brute-force bursts.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export function isRateLimited(
  ip: string,
  opts: { windowMs: number; maxRequests: number },
): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { timestamps: [] };
  const recent = bucket.timestamps.filter((t) => now - t < opts.windowMs);
  if (recent.length >= opts.maxRequests) {
    buckets.set(ip, { timestamps: recent });
    return true;
  }
  recent.push(now);
  buckets.set(ip, { timestamps: recent });
  return false;
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
