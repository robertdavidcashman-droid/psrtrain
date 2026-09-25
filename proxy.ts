/**
 * Next.js 16+ uses this file as edge middleware (see build output: "ƒ Proxy").
 * Do not add a separate `middleware.ts` — Next will error if both exist.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { updateSession } from '@/lib/supabase/middleware';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { verifyGateToken } from '@/lib/gate-token';
import { resolveAuthEntryRedirect, splitPathAndSearch, buildAuthNextFromRequest } from '@/lib/auth/resolve-auth-entry-redirect';

const GATE_COOKIE_NAME = 'psr_gate';

// Routes that REQUIRE the user to be signed in.
const AUTH_REQUIRED_PREFIXES = [
  '/practice',
  '/modules',
  '/critical-incidents',
  '/mock-exam',
  '/syllabus',
  '/search',
  '/dashboard',
  '/settings',
  '/progress',
  '/certificates',
  '/billing',
  '/admin',
];

// Public access-code gate (legacy / pre-launch). Independent of auth.
const GATED_PATHS = [
  ...AUTH_REQUIRED_PREFIXES,
  '/billing',
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function proxy(request: NextRequest) {
  // ---- Canonical host (www -> apex) ----
  // Without this, a user who lands on www.psrtrain.com can sign in there,
  // get a Supabase cookie scoped to www, and then any link/redirect that
  // sends them to the apex (psrtrain.com) appears unauthenticated. Forcing
  // one canonical host keeps the cookie scope consistent.
  const host = request.headers.get('host') ?? '';
  if (host === 'www.psrtrain.com') {
    const target = `https://psrtrain.com${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(target, 308);
  }

  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // ---- Legacy access-code gate (controlled by APP_ACCESS_CODE env) ----
  const gateRequired =
    typeof process.env.APP_ACCESS_CODE === 'string' &&
    process.env.APP_ACCESS_CODE.trim() !== '';
  if (gateRequired && matchesPrefix(pathname, GATED_PATHS)) {
    const cookieValue = request.cookies.get(GATE_COOKIE_NAME)?.value;
    const hasGate = await verifyGateToken(cookieValue);
    if (!hasGate) {
      const url = request.nextUrl.clone();
      url.pathname = '/gate';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ---- Auth + billing gating ----
  if (!isSupabaseConfigured()) return response;

  const isAuthEntry =
    pathname === '/auth' || pathname === '/login' || pathname === '/signup';

  const needsAuth = matchesPrefix(pathname, AUTH_REQUIRED_PREFIXES);
  if (!isAuthEntry && !needsAuth) return response;

  // Re-create a Supabase client that reads the cookies the updateSession
  // call just refreshed. We don't write cookies here so it's cheap.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          /* no-op: response cookies already handled by updateSession */
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Signed-in users should not stay on sign-in entry pages (avoids loops and
  // confusing UX). Respect ?next= when it is a safe internal path, or ?plan=
  // from pricing links so intent isn't silently dropped in favour of /dashboard.
  if (user && isAuthEntry) {
    const dest = resolveAuthEntryRedirect(request.nextUrl.searchParams);
    const { pathname, search } = splitPathAndSearch(dest);
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search;
    return NextResponse.redirect(url);
  }

  if (!needsAuth) return response;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', buildAuthNextFromRequest(pathname, request.nextUrl.search));
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
