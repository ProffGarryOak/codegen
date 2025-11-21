'use client';

import HistoryFeed from '@/components/HistoryFeed';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generation History</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to Generator
        </Link>
      </div>
      <HistoryFeed />
    </div>
  );
}
