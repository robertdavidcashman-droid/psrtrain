import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { signGateToken } from '@/lib/gate-token';
import { clientIpFromRequest, isRateLimited } from '@/lib/rate-limit';

const GATE_COOKIE_NAME = 'psr_gate';
const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_WINDOW = 10;

function timingSafeEqualStrings(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromRequest(request);
    if (
      isRateLimited(ip, {
        windowMs: RATE_LIMIT_WINDOW_MS,
        maxRequests: MAX_ATTEMPTS_PER_WINDOW,
        scope: 'access-verify',
      })
    ) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a minute and try again.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    const expected = process.env.APP_ACCESS_CODE?.trim();

    if (!expected) {
      return NextResponse.json(
        { error: 'Access gate is not configured' },
        { status: 503 }
      );
    }

    if (!timingSafeEqualStrings(code, expected)) {
      return NextResponse.json(
        { error: 'Incorrect codeword' },
        { status: 401 }
      );
    }

    const token = await signGateToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(GATE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GATE_COOKIE_MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
