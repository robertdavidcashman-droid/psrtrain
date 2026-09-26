import { createClient } from '@/lib/supabase/server';
import { logSupabaseWriteError } from '@/lib/supabase/log-write-error';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function getClientIP(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIP || null;
}

export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('user-agent');
}

export async function startSession(userId: string): Promise<string> {
  const supabase = await createClient();
  const sessionId = uuidv4();
  const ipAddress = await getClientIP();
  const userAgent = await getUserAgent();

  const now = new Date().toISOString();

  const { error } = await supabase.from('user_sessions').insert({
    user_id: userId,
    session_id: sessionId,
    login_time: now,
    last_seen_at: now,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    logSupabaseWriteError('user_sessions insert failed', error);
    throw new Error('Failed to start user session');
  }

  return sessionId;
}

export async function endSession(sessionId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_sessions')
    .update({ logout_time: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) {
    logSupabaseWriteError('user_sessions logout update failed', error);
    throw new Error('Failed to end user session');
  }
}

export async function getSessionByUserId(userId: string) {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('logout_time', null)
    .order('login_time', { ascending: false })
    .limit(1)
    .single();

  return data;
}




























