import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IqraProgress {
    [volume: number]: {
        [pageIndex: number]: {
            stars: number; // 0-3
            completed: boolean;
        }
    }
}

interface IqraState {
    // State
    progress: IqraProgress;
    unlockedPages: { [volume: number]: number }; // Max unlocked page index per volume
    totalStars: number;
    lastRead: { volume: number; page: number } | null;

    // Actions
    completePage: (volume: number, pageIndex: number, stars: number) => void;
    unlockNextPage: (volume: number, currentPageIndex: number) => void;
    getStars: (volume: number, pageIndex: number) => number;
    isUnlocked: (volume: number, pageIndex: number) => boolean;
    setLastRead: (volume: number, page: number) => void;
}

export const useIqraStore = create<IqraState>()(
    persist(
        (set, get) => ({
            progress: {},
            unlockedPages: {
                1: 0, // Vol 1, Page 0 is always unlocked
                2: 0, 3: 0, 4: 0, 5: 0, 6: 0
            },
            totalStars: 0,
            lastRead: null,

            completePage: (volume, pageIndex, stars) => set((state) => {
                const volProgress = state.progress[volume] || {};
                const currentStars = volProgress[pageIndex]?.stars || 0;

                // Check star difference
                const starDiff = Math.max(0, stars - currentStars);

                const newProgress = {
                    ...state.progress,
                    [volume]: {
                        ...volProgress,
                        [pageIndex]: {
                            stars: Math.max(currentStars, stars),
                            completed: true
                        }
                    }
                };

                return {
                    progress: newProgress,
                    totalStars: state.totalStars + starDiff,
                    lastRead: { volume, page: pageIndex }
                };
            }),

            unlockNextPage: (volume, currentPageIndex) => set((state) => {
                const currentMax = state.unlockedPages[volume] || 0;

                // If we are at the latest unlocked page, unlock the next one
                if (currentPageIndex >= currentMax) {
                    return {
                        unlockedPages: {
                            ...state.unlockedPages,
                            [volume]: currentPageIndex + 1
                        }
                    };
                }
                return state;
            }),

            getStars: (volume, pageIndex) => {
                const state = get();
                return state.progress[volume]?.[pageIndex]?.stars || 0;
            },

            isUnlocked: (volume, pageIndex) => {
                const state = get();
                const maxUnlocked = state.unlockedPages[volume] ?? 0;
                return pageIndex <= maxUnlocked;
            },

            setLastRead: (volume, page) => set({ lastRead: { volume, page } }),
        }),
        {
            name: 'quranpulse-iqra-storage', // unique name
        }
    )
);
