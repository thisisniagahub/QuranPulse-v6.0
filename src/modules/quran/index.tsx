/**
 * 📖 Al-Quran Module - Refactored with Manager Pattern
 * 
 * FEATURES:
 * ✅ Modular component architecture
 * ✅ Centralized State Management (QuranContext)
 * ✅ Improved Performance via Lazy Loading (QuranModalsManager)
 */

import React from 'react';

// Context
import { QuranProvider, useQuran } from './contexts/QuranContext';

// Core Views
import QuranList from './features/list/QuranList';
const QuranReader = React.lazy(() => import('./features/reader/QuranReader'));

// Managers
import { QuranModalsManager } from './features/QuranModalsManager';

// Libs
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QuranContent: React.FC = () => {
    const {
        // View State
        view, setView,
        setSelectedChapter,

        // Data
        chapters, loadingChapters,

        // Search
        searchQuery, setSearchQuery,
        isSemanticMode, setIsSemanticMode,
        handleSemanticSearch,
        isSearchingSemantic,
        semanticResults,

    } = useQuran();

    return (
        <div className="h-full flex flex-col bg-midnight-gradient overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* === LIST VIEW === */}
            {view === 'LIST' && (
                <div className="flex-1 overflow-y-auto relative z-10 w-full">
                    {loadingChapters ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <QuranList
                            chapters={chapters}
                            loading={loadingChapters}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onChapterSelect={(c) => {
                                setSelectedChapter(c);
                                setView('READING');
                            }}
                            isSemanticMode={isSemanticMode}
                            setIsSemanticMode={setIsSemanticMode}
                            handleSemanticSearch={handleSemanticSearch}
                            isSearchingSemantic={isSearchingSemantic}
                            semanticResults={semanticResults}
                        />
                    )}
                </div>
            )}

            {/* === READING VIEW === */}
            {view === 'READING' && (
                <React.Suspense
                    fallback={
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                        </div>
                    }
                >
                    <QuranReader />
                </React.Suspense>
            )}

            {/* === MODAL MANAGER (Lazy Loaded Overlays) === */}
            <QuranModalsManager />

        </div>
    );
};

// Create a fallback QueryClient for the module
const moduleQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const Quran: React.FC = () => {
    return (
        <QueryClientProvider client={moduleQueryClient}>
            <QuranProvider>
                <QuranContent />
            </QuranProvider>
        </QueryClientProvider>
    );
};

export default Quran;
