import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment, Review } from '../types';

interface SocialState {
  comments: Record<string, Comment[]>; // lessonId -> comments
  reviews: Record<string, Review[]>; // courseId -> reviews
  
  // Actions
  addComment: (lessonId: string, comment: Comment) => void;
  addReply: (lessonId: string, parentId: string, reply: Comment) => void;
  deleteComment: (lessonId: string, commentId: string) => void;
  
  addReview: (courseId: string, review: Review) => void;
  deleteReview: (courseId: string, reviewId: string) => void;
  
  getLessonComments: (lessonId: string) => Comment[];
  getCourseReviews: (courseId: string) => Review[];
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      comments: {},
      reviews: {},

      addComment: (lessonId, comment) => set((state) => ({
        comments: {
          ...state.comments,
          [lessonId]: [...(state.comments[lessonId] || []), comment]
        }
      })),

      addReply: (lessonId, parentId, reply) => set((state) => {
        const lessonComments = state.comments[lessonId] || [];
        const updateComments = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), reply] };
            }
            if (c.replies) {
              return { ...c, replies: updateComments(c.replies) };
            }
            return c;
          });
        };
        
        return {
          comments: {
            ...state.comments,
            [lessonId]: updateComments(lessonComments)
          }
        };
      }),

      deleteComment: (lessonId, commentId) => set((state) => {
        const lessonComments = state.comments[lessonId] || [];
        // Recursive deletion filter not strictly needed for MVP if we just hide top level
        // But let's do a simple top-level filter for now
        return {
          comments: {
            ...state.comments,
            [lessonId]: lessonComments.filter(c => c.id !== commentId)
          }
        };
      }),

      addReview: (courseId, review) => set((state) => ({
        reviews: {
          ...state.reviews,
          [courseId]: [...(state.reviews[courseId] || []), review]
        }
      })),

      deleteReview: (courseId, reviewId) => set((state) => ({
        reviews: {
          ...state.reviews,
          [courseId]: (state.reviews[courseId] || []).filter(r => r.id !== reviewId)
        }
      })),

      getLessonComments: (lessonId) => get().comments[lessonId] || [],
      getCourseReviews: (courseId) => get().reviews[courseId] || [],
    }),
    {
      name: 'social-storage',
    }
  )
);
