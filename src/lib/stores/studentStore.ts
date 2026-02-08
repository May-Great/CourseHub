import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export interface WatchedLesson {
  lessonId: string;
  watchedAt: number;
}

interface StudentState {
  watchedMiniLessons: WatchedLesson[];
  savedMiniLessons: string[]; // IDs
  savedCourses: string[]; // IDs
  purchasedCourses: string[]; // IDs
  completedLessons: string[]; // IDs of completed course lessons

  markMiniLessonAsWatched: (lessonId: string) => void;
  toggleSaveMiniLesson: (lessonId: string) => void;
  toggleSaveCourse: (courseId: string) => void;
  purchaseCourse: (courseId: string) => void;
  isMiniLessonSaved: (lessonId: string) => boolean;
  isCourseSaved: (courseId: string) => boolean;
  isCoursePurchased: (courseId: string) => boolean;
  
  // Progress related
  fetchProgress: (courseId: string) => Promise<void>;
  markLessonCompleted: (lessonId: string, completed: boolean, courseId?: string, totalLessons?: number) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      watchedMiniLessons: [],
      savedMiniLessons: [],
      savedCourses: [],
      purchasedCourses: [],
      completedLessons: [],

      markMiniLessonAsWatched: (lessonId) => set((state) => {
        // Remove if exists to push to top (most recent)
        const filtered = state.watchedMiniLessons.filter(i => i.lessonId !== lessonId);
        return {
          watchedMiniLessons: [{ lessonId, watchedAt: Date.now() }, ...filtered]
        };
      }),

      toggleSaveMiniLesson: (lessonId) => set((state) => {
        const exists = state.savedMiniLessons.includes(lessonId);
        return {
          savedMiniLessons: exists
            ? state.savedMiniLessons.filter(id => id !== lessonId)
            : [...state.savedMiniLessons, lessonId]
        };
      }),

      toggleSaveCourse: (courseId) => set((state) => {
        const exists = state.savedCourses.includes(courseId);
        return {
          savedCourses: exists
            ? state.savedCourses.filter(id => id !== courseId)
            : [...state.savedCourses, courseId]
        };
      }),

      purchaseCourse: (courseId) => set((state) => ({
        purchasedCourses: state.purchasedCourses.includes(courseId) 
          ? state.purchasedCourses 
          : [...state.purchasedCourses, courseId]
      })),

      isMiniLessonSaved: (lessonId) => {
        return get().savedMiniLessons.includes(lessonId);
      },

      isCourseSaved: (courseId) => {
        return get().savedCourses.includes(courseId);
      },

      isCoursePurchased: (courseId) => {
        return get().purchasedCourses.includes(courseId);
      },

      // Progress Implementation
      fetchProgress: async (courseId: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch completed lessons for this course (need to join with lessons -> modules -> course)
        // Or simpler: just fetch all progress for user and filter client side if list is small
        // For now, let's fetch all progress for user to keep it simple and robust
        
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('is_completed', true);

        if (!error && data) {
          const completedIds = data.map(p => p.lesson_id);
          set((state) => ({
            // Merge with existing (union) to avoid losing offline progress, or replace?
            // Let's replace to keep in sync with server
            completedLessons: [...new Set([...state.completedLessons, ...completedIds])]
          }));
        }
      },

      markLessonCompleted: async (lessonId: string, completed: boolean, courseId?: string, totalLessons?: number) => {
        // 1. Optimistic update
        const currentCompleted = get().completedLessons;
        set((state) => {
          const exists = state.completedLessons.includes(lessonId);
          if (completed && !exists) {
            return { completedLessons: [...state.completedLessons, lessonId] };
          }
          if (!completed && exists) {
            return { completedLessons: state.completedLessons.filter(id => id !== lessonId) };
          }
          return {};
        });

        // 2. Sync with Supabase
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (completed) {
          await supabase
            .from('lesson_progress')
            .upsert({ 
              user_id: user.id, 
              lesson_id: lessonId, 
              is_completed: true,
              last_watched_at: new Date().toISOString()
            }, { onConflict: 'user_id, lesson_id' });
        } else {
          await supabase
            .from('lesson_progress')
            .update({ is_completed: false })
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId);
        }

        // 3. Update Course Progress in Enrollments (if courseId provided)
        if (courseId && totalLessons && totalLessons > 0) {
           // Calculate new progress count
           // We can't rely on state.completedLessons immediately because it might be partial
           // So let's fetch count from DB or approximate
           
           // Simple approximation: current + 1
           const exists = currentCompleted.includes(lessonId);
           let newCount = currentCompleted.length; // This is global count, incorrect for specific course
           
           // Better way: Just fetch the count of completed lessons for this course from DB
           // But that requires joining. 
           // Let's rely on the client knowing the count for now (passed from UI)
           
           // Actually, the simplest is to update enrollment progress based on what we know
           // But calculating percentage on server (trigger) is best.
           // Client-side update for now:
           
           // We need to know how many lessons of THIS course are completed.
           // Since we don't have that easily in store, we skip updating enrollment for now.
           // We will rely on calculating progress on read (like we did in course page).
           
           // TODO: Implement server-side trigger to update enrollment.progress
        }
      },

      isLessonCompleted: (lessonId: string) => {
        return get().completedLessons.includes(lessonId);
      }
    }),
    {
      name: 'student-storage',
    }
  )
);
