import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (profile) {
    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      role: profile.role,
      isAdmin: profile.is_admin ?? false,
    };
  }

  // Fallback: if profile row is missing or RLS-blocked, still treat as authenticated
  // and return minimal info derived from auth.user metadata to avoid redirect loops.
  const md = (user as any).user_metadata || {};
  const fallbackName = (typeof md.name === 'string' && md.name) || user.email || 'User';
  const fallbackRole = typeof md.role === 'string' ? md.role : 'CABIN_ATTENDANT';
  return {
    id: user.id,
    email: user.email!,
    name: fallbackName,
    role: fallbackRole,
    isAdmin: false,
  };
}

export async function requireAuth(redirectTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login';
    redirect(target);
  }
  return user;
}