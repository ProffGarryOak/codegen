import CodeEditor from '@/components/CodeEditor';
import HistoryFeed from '@/components/HistoryFeed';
import PromptForm from '@/components/PromptForm';
import ThemeToggle from '@/components/ThemeToggle';
import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight">CodeGen Copilot</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Sidebar: Input & History */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">New Generation</h2>
              <div className="p-6 rounded-lg border bg-card shadow-sm">
                <PromptForm />
              </div>
            </section>

            <section>
              <HistoryFeed />
            </section>
          </div>

          {/* Right Content: Code Display */}
          <div className="lg:col-span-8">
            <section className="h-full flex flex-col space-y-4">
              <h2 className="text-lg font-semibold">Output</h2>
              <div className="flex-1">
                <CodeEditor />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
