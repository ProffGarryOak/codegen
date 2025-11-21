'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          id="name"
          type="text"
          name="name"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          id="password"
          type="password"
          name="password"
          required
          minLength={6}
        />
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <button
        className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Creating account...' : 'Register'}
      </button>
      <div className="text-sm text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
}
