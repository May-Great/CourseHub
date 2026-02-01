import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assignment, AssignmentSubmission } from '../types';

interface AssignmentState {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  
  // Actions
  createAssignment: (assignment: Omit<Assignment, 'id'>) => string;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  
  getAssignmentsByLesson: (lessonId: string) => Assignment[];
  getSubmissionsByUser: (userId: string) => AssignmentSubmission[];
  getSubmissionsByAssignment: (assignmentId: string) => AssignmentSubmission[];
}

export const useAssignmentStore = create<AssignmentState>()(
  persist(
    (set, get) => ({
      assignments: [],
      submissions: [],
      
      createAssignment: (assignmentData) => {
        const id = `assignment_${Date.now()}`;
        const assignment: Assignment = {
          ...assignmentData,
          id,
        };
        
        set((state) => ({
          assignments: [...state.assignments, assignment]
        }));
        
        return id;
      },
      
      updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map(assignment =>
          assignment.id === id ? { ...assignment, ...updates } : assignment
        )
      })),
      
      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(assignment => assignment.id !== id),
        submissions: state.submissions.filter(submission => submission.assignmentId !== id)
      })),
      
      submitAssignment: (submissionData) => {
        const submission: AssignmentSubmission = {
          ...submissionData,
          id: `submission_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'submitted'
        };
        
        set((state) => ({
          submissions: [...state.submissions, submission]
        }));
      },
      
      gradeSubmission: (submissionId, score, feedback) => set((state) => ({
        submissions: state.submissions.map(submission =>
          submission.id === submissionId
            ? {
                ...submission,
                score,
                feedback,
                status: 'reviewed' as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'current-author' // В реальном приложении это ID текущего автора
              }
            : submission
        )
      })),
      
      getAssignmentsByLesson: (lessonId) => {
        return get().assignments.filter(assignment => 
          // В реальном приложении здесь была бы связь assignment -> lesson
          // Пока используем простую логику
          true
        );
      },
      
      getSubmissionsByUser: (userId) => {
        return get().submissions.filter(submission => submission.userId === userId);
      },
      
      getSubmissionsByAssignment: (assignmentId) => {
        return get().submissions.filter(submission => submission.assignmentId === assignmentId);
      },
    }),
    {
      name: 'course-platform-assignments',
      version: 1,
    }
  )
);