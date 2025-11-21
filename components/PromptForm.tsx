'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Send } from 'lucide-react';

export default function PromptForm() {
  const {
    prompt,
    setPrompt,
    selectedLanguage,
    setSelectedLanguage,
    generateCode,
    isGenerating,
    languages,
    fetchLanguages,
  } = useStore();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await generateCode();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="language" className="text-sm font-medium">
          Language
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full  p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isGenerating}
        >
          {languages.length === 0 ? (
            <option disabled>Loading languages...</option>
          ) : (
            languages.map((lang) => (
              <option key={lang.id} value={lang.slug}>
                {lang.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the code you want to generate..."
          className="w-full min-h-[120px] p-3 rounded-md border bg-background resize-y focus:ring-2 focus:ring-primary focus:outline-none"
          disabled={isGenerating}
        />
      </div>

      <button
        type="submit"
        disabled={!prompt.trim() || isGenerating}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          'Generating...'
        ) : (
          <>
            <Send className="w-4 h-4" />
            Generate Code
          </>
        )}
      </button>
    </form>
  );
}
