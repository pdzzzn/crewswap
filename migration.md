### Phase 6: Frontend Migration

#### Step 6.1: Create Authentication Context
Create `contexts/AuthContext.tsx`:

```typescript
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/lib/auth';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) await fetchUserProfile(session.user.id);
        else { setUser(null); setLoading(false); }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('users').select('*').eq('id', userId).single();
    
    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        isAdmin: profile.is_admin
      });
    }
    setLoading(false);
  };

  const signIn = (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password });
  
  const signOut = () => supabase.auth.signOut();

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
```

#### Step 6.2: Update Layout to Use AuthProvider
Wrap your application with the `AuthProvider` in `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

#### Step 6.3: Protect Routes with Authentication
Use the `useAuth` hook to protect routes that require authentication:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

function ProtectedPage() {
  const { user } = useAuth();

  if (!user) return redirect('/login');

  // Page content
}
```

#### Step 6.4: Implement Login and Logout Functionality
Create login and logout pages that use the `signIn` and `signOut` functions from the `AuthContext`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

#### Step 6.5: Display User Information
Use the `useAuth` hook to display the currently logged-in user's information:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

#### Step 6.6: Handle Authentication Errors
Catch and handle any authentication errors that may occur:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### Phase 7: Environment & Configuration

#### Step 7.1: Update Environment Variables for Local Development
```bash
# .env.local - Use local Supabase instance
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... # From supabase start output
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... # From supabase start output

# Remove old Prisma variables
# DATABASE_URL=...
# JWT_SECRET=...
```

#### Step 7.2: Generate TypeScript Types from Local Schema
```bash
# Generate types from local Supabase instance
supabase gen types typescript --local > types/database.ts
