import { createClient } from '@/lib/supabase/server';
import { createAdminClient, hasAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Approved MCQ count for marketing stats (homepage, audit). */
export async function getApprovedQuestionCount(): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  // Prefer service-role or RPC so anon cannot scrape answer keys via count probe.
  if (hasAdminClient()) {
    try {
      const admin = createAdminClient();
      const { count, error } = await admin
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved');
      if (!error && count != null) return count;
    } catch {
      /* fall through */
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('approved_question_count');
  if (!error && typeof data === 'number') return data;

  const { count, error: countError } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved');

  if (countError) return null;
  return count ?? null;
}

/** Display string e.g. "290+" or "500+" for homepage stat pills. */
export function formatQuestionCountStat(count: number | null): string {
  if (count == null) return '290+';
  if (count >= 500) return '500+';
  if (count >= 280) return `${count}+`;
  return '290+';
}
