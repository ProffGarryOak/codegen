'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// We need to use a server action or the API for credentials login.
// Since we haven't set up server actions for this yet, we'll use the signIn function from next-auth/react if we were using the client provider,
// but for v5 with credentials, it's often cleaner to use a server action.
// However, to avoid complex server action setup right now, let's use a simple form that submits to a server action we'll define in the component or just use the next-auth/react signIn if we wrap the app in SessionProvider.
// Actually, let's use a server action in a separate file or just use the API route approach if possible?
// No, v5 recommends server actions. Let's create a server action for login.
// Wait, I can just use `signIn` from `next-auth/react`? No, that's for client side.
// Let's use a simple server action in `app/lib/actions.ts` (I'll create it).

// For now, let's just make the UI and I'll create the action next.
// Actually, I'll use `next-auth/react`'s `signIn` which works on client side too for credentials if configured.
// But wait, I didn't add `SessionProvider`.
// Let's stick to the simplest v5 pattern: Server Action.

import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    try {
        const result = await authenticate(undefined, formData);
        if (result?.error) {
            setErrorMessage(result.error);
        } else {
            // Redirect handled by server action or middleware
            // But if we are here, maybe we need to refresh
            // router.push('/');
        }
    } catch (e) {
        setErrorMessage('Something went wrong.');
    } finally {
        setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
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
      {errorMessage && (
        <div className="text-destructive text-sm">{errorMessage}</div>
      )}
      <button
        className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
