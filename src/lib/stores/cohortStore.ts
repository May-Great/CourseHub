import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cohort, CohortSettings, CohortSchedule, Checkpoint, CheckpointResponse } from '../types';

interface CohortState {
  cohorts: Cohort[];
  currentCohort: Cohort | null;
  
  // Actions
  createCohort: (cohort: Omit<Cohort, 'id'>) => void;
  updateCohort: (id: string, updates: Partial<Cohort>) => void;
  deleteCohort: (id: string) => void;
  getCohort: (id: string) => Cohort | undefined;
  getCohortsByCourse: (courseId: string) => Cohort[];
  setCurrentCohort: (cohort: Cohort | null) => void;
  
  // Participant management
  addParticipant: (cohortId: string, userId: string) => void;
  removeParticipant: (cohortId: string, userId: string) => void;
  
  // Schedule management
  updateSchedule: (cohortId: string, schedule: CohortSchedule[]) => void;
  addScheduleItem: (cohortId: string, item: CohortSchedule) => void;
  removeScheduleItem: (cohortId: string, itemId: string) => void;
  
  // Checkpoint management
  addCheckpoint: (cohortId: string, checkpoint: Omit<Checkpoint, 'id'>) => void;
  updateCheckpoint: (checkpointId: string, updates: Partial<Checkpoint>) => void;
  deleteCheckpoint: (checkpointId: string) => void;
  addCheckpointResponse: (checkpointId: string, response: Omit<CheckpointResponse, 'id'>) => void;
  
  // Utility functions
  getActiveCohorts: () => Cohort[];
  getUpcomingCohorts: () => Cohort[];
  getCompletedCohorts: () => Cohort[];
}

export const useCohortStore = create<CohortState>()(
  persist(
    (set, get) => ({
      cohorts: [],
      currentCohort: null,

      createCohort: (cohortData) => {
        const newCohort: Cohort = {
          ...cohortData,
          id: `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => ({
          cohorts: [...state.cohorts, newCohort],
        }));
      },

      updateCohort: (id, updates) => {
        set((state) => ({
          cohorts: state.cohorts.map((cohort) =>
            cohort.id === id ? { ...cohort, ...updates } : cohort
          ),
          currentCohort: state.currentCohort?.id === id 
            ? { ...state.currentCohort, ...updates }
            : state.currentCohort,
        }));
      },

      deleteCohort: (id) => {
        set((state) => ({
          cohorts: state.cohorts.filter((cohort) => cohort.id !== id),
          currentCohort: state.currentCohort?.id === id ? null : state.currentCohort,
        }));
      },

      getCohort: (id) => {
        return get().cohorts.find((cohort) => cohort.id === id);
      },

      getCohortsByCourse: (courseId) => {
        return get().cohorts.filter((cohort) => cohort.courseId === courseId);
      },

      setCurrentCohort: (cohort) => {
        set({ currentCohort: cohort });
      },

      addParticipant: (cohortId, userId) => {
        const cohort = get().getCohort(cohortId);
        if (!cohort) return;

        // Mock user data - in real app, fetch from user service
        const mockUser = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          role: 'buyer' as const,
        };

        if (!cohort.participants.find(p => p.id === userId)) {
          get().updateCohort(cohortId, {
            participants: [...cohort.participants, mockUser],
          });
        }
      },

      removeParticipant: (cohortId, userId) => {
        const cohort = get().getCohort(cohortId);
        if (!cohort) return;

        get().updateCohort(cohortId, {
          participants: cohort.participants.filter(p => p.id !== userId),
        });
      },

      updateSchedule: (cohortId, schedule) => {
        get().updateCohort(cohortId, { schedule });
      },

      addScheduleItem: (cohortId, item) => {
        const cohort = get().getCohort(cohortId);
        if (!cohort) return;

        get().updateCohort(cohortId, {
          schedule: [...cohort.schedule, item],
        });
      },

      removeScheduleItem: (cohortId, itemId) => {
        const cohort = get().getCohort(cohortId);
        if (!cohort) return;

        get().updateCohort(cohortId, {
          schedule: cohort.schedule.filter(item => item.id !== itemId),
        });
      },

      addCheckpoint: (cohortId, checkpointData) => {
        const newCheckpoint: Checkpoint = {
          ...checkpointData,
          id: `checkpoint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          cohortId,
        };

        const cohort = get().getCohort(cohortId);
        if (!cohort) return;

        get().updateCohort(cohortId, {
          checkpoints: [...cohort.checkpoints, newCheckpoint],
        });
      },

      updateCheckpoint: (checkpointId, updates) => {
        set((state) => ({
          cohorts: state.cohorts.map((cohort) => ({
            ...cohort,
            checkpoints: cohort.checkpoints.map((checkpoint) =>
              checkpoint.id === checkpointId 
                ? { ...checkpoint, ...updates }
                : checkpoint
            ),
          })),
        }));
      },

      deleteCheckpoint: (checkpointId) => {
        set((state) => ({
          cohorts: state.cohorts.map((cohort) => ({
            ...cohort,
            checkpoints: cohort.checkpoints.filter(
              checkpoint => checkpoint.id !== checkpointId
            ),
          })),
        }));
      },

      addCheckpointResponse: (checkpointId, responseData) => {
        const newResponse: CheckpointResponse = {
          ...responseData,
          id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          checkpointId,
        };

        set((state) => ({
          cohorts: state.cohorts.map((cohort) => ({
            ...cohort,
            checkpoints: cohort.checkpoints.map((checkpoint) =>
              checkpoint.id === checkpointId
                ? {
                    ...checkpoint,
                    responses: [...checkpoint.responses, newResponse],
                  }
                : checkpoint
            ),
          })),
        }));
      },

      getActiveCohorts: () => {
        return get().cohorts.filter((cohort) => cohort.status === 'active');
      },

      getUpcomingCohorts: () => {
        return get().cohorts.filter((cohort) => cohort.status === 'upcoming');
      },

      getCompletedCohorts: () => {
        return get().cohorts.filter((cohort) => cohort.status === 'completed');
      },
    }),
    {
      name: 'cohort-store',
      version: 1,
    }
  )
);