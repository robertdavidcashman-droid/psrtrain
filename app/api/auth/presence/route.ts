import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logSupabaseWriteError } from '@/lib/supabase/log-write-error';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const sessionId = (body as { sessionId?: unknown })?.sessionId;
    const path = (body as { path?: unknown })?.path;

    if (typeof sessionId !== 'string' || sessionId.length < 8) {
      return NextResponse.json({ error: 'Bad session id' }, { status: 400 });
    }

    const currentPath =
      typeof path === 'string' ? path.trim().slice(0, 500) : null;

    const now = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('user_sessions')
      .update({
        last_seen_at: now,
        ...(currentPath ? { current_path: currentPath } : {}),
      })
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .is('logout_time', null)
      .select('id')
      .maybeSingle();

    if (error) {
      logSupabaseWriteError('presence update error', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('presence error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
