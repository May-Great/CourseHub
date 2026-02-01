import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchedLesson {
  lessonId: string;
  watchedAt: number;
}

interface StudentState {
  watchedMiniLessons: WatchedLesson[];
  savedMiniLessons: string[]; // IDs
  savedCourses: string[]; // IDs

  markMiniLessonAsWatched: (lessonId: string) => void;
  toggleSaveMiniLesson: (lessonId: string) => void;
  toggleSaveCourse: (courseId: string) => void;
  isMiniLessonSaved: (lessonId: string) => boolean;
  isCourseSaved: (courseId: string) => boolean;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      watchedMiniLessons: [],
      savedMiniLessons: [],
      savedCourses: [],

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

      isMiniLessonSaved: (lessonId) => {
        return get().savedMiniLessons.includes(lessonId);
      },

      isCourseSaved: (courseId) => {
        return get().savedCourses.includes(courseId);
      }
    }),
    {
      name: 'student-storage',
    }
  )
);
