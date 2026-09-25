import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { isAdminEmail } from '@/lib/auth/admin-emails';

export type AccessSnapshot = {
  isAuthenticated: boolean;
  /** True when the user may use training routes and paid API handlers. */
  hasPaidAccess: boolean;
  email: string | null;
  userId: string | null;
  /** True when access is granted via ADMIN_EMAILS (staff tooling). */
  isAdmin: boolean;
};

/**
 * Single source of truth for "can this user use the training app?".
 * All signed-in users have full training access (free while testing).
 */
export async function getAccessSnapshot(): Promise<AccessSnapshot> {
  if (!isSupabaseConfigured()) {
    return { isAuthenticated: false, hasPaidAccess: false, email: null, userId: null, isAdmin: false };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { isAuthenticated: false, hasPaidAccess: false, email: null, userId: null, isAdmin: false };
  }

  const email = user.email ?? null;
  const userId = user.id;
  const admin = isAdminEmail(email);

  return {
    isAuthenticated: true,
    hasPaidAccess: true,
    email,
    userId,
    isAdmin: admin,
  };
}
