import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthorProfile } from '../types';
import { mockAuthorProfiles } from '../mockData';

interface AuthorProfileState {
  profiles: AuthorProfile[];
  followedAuthorIds: string[]; // List of IDs the current user follows
  
  initialize: () => void;
  getAuthorProfile: (id: string) => AuthorProfile | undefined;
  upsertAuthorProfile: (profile: AuthorProfile) => void;
  updateAuthorProfile: (id: string, updates: Partial<AuthorProfile>) => void;
  listAuthors: () => AuthorProfile[];
  
  // New actions for stats
  incrementViews: (id: string) => void;
  toggleFollow: (id: string) => void; // Simplified: toggles based on current state
  isFollowing: (id: string) => boolean;
}

export const useAuthorProfileStore = create<AuthorProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      followedAuthorIds: [],
      
      initialize: () => {
        const { profiles } = get();
        if (profiles.length === 0) {
          set({ profiles: mockAuthorProfiles });
        }
      },
      
      getAuthorProfile: (id) => {
        return get().profiles.find((p) => p.id === id);
      },
      
      upsertAuthorProfile: (profile) => set((state) => {
        const existingIndex = state.profiles.findIndex((p) => p.id === profile.id);
        if (existingIndex >= 0) {
          const newProfiles = [...state.profiles];
          newProfiles[existingIndex] = { ...profile, updatedAt: Date.now() };
          return { profiles: newProfiles };
        }
        return { profiles: [...state.profiles, { ...profile, createdAt: Date.now(), updatedAt: Date.now() }] };
      }),
      
      updateAuthorProfile: (id, updates) => set((state) => ({
        profiles: state.profiles.map((p) => 
          p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        )
      })),
      
      listAuthors: () => {
        return get().profiles;
      },
      
      incrementViews: (id) => set((state) => ({
        profiles: state.profiles.map((p) =>
          p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
        )
      })),
      
      isFollowing: (id) => {
        return get().followedAuthorIds.includes(id);
      },
      
      toggleFollow: (id) => set((state) => {
        const isFollowing = state.followedAuthorIds.includes(id);
        
        // Update local subscriptions
        const newFollowedIds = isFollowing
          ? state.followedAuthorIds.filter(fid => fid !== id)
          : [...state.followedAuthorIds, id];
          
        // Update author stats (simulated backend update)
        const newProfiles = state.profiles.map((p) =>
          p.id === id 
            ? { ...p, followersCount: Math.max(0, (p.followersCount || 0) + (isFollowing ? -1 : 1)) } 
            : p
        );
        
        return {
          followedAuthorIds: newFollowedIds,
          profiles: newProfiles
        };
      }),
    }),
    {
      name: 'author-profile-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        followedAuthorIds: state.followedAuthorIds,
      }),
    }
  )
);
