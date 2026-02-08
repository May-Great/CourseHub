import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  userRole: 'author' | 'buyer' | 'admin' | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'yandex') => Promise<{ data?: unknown; error: Error | null }>;
  signUp: (email: string, password: string, role: 'author' | 'buyer', name: string) => Promise<{ error: Error | null; emailConfirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'author' | 'buyer' | 'admin') => void; 
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  userRole: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase not configured. Running in Mock Mode.');
      // Try to restore session from localStorage for mock mode
      const storedUser = localStorage.getItem('mock_user_session');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          set({ currentUser: user, userRole: user.role });
        } catch (e) {
          localStorage.removeItem('mock_user_session');
        }
      }
      set({ initialized: true });
      return;
    }

    set({ loading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const role = (user.user_metadata.role || 'buyer') as 'author' | 'buyer' | 'admin';
      set({
        currentUser: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.full_name || user.email!.split('@')[0],
          role: role,
        },
        userRole: role,
      });
    }
    
    set({ loading: false, initialized: true });
  },

  signIn: async (email: string, password?: string) => {
    // --- Mock Mode Logic ---
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      set({ loading: true });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check for specific test credentials
      if (email === 'adminIMN1' && password === 'adminIMN1') {
        const user: User = {
          id: 'admin-author-id',
          email: 'adminIMN1@platform.local',
          name: 'Admin Author',
          role: 'author',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin1'
        };
        set({ currentUser: user, userRole: 'author', loading: false });
        localStorage.setItem('mock_user_session', JSON.stringify(user));
        return { error: null };
      }

      if (email === 'adminIMN2' && password === 'adminIMN2') {
        const user: User = {
          id: 'admin-student-id',
          email: 'adminIMN2@platform.local',
          name: 'Admin Student',
          role: 'buyer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2'
        };
        set({ currentUser: user, userRole: 'buyer', loading: false });
        localStorage.setItem('mock_user_session', JSON.stringify(user));
        return { error: null };
      }

      // Default mock behavior for other emails (Magic Link simulation)
      if (!password) {
        set({ loading: false });
        return { error: null }; 
      }
      
      // Fallback: any other password login attempt in mock mode fails
      set({ loading: false });
      return { error: new Error('Неверный логин или пароль (Демо: используйте adminIMN1/adminIMN1)') };
    }

    // --- Supabase Logic ---
    const supabase = createClient();
    
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data.user) {
        const role = data.user.user_metadata.role as 'author' | 'buyer' || 'buyer';
        set({
          currentUser: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata.full_name || email.split('@')[0],
            role: role,
          },
          userRole: role,
        });
      }
      
      return { error };
    } else {
      // Magic Link fallback
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      return { error: error ? new Error(error.message) : null };
    }
  },

  signInWithOAuth: async (provider: 'google' | 'yandex') => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { error: new Error('OAuth не работает в демо-режиме (нужен Supabase)') };
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    
    return { data, error: error ? new Error(error.message) : null };
  },

  signUp: async (email, password, role, name) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock Registration
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: `mock-${Date.now()}`,
        email,
        name,
        role,
      };
      set({ currentUser: user, userRole: role, loading: false });
      localStorage.setItem('mock_user_session', JSON.stringify(user));
      return { error: null };
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: name,
        },
      },
    });

    if (error) return { error };

    // If successful, check if session exists. 
    // If NO session, it means email confirmation is required.
    if (data.user && !data.session) {
       return { error: null, emailConfirmationRequired: true };
    }

    if (data.user && data.session) {
       set({
          currentUser: {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            role: role,
          },
          userRole: role,
       });
    }

    return { error: null };
  },

  signOut: async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      localStorage.removeItem('mock_user_session');
      set({ currentUser: null, userRole: null });
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    set({ currentUser: null, userRole: null });
  },
  
  setUserRole: (role) => set({ userRole: role }),
}));
