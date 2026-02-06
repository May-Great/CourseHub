import { Course, User, AuthorProfile, MiniLesson, Cohort, ChatMessage } from './types';

export const mockCourses: Course[] = [];
export const mockUsers: User[] = [];
export const mockAuthorProfile: AuthorProfile = {
  id: 'mock-author-id',
  displayName: 'Mock Author',
  bio: 'Mock Bio',
  tags: [],
  directions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
export const mockMiniLessons: MiniLesson[] = [];

// Added missing exports for build
export const mockAuthorProfiles: AuthorProfile[] = [mockAuthorProfile];
export const mockCohorts: Cohort[] = [];
export const mockMessages: ChatMessage[] = [];
