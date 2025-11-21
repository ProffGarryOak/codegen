'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function CodeEditor() {
  const { generatedCode, selectedLanguage, isGenerating } = useStore();
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check theme initially and observe changes
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!generatedCode && !isGenerating) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg bg-card p-8">
        <p>Generated code will appear here...</p>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg overflow-hidden bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
        <span className="text-sm font-medium capitalize">{selectedLanguage}</span>
        <button
          onClick={handleCopy}
          disabled={!generatedCode || isGenerating}
          className="p-1.5 hover:bg-background rounded-md transition-colors disabled:opacity-50"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="relative min-h-[400px]">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : null}
        
        <SyntaxHighlighter
          language={selectedLanguage}
          style={isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            height: '400px',
            fontSize: '0.9rem',
            backgroundColor: 'transparent',
          }}
        >
          {generatedCode || 'Generating...'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
