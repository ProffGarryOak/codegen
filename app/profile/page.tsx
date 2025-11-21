'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch user');
      })
      .then((data) => setUser(data))
      .catch(() => router.push('/login'))
      .finally(() => setIsLoading(false));
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            ...(password ? { password } : {})
        }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully');
        const updatedUser = await res.json();
        setUser(updatedUser);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (e) {
      setMessage('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Generator
        </Link>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="mb-6">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              id="name"
              type="text"
              name="name"
              defaultValue={user?.name || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              New Password (leave blank to keep current)
            </label>
            <input
              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              id="password"
              type="password"
              name="password"
              minLength={6}
            />
          </div>
          {message && (
            <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-destructive'}`}>
              {message}
            </div>
          )}
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
