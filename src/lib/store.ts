import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Course, UserProgress, ChatMessage, MiniLesson } from './types';

interface AppState {
  // User & Role
  currentUser: User | null;
  userRole: 'author' | 'buyer' | null;
  
  // Purchased courses (for buyers)
  purchasedCourses: string[];
  
  // User progress
  userProgress: UserProgress[];
  
  // Chat messages (in-memory for MVP)
  chatMessages: ChatMessage[];

  // Plan Limits
  planLimits: {
    free: {
      courses: number;
      miniLessons: number;
    };
    pro: {
      courses: number;
      miniLessons: number;
    };
  };
  
  // Actions
  setUserRole: (role: 'author' | 'buyer') => void;
  setCurrentUser: (user: User | null) => void;
  purchaseCourse: (courseId: string) => void;
  updateProgress: (progress: UserProgress) => void;
  addChatMessage: (message: ChatMessage) => void;
  
  // Video player position
  updateVideoPosition: (courseId: string, lessonId: string, position: number) => void;
  getVideoPosition: (courseId: string, lessonId: string) => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      userRole: null,
      purchasedCourses: [],
      userProgress: [],
      chatMessages: [],
      
      planLimits: {
        free: {
          courses: 1,
          miniLessons: 10,
        },
        pro: {
          courses: Infinity,
          miniLessons: Infinity,
        }
      },
      
      setUserRole: (role) => set({ userRole: role }),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      purchaseCourse: (courseId) => set((state) => ({
        purchasedCourses: [...state.purchasedCourses, courseId]
      })),
      
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
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      
      updateVideoPosition: (courseId, lessonId, position) => {
        const key = `video_${courseId}_${lessonId}`;
        localStorage.setItem(key, position.toString());
      },
      
      getVideoPosition: (courseId, lessonId) => {
        const key = `video_${courseId}_${lessonId}`;
        const position = localStorage.getItem(key);
        return position ? parseInt(position, 10) : 0;
      }
    }),
    {
      name: 'course-platform-storage',
      partialize: (state) => ({
        userRole: state.userRole,
        currentUser: state.currentUser,
        purchasedCourses: state.purchasedCourses,
        userProgress: state.userProgress,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
