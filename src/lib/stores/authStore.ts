import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  userRole: 'author' | 'buyer' | null;
  
  // Actions
  setUserRole: (role: 'author' | 'buyer') => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,
      
      setUserRole: (role) => set({ userRole: role }),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      logout: () => set({ currentUser: null, userRole: null }),
    }),
    {
      name: 'course-platform-auth',
      version: 1,
    }
  )
);