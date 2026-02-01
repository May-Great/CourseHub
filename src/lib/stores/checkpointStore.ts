import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Checkpoint, CheckpointResponse } from '../types';

interface CheckpointState {
  checkpoints: Checkpoint[];
  responses: CheckpointResponse[];
  
  // Actions
  createCheckpoint: (checkpoint: Omit<Checkpoint, 'id' | 'responses'>) => string;
  updateCheckpoint: (id: string, updates: Partial<Checkpoint>) => void;
  deleteCheckpoint: (id: string) => void;
  
  submitCheckpointResponse: (response: Omit<CheckpointResponse, 'id' | 'submittedAt'>) => void;
  
  getCheckpointsByCohort: (cohortId: string) => Checkpoint[];
  getResponsesByCheckpoint: (checkpointId: string) => CheckpointResponse[];
  getResponsesByUser: (userId: string) => CheckpointResponse[];
  
  // Auto-generation
  generateWeeklyCheckpoints: (cohortId: string, startDate: string, endDate: string) => void;
}

const weeklyCheckpointQuestions = [
  "Что нового вы изучили на этой неделе?",
  "Какие трудности возникли в процессе обучения?",
  "Что помогло вам больше всего в изучении материала?",
  "Какие вопросы у вас остались?",
  "Как вы планируете применить полученные знания?"
];

export const useCheckpointStore = create<CheckpointState>()(
  persist(
    (set, get) => ({
      checkpoints: [],
      responses: [],
      
      createCheckpoint: (checkpointData) => {
        const id = `checkpoint_${Date.now()}`;
        const checkpoint: Checkpoint = {
          ...checkpointData,
          id,
          responses: []
        };
        
        set((state) => ({
          checkpoints: [...state.checkpoints, checkpoint]
        }));
        
        return id;
      },
      
      updateCheckpoint: (id, updates) => set((state) => ({
        checkpoints: state.checkpoints.map(checkpoint =>
          checkpoint.id === id ? { ...checkpoint, ...updates } : checkpoint
        )
      })),
      
      deleteCheckpoint: (id) => set((state) => ({
        checkpoints: state.checkpoints.filter(checkpoint => checkpoint.id !== id),
        responses: state.responses.filter(response => response.checkpointId !== id)
      })),
      
      submitCheckpointResponse: (responseData) => {
        const response: CheckpointResponse = {
          ...responseData,
          id: `response_${Date.now()}`,
          submittedAt: new Date().toISOString()
        };
        
        set((state) => ({
          responses: [...state.responses, response]
        }));
      },
      
      getCheckpointsByCohort: (cohortId) => {
        return get().checkpoints.filter(checkpoint => checkpoint.cohortId === cohortId);
      },
      
      getResponsesByCheckpoint: (checkpointId) => {
        return get().responses.filter(response => response.checkpointId === checkpointId);
      },
      
      getResponsesByUser: (userId) => {
        return get().responses.filter(response => response.userId === userId);
      },
      
      generateWeeklyCheckpoints: (cohortId, startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        
        let currentDate = new Date(start);
        let weekNumber = 1;
        
        while (currentDate < end) {
          // Создаем чекпоинт на конец каждой недели (пятница)
          const checkpointDate = new Date(currentDate);
          checkpointDate.setDate(checkpointDate.getDate() + (5 - checkpointDate.getDay())); // Пятница
          
          if (checkpointDate <= end) {
            const checkpoint: Checkpoint = {
              id: `checkpoint_${cohortId}_week_${weekNumber}`,
              cohortId,
              title: `Еженедельный чекпоинт - Неделя ${weekNumber}`,
              description: `Поделитесь своими успехами и трудностями за ${weekNumber} неделю обучения`,
              scheduledDate: checkpointDate.toISOString(),
              type: 'weekly_review',
              status: checkpointDate > new Date() ? 'upcoming' : 'active',
              responses: []
            };
            
            set((state) => ({
              checkpoints: [...state.checkpoints, checkpoint]
            }));
          }
          
          currentDate = new Date(currentDate.getTime() + weekMs);
          weekNumber++;
        }
      },
    }),
    {
      name: 'course-platform-checkpoints',
      version: 1,
    }
  )
);