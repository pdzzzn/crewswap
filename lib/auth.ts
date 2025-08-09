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
  
  return profile ? {
    id: user.id,
    email: user.email!,
    name: profile.name,
    role: profile.role,
    isAdmin: profile.is_admin ?? false
  } : null;
}

export async function requireAuth(redirectTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login';
    redirect(target);
  }
  return user;
}