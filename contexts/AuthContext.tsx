'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/lib/auth';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) fetchUserProfile(session.user);
        else setLoading(false);
      })
      .catch((err) => {
        console.error('getSession failed:', err);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) await fetchUserProfile(session.user);
        else { setUser(null); setLoading(false); }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseAuthUser) => {
    try {
      // Try to fetch existing profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          isAdmin: profile.is_admin ?? false
        });
        return;
      }

      // If no profile row exists, create one using auth user metadata
      const md = authUser.user_metadata || {};
      const defaultName = (typeof md.name === 'string' && md.name) || authUser.email || 'User';
      // Constrain role to enum used by the DB types
      const allowedRoles = new Set(['CAPTAIN', 'FIRST_OFFICER', 'CABIN_ATTENDANT']);
      const roleFromMeta = typeof md.role === 'string' ? md.role.toUpperCase() : '';
      const defaultRole = (allowedRoles.has(roleFromMeta) ? roleFromMeta : 'CABIN_ATTENDANT') as 'CAPTAIN' | 'FIRST_OFFICER' | 'CABIN_ATTENDANT';
      // Constrain base to known enum values if present, else null
      const allowedBases = new Set(['PMI', 'ARN', 'PRG', 'SZG', 'VIE', 'WP_PMI', 'WP_BCN', 'WP_PRG']);
      const baseFromMeta = typeof md.base === 'string' ? md.base.toUpperCase() : '';
      const defaultBase = (allowedBases.has(baseFromMeta) ? baseFromMeta : null) as 'PMI' | 'ARN' | 'PRG' | 'SZG' | 'VIE' | 'WP_PMI' | 'WP_BCN' | 'WP_PRG' | null;

      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email!,
            name: defaultName,
            role: defaultRole,
            base: defaultBase,
            is_admin: false,
          }
        ])
        .select()
        .single();

      if (insertError) {
        // If insert is blocked by RLS, advise to add a policy allowing self-insert.
        console.warn('Auto-create user profile failed (likely RLS):', insertError);
      }

      const finalProfile = inserted ?? profile;
      if (finalProfile) {
        setUser({
          id: finalProfile.id,
          email: finalProfile.email,
          name: finalProfile.name,
          role: finalProfile.role,
          isAdmin: finalProfile.is_admin ?? false
        });
      } else {
        // Fallback: if profile row is missing or RLS blocked, still set a minimal
        // authenticated user so the app can proceed. This mirrors the server-side
        // fallback in lib/auth.ts.
        const md = authUser.user_metadata || {};
        const fallbackName = (typeof md.name === 'string' && md.name) || authUser.email || 'User';
        const fallbackRole = typeof md.role === 'string' ? md.role : 'CABIN_ATTENDANT';
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: fallbackName,
          role: fallbackRole,
          isAdmin: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // 1) Sign in via server route to set HttpOnly cookies (SSR-aware)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      let msg = 'Login failed';
      try {
        const data = await res.json();
        msg = data?.error || msg;
      } catch {}
      return { error: { message: msg } };
    }

    // 2) Also sign in on the client to keep client-side session/state in sync
    //    (Supabase JS cannot read HttpOnly cookies.)
    try {
      const clientResult = await supabase.auth.signInWithPassword({ email, password });
      if (!clientResult.error) {
        try {
          // Refresh user/profile state
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) await fetchUserProfile(authUser);
        } catch (err) {
          console.error('getUser after client sign-in failed:', err);
        }
      }
      return clientResult;
    } catch (err: any) {
      console.error('Client signInWithPassword failed:', err);
      return { error: { message: err?.message || 'Client sign-in failed' } };
    }
  };
  
  const signOut = async () => {
    // 1) Invalidate server-side cookies
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    // 2) Clear client-side session
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
