'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function HistoryFeed() {
  const { history, fetchHistory, isLoadingHistory, setGeneratedCode, setSelectedLanguage, setPrompt } = useStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchHistory(page);
  }, [fetchHistory, page]);

  const handleLoadGeneration = (gen: any) => {
    setGeneratedCode(gen.code);
    setPrompt(gen.prompt);
    // Assuming the backend returns the language object or we find it
    if (gen.languages) {
        setSelectedLanguage(gen.languages.slug);
    }
    // Scroll to top
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
              onClick={() => handleLoadGeneration(gen)}
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
          disabled={history.length < 10 || isLoadingHistory} // Simple check, ideally use total pages from meta
          className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
