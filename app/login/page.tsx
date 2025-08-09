import { Suspense } from 'react';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
