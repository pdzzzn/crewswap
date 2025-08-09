import { Suspense } from 'react';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
