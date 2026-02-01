import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '../types';

interface ChatState {
  chatMessages: ChatMessage[];
  
  // Actions
  addChatMessage: (message: ChatMessage) => void;
  getCohortMessages: (cohortId: string) => ChatMessage[];
  getCourseMessages: (courseId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatMessages: [],
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      
      getCohortMessages: (cohortId) => {
        return get().chatMessages.filter(m => m.cohortId === cohortId);
      },
      
      getCourseMessages: (courseId) => {
        return get().chatMessages.filter(m => m.courseId === courseId);
      },
    }),
    {
      name: 'course-platform-chat',
      version: 1,
    }
  )
);