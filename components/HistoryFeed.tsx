'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Clock, Copy, Check } from 'lucide-react';

export default function HistoryFeed() {
  const { history, fetchHistory, isLoadingHistory, setGeneratedCode, setSelectedLanguage, setPrompt } = useStore();
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory(page);
  }, [fetchHistory, page]);

  const handleLoadGeneration = (gen: any) => {
    setGeneratedCode(gen.code);
    setPrompt(gen.prompt);
    if (gen.languages) {
        setSelectedLanguage(gen.languages.slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        History
      </h2>

      {isLoadingHistory && history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No history yet.</div>
      ) : (
        <div className="space-y-3">
          {history.map((gen) => (
            <div
              key={gen.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {gen.languages?.name || 'Unknown'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(gen.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm line-clamp-2 text-card-foreground group-hover:text-foreground">
                {gen.prompt}
              </p>
              {/* Full code block with copy button */}
              <div className="mt-2 relative">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(gen.code);
                    setCopiedId(gen.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="absolute right-2 top-2 p-1 rounded hover:bg-muted"
                  title="Copy code"
                >
                  {copiedId === gen.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <pre className="overflow-x-auto bg-muted rounded p-2 text-sm">
                  <code>{gen.code}</code>
                </pre>
              </div>
              <button
                onClick={() => handleLoadGeneration(gen)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Load this generation
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoadingHistory}
          className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={history.length < 10 || isLoadingHistory}
          className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
