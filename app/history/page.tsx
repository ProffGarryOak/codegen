'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { history, isLoadingHistory, fetchHistory } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchHistory(1).catch(() => {
        // If unauthorized, redirect to login
        router.push('/login');
    });
  }, [fetchHistory, router]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generation History</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Generator
        </Link>
      </div>

      {isLoadingHistory ? (
        <div className="text-center py-8">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No history found. Generate some code first!
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                  {item.languages?.name || 'Unknown'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium mb-2 line-clamp-2">{item.prompt}</p>
              <div className="bg-muted p-2 rounded-md overflow-x-auto">
                <pre className="text-xs font-mono">
                  <code>{item.code.slice(0, 200)}{item.code.length > 200 ? '...' : ''}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
