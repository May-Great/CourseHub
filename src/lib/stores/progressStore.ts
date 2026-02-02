import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, VideoNote, VideoBookmark, Achievement } from '../types';

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
        
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        if (progressIndex >= 0) {
          const newProgress = [...state.userProgress];
          const currentProgress = newProgress[progressIndex];
          
          if (!currentProgress.completedLessons.includes(lessonId)) {
            // Calculate Points
            let pointsToAdd = 50; // Base points for lesson
            
            // Calculate Streak
            let newStreak = currentProgress.streak;
            const lastActivity = new Date(currentProgress.lastActivityDate || currentProgress.enrolledAt);
            const lastActivityDate = lastActivity.toISOString().split('T')[0];
            
            const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
              newStreak += 1;
              pointsToAdd += 10; // Bonus for streak
            } else if (diffDays > 1) {
              newStreak = 1; // Reset streak
            }
            // If diffDays === 0 (same day), keep streak
            
            // Check Achievements
            const newAchievements: Achievement[] = [...currentProgress.achievements];
            
            // 1. First Lesson Badge
            if (currentProgress.completedLessons.length === 0 && !newAchievements.some(a => a.id === 'first_lesson')) {
               newAchievements.push({
                 id: 'first_lesson',
                 type: 'lesson_completed',
                 title: 'Первый шаг',
                 description: 'Вы прошли свой первый урок!',
                 icon: 'Award',
                 earnedAt: now.toISOString(),
                 points: 100
               });
               pointsToAdd += 100;
            }
            
            // 2. Streak Badges (3 days)
            if (newStreak === 3 && !newAchievements.some(a => a.id === 'streak_3')) {
               newAchievements.push({
                 id: 'streak_3',
                 type: 'streak',
                 title: 'На волне',
                 description: '3 дня подряд обучения',
                 icon: 'Zap',
                 earnedAt: now.toISOString(),
                 points: 150
               });
               pointsToAdd += 150;
            }

            newProgress[progressIndex] = {
              ...currentProgress,
              completedLessons: [...currentProgress.completedLessons, lessonId],
              points: (currentProgress.points || 0) + pointsToAdd,
              streak: newStreak,
              lastActivityDate: now.toISOString(),
              achievements: newAchievements
            };
          }
          
          return { userProgress: newProgress };
        } else {
          // Create new progress entry
          // First lesson completion for a new course
          const newProgressEntry: UserProgress = {
            userId,
            courseId,
            completedLessons: [lessonId],
            completedAssignments: [],
            enrolledAt: now.toISOString(),
            notes: [],
            bookmarks: [],
            streak: 1,
            totalTimeSpent: 0,
            points: 150, // 50 lesson + 100 first lesson bonus
            lastActivityDate: now.toISOString(),
            achievements: [
              {
                 id: 'first_lesson',
                 type: 'lesson_completed',
                 title: 'Первый шаг',
                 description: 'Вы прошли свой первый урок!',
                 icon: 'Award',
                 earnedAt: now.toISOString(),
                 points: 100
               }
            ],
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
            points: 0,
            lastActivityDate: new Date().toISOString(),
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
            points: 0,
            lastActivityDate: new Date().toISOString(),
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
