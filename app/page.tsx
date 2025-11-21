import CodeEditor from '@/components/CodeEditor';
import PromptForm from '@/components/PromptForm';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Sidebar: Input */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">New Generation</h2>
              <div className="p-6 rounded-lg border bg-card shadow-sm">
                <PromptForm />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Enter a prompt and select a language to generate code.</p>
                <p className="mt-2">View your past generations in the <a href="/history" className="text-primary hover:underline">History</a> tab.</p>
              </div>
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
