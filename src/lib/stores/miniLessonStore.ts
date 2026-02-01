import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MiniLesson } from '../types';
import { mockMiniLessons } from '../mockData';

interface MiniLessonState {
  miniLessons: MiniLesson[];
  
  initialize: () => void;
  createMiniLesson: (lesson: MiniLesson) => void;
  updateMiniLesson: (id: string, updates: Partial<MiniLesson>) => void;
  deleteMiniLesson: (id: string) => void;
  publishMiniLesson: (id: string) => void;
  getMiniLessonById: (id: string) => MiniLesson | undefined;
  listMiniLessonsByAuthor: (authorId: string) => MiniLesson[];
  listPublishedMiniLessons: () => MiniLesson[];
}

export const useMiniLessonStore = create<MiniLessonState>()(
  persist(
    (set, get) => ({
      miniLessons: [],
      
      initialize: () => {
        const { miniLessons } = get();
        if (miniLessons.length === 0) {
          set({ miniLessons: mockMiniLessons });
        }
      },
      
      createMiniLesson: (lesson) => set((state) => ({
        miniLessons: [...state.miniLessons, lesson]
      })),
      
      updateMiniLesson: (id, updates) => set((state) => ({
        miniLessons: state.miniLessons.map((lesson) => 
          lesson.id === id ? { ...lesson, ...updates, updatedAt: new Date().toISOString() } : lesson
        )
      })),
      
      deleteMiniLesson: (id) => set((state) => ({
        miniLessons: state.miniLessons.filter((lesson) => lesson.id !== id)
      })),
      
      publishMiniLesson: (id) => set((state) => ({
        miniLessons: state.miniLessons.map((lesson) => 
          lesson.id === id ? { ...lesson, status: 'published', updatedAt: new Date().toISOString() } : lesson
        )
      })),
      
      getMiniLessonById: (id) => {
        return get().miniLessons.find((lesson) => lesson.id === id);
      },
      
      listMiniLessonsByAuthor: (authorId) => {
        return get().miniLessons.filter((lesson) => lesson.authorId === authorId);
      },
      
      listPublishedMiniLessons: () => {
        return get().miniLessons.filter((lesson) => lesson.status === 'published');
      }
    }),
    {
      name: 'mini-lesson-storage',
      partialize: (state) => ({
        miniLessons: state.miniLessons,
      }),
    }
  )
);
