import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Course, QuickCreateData, QuickCreateFile, Module, Lesson } from '../types';
import { mockCourses } from '../mockData';

interface CourseState {
  // Courses data
  courses: Course[];
  purchasedCourses: string[]; // IDs of purchased courses
  
  // Quick Create state
  quickCreateData: QuickCreateData | null;
  
  // Initialization
  isInitialized: boolean;
  initialize: () => void;

  // Actions
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Module Actions
  addModule: (courseId: string, module: Module) => void;
  updateModule: (courseId: string, moduleId: string, updates: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  reorderModules: (courseId: string, newOrder: Module[]) => void;

  // Lesson Actions
  addLesson: (courseId: string, moduleId: string, lesson: Lesson) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  reorderLessons: (courseId: string, moduleId: string, newOrder: Lesson[]) => void;

  // Purchasing
  purchaseCourse: (courseId: string) => void;
  
  // Quick Create
  setQuickCreateData: (data: QuickCreateData | null) => void;
  addQuickCreateFiles: (files: QuickCreateFile[]) => void;
  clearQuickCreate: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      purchasedCourses: [],
      quickCreateData: null,
      isInitialized: false,

      initialize: () => {
        if (!get().isInitialized) {
          // If store is empty (first load), hydrate with mock data
          const currentCourses = get().courses;
          if (currentCourses.length === 0) {
             set({ courses: mockCourses, isInitialized: true });
          } else {
             set({ isInitialized: true });
          }
        }
      },

      addCourse: (course) => set((state) => ({
        courses: [...state.courses, course]
      })),

      updateCourse: (id, updates) => set((state) => ({
        courses: state.courses.map(course => 
          course.id === id ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
        )
      })),

      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter(course => course.id !== id),
        purchasedCourses: state.purchasedCourses.filter(cId => cId !== id)
      })),

      // Module Implementation
      addModule: (courseId, module) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: [...course.modules, module],
            updatedAt: new Date().toISOString()
          };
        })
      })),

      updateModule: (courseId, moduleId, updates) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(mod => 
              mod.id === moduleId ? { ...mod, ...updates } : mod
            ),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      deleteModule: (courseId, moduleId) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.filter(mod => mod.id !== moduleId),
            updatedAt: new Date().toISOString()
          };
        })
      })),
      
      reorderModules: (courseId, newOrder) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: newOrder.map((mod, index) => ({ ...mod, order: index + 1 })),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      // Lesson Implementation
      addLesson: (courseId, moduleId, lesson) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(mod => {
              if (mod.id !== moduleId) return mod;
              return {
                ...mod,
                lessons: [...mod.lessons, lesson]
              };
            }),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      updateLesson: (courseId, moduleId, lessonId, updates) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(mod => {
              if (mod.id !== moduleId) return mod;
              return {
                ...mod,
                lessons: mod.lessons.map(les => 
                  les.id === lessonId ? { ...les, ...updates } : les
                )
              };
            }),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      deleteLesson: (courseId, moduleId, lessonId) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(mod => {
              if (mod.id !== moduleId) return mod;
              return {
                ...mod,
                lessons: mod.lessons.filter(les => les.id !== lessonId)
              };
            }),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      reorderLessons: (courseId, moduleId, newOrder) => set((state) => ({
        courses: state.courses.map(course => {
          if (course.id !== courseId) return course;
          return {
            ...course,
            modules: course.modules.map(mod => {
              if (mod.id !== moduleId) return mod;
              return {
                ...mod,
                lessons: newOrder.map((les, index) => ({ ...les, order: index + 1 }))
              };
            }),
            updatedAt: new Date().toISOString()
          };
        })
      })),

      purchaseCourse: (courseId) => set((state) => {
        if (state.purchasedCourses.includes(courseId)) return state;
        return {
          purchasedCourses: [...state.purchasedCourses, courseId]
        };
      }),
      
      setQuickCreateData: (data) => set({ quickCreateData: data }),
      
      addQuickCreateFiles: (files) => set((state) => ({
        quickCreateData: state.quickCreateData ? {
          ...state.quickCreateData,
          files: [...state.quickCreateData.files, ...files]
        } : {
          files,
          autoGenerate: {
            titles: true,
            descriptions: true,
            structure: true
          }
        }
      })),
      
      clearQuickCreate: () => set({ quickCreateData: null }),
    }),
    {
      name: 'course-platform-courses-v2', // New version name to force migration
      version: 2, // Versioning
      migrate: (persistedState: any, version) => {
        if (version === 0 || version === 1) {
          // Migration logic from v1 to v2
          // v1 only had purchasedCourses and quickCreateData
          return {
            ...persistedState,
            courses: [], // Initialize empty, will be hydrated by initialize()
            isInitialized: false
          };
        }
        return persistedState;
      },
    }
  )
);
