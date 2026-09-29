'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'psr_session_id';
const PRESENCE_INTERVAL_MS = 30_000;

async function ensureSessionId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  try {
    const res = await fetch('/api/auth/login-track', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('login-track failed:', res.status, (data as { error?: string }).error ?? '');
      return null;
    }
    if (data.sessionId) {
      sessionStorage.setItem(SESSION_KEY, data.sessionId);
      return data.sessionId as string;
    }
    console.error('login-track response missing sessionId');
  } catch (err) {
    console.error('login-track request failed:', err);
  }
  return null;
}

async function sendPresence(
  sessionId: string,
  path: string,
): Promise<'ok' | 'stale' | 'failed'> {
  try {
    const res = await fetch('/api/auth/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, path }),
    });
    if (res.ok) return 'ok';
    const data = await res.json().catch(() => ({}));
    console.error('presence ping failed:', res.status, (data as { error?: string }).error ?? '');
    if (res.status === 404 && typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
      return 'stale';
    }
    return 'failed';
  } catch (err) {
    console.error('presence request failed:', err);
    return 'failed';
  }
}

/** Starts login session tracking and periodic presence pings for admin live view. */
export function SessionTracker() {
  const pathname = usePathname() ?? '/dashboard';
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    void (async () => {
      const id = await ensureSessionId();
      if (cancelled || !id) return;
      sessionIdRef.current = id;
      await sendPresence(id, pathname);

      interval = setInterval(() => {
        void (async () => {
          if (!sessionIdRef.current) return;
          const result = await sendPresence(sessionIdRef.current, pathname);
          if (result === 'stale') {
            sessionIdRef.current = null;
            const newId = await ensureSessionId();
            if (newId) {
              sessionIdRef.current = newId;
              await sendPresence(newId, pathname);
            }
          }
        })();
      }, PRESENCE_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [pathname]);

  useEffect(() => {
    if (sessionIdRef.current) {
      void sendPresence(sessionIdRef.current, pathname);
    }
  }, [pathname]);

  return null;
}

export function clearTrackedSession() {
  if (typeof window === 'undefined') return;
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  if (sessionId) {
    void fetch('/api/auth/logout-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
  }
}
