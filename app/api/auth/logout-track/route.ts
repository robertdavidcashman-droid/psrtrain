import { NextRequest, NextResponse } from 'next/server';
import { endSession } from '@/lib/session-tracker';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth/admin-emails';

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
    if (typeof sessionId !== 'string' || sessionId.length < 8) {
      return NextResponse.json({ error: 'Bad session id' }, { status: 400 });
    }

    const admin = isAdminEmail(user.email);
    if (!admin) {
      const { data: row, error: lookupError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (lookupError) {
        console.error('logout-track lookup error:', lookupError.message);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }

      if (!row || row.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await endSession(sessionId);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error(
      'logout-track error:',
      error instanceof Error ? error.message : 'unknown',
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
