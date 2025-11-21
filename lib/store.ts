import { create } from 'zustand';

interface Language {
    id: number;
    name: string;
    slug: string;
}

interface Generation {
    id: string;
    prompt: string;
    code: string;
    language_id: number;
    created_at: string;
    languages?: Language;
}

interface AppState {
    // State
    prompt: string;
    selectedLanguage: string;
    generatedCode: string;
    isGenerating: boolean;
    history: Generation[];
    isLoadingHistory: boolean;
    languages: Language[];

    // Actions
    setPrompt: (prompt: string) => void;
    setSelectedLanguage: (slug: string) => void;
    setGeneratedCode: (code: string) => void;
    generateCode: () => Promise<void>;
    fetchHistory: (page?: number) => Promise<void>;
    fetchLanguages: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    prompt: '',
    selectedLanguage: 'python',
    generatedCode: '',
    isGenerating: false,
    history: [],
    isLoadingHistory: false,
    languages: [],

    setPrompt: (prompt) => set({ prompt }),
    setSelectedLanguage: (slug) => set({ selectedLanguage: slug }),
    setGeneratedCode: (code) => set({ generatedCode: code }),

    generateCode: async () => {
        const { prompt, selectedLanguage, fetchHistory } = get();
        if (!prompt) return;

        set({ isGenerating: true, generatedCode: '' });

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, language_slug: selectedLanguage }),
            });

            const data = await res.json();

            if (data.error) {
                console.error(data.error);
                set({ generatedCode: `Error: ${data.error}` });
            } else {
                set({ generatedCode: data.code });
                // Refresh history to show the new generation
                fetchHistory(1);
            }
        } catch (error) {
            console.error(error);
            set({ generatedCode: 'Error generating code. Please try again.' });
        } finally {
            set({ isGenerating: false });
        }
    },

    fetchHistory: async (page = 1) => {
        set({ isLoadingHistory: true });
        try {
            const res = await fetch(`/api/history?page=${page}&limit=10`);
            const { data } = await res.json();
            if (data) {
                set({ history: data });
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoadingHistory: false });
        }
    },

    fetchLanguages: async () => {
        try {
            const res = await fetch('/api/languages');
            const data = await res.json();
            if (Array.isArray(data)) {
                set({ languages: data });
            }
        } catch (error) {
            console.error(error);
        }
    },
}));
