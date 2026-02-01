import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, VideoNote, VideoBookmark } from '../types';

interface ProgressState {
  userProgress: UserProgress[];
  
  // Actions
  updateProgress: (progress: UserProgress) => void;
  completeLesson: (userId: string, courseId: string, lessonId: string) => void;
  updateVideoPosition: (courseId: string, lessonId: string, position: number) => void;
  getVideoPosition: (courseId: string, lessonId: string) => number;
  getUserProgress: (userId: string, courseId: string) => UserProgress | undefined;
  
  // Video notes and bookmarks
  addVideoNote: (userId: string, courseId: string, note: Omit<VideoNote, 'id'>) => void;
  updateVideoNote: (userId: string, courseId: string, noteId: string, updates: Partial<VideoNote>) => void;
  deleteVideoNote: (userId: string, courseId: string, noteId: string) => void;
  addVideoBookmark: (userId: string, courseId: string, bookmark: Omit<VideoBookmark, 'id'>) => void;
  deleteVideoBookmark: (userId: string, courseId: string, bookmarkId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userProgress: [],
      
      updateProgress: (progress) => set((state) => {
        const existingIndex = state.userProgress.findIndex(
          p => p.userId === progress.userId && p.courseId === progress.courseId
        );
        
        if (existingIndex >= 0) {
          const newProgress = [...state.userProgress];
          newProgress[existingIndex] = progress;
          return { userProgress: newProgress };
        } else {
          return { userProgress: [...state.userProgress, progress] };
        }
      }),
      
      completeLesson: (userId, courseId, lessonId) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          const currentProgress = newProgress[progressIndex];
          
          if (!currentProgress.completedLessons.includes(lessonId)) {
            newProgress[progressIndex] = {
              ...currentProgress,
              completedLessons: [...currentProgress.completedLessons, lessonId],
            };
          }
          
          return { userProgress: newProgress };
        } else {
          // Create new progress entry
          const newProgressEntry: UserProgress = {
            userId,
            courseId,
            completedLessons: [lessonId],
            completedAssignments: [],
            enrolledAt: new Date().toISOString(),
            notes: [],
            bookmarks: [],
            streak: 1,
            totalTimeSpent: 0,
            achievements: [],
          };
          
          return { userProgress: [...state.userProgress, newProgressEntry] };
        }
      }),
      
      addVideoNote: (userId, courseId, note) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          const newNote: VideoNote = {
            ...note,
            id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          newProgress[progressIndex] = {
            ...newProgress[progressIndex],
            notes: [...newProgress[progressIndex].notes, newNote]
          };
          
          return { userProgress: newProgress };
        } else {
          // Create new progress entry with note
          const newNote: VideoNote = {
            ...note,
            id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          const newProgressEntry: UserProgress = {
            userId,
            courseId,
            completedLessons: [],
            completedAssignments: [],
            enrolledAt: new Date().toISOString(),
            notes: [newNote],
            bookmarks: [],
            streak: 0,
            totalTimeSpent: 0,
            achievements: [],
          };
          
          return { userProgress: [...state.userProgress, newProgressEntry] };
        }
      }),
      
      updateVideoNote: (userId, courseId, noteId, updates) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          const noteIndex = newProgress[progressIndex].notes.findIndex(n => n.id === noteId);
          
          if (noteIndex >= 0) {
            newProgress[progressIndex] = {
              ...newProgress[progressIndex],
              notes: newProgress[progressIndex].notes.map(note =>
                note.id === noteId ? { ...note, ...updates } : note
              )
            };
          }
          
          return { userProgress: newProgress };
        }
        return state;
      }),
      
      deleteVideoNote: (userId, courseId, noteId) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          newProgress[progressIndex] = {
            ...newProgress[progressIndex],
            notes: newProgress[progressIndex].notes.filter(note => note.id !== noteId)
          };
          
          return { userProgress: newProgress };
        }
        return state;
      }),
      
      addVideoBookmark: (userId, courseId, bookmark) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          const newBookmark: VideoBookmark = {
            ...bookmark,
            id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          newProgress[progressIndex] = {
            ...newProgress[progressIndex],
            bookmarks: [...newProgress[progressIndex].bookmarks, newBookmark]
          };
          
          return { userProgress: newProgress };
        } else {
          // Create new progress entry with bookmark
          const newBookmark: VideoBookmark = {
            ...bookmark,
            id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          const newProgressEntry: UserProgress = {
            userId,
            courseId,
            completedLessons: [],
            completedAssignments: [],
            enrolledAt: new Date().toISOString(),
            notes: [],
            bookmarks: [newBookmark],
            streak: 0,
            totalTimeSpent: 0,
            achievements: [],
          };
          
          return { userProgress: [...state.userProgress, newProgressEntry] };
        }
      }),
      
      deleteVideoBookmark: (userId, courseId, bookmarkId) => set((state) => {
        const progressIndex = state.userProgress.findIndex(
          p => p.userId === userId && p.courseId === courseId
        );
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          newProgress[progressIndex] = {
            ...newProgress[progressIndex],
            bookmarks: newProgress[progressIndex].bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
          };
          
          return { userProgress: newProgress };
        }
        return state;
      }),
      
      updateVideoPosition: (courseId, lessonId, position) => {
        const key = `video_${courseId}_${lessonId}`;
        localStorage.setItem(key, position.toString());
      },
      
      getVideoPosition: (courseId, lessonId) => {
        const key = `video_${courseId}_${lessonId}`;
        const position = localStorage.getItem(key);
        return position ? parseInt(position, 10) : 0;
      },
      
      getUserProgress: (userId, courseId) => {
        return get().userProgress.find(p => p.userId === userId && p.courseId === courseId);
      },
    }),
    {
      name: 'course-platform-progress',
      version: 1,
    }
  )
);