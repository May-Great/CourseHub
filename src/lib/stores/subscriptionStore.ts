import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PricingPlan, UserSubscription, UsageStats, LeadForm, ProductFeedback } from '../types';

interface SubscriptionState {
  plans: PricingPlan[];
  userSubscription: UserSubscription | null;
  usageStats: UsageStats | null;
  leadForms: LeadForm[];
  feedback: ProductFeedback[];
  
  // Actions
  initializePlans: () => void;
  setUserSubscription: (subscription: UserSubscription) => void;
  updateUsageStats: (stats: UsageStats) => void;
  submitLeadForm: (form: Omit<LeadForm, 'id' | 'submittedAt' | 'status'>) => void;
  submitFeedback: (feedback: Omit<ProductFeedback, 'id' | 'submittedAt' | 'status'>) => void;
  
  // Getters
  getCurrentPlan: () => PricingPlan | null;
  canCreateCourse: () => boolean;
  canCreateCohort: () => boolean;
  getRemainingLimits: () => {
    courses: number;
    cohorts: number;
    students: number;
  };
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Идеально для начала',
    price: 0,
    currency: 'RUB',
    interval: 'month',
    isCurrentPlan: true,
    features: [
      { id: 'courses', name: '1 курс', description: 'Создайте один курс', included: true, limit: 1 },
      { id: 'cohorts', name: '1 поток', description: 'Запустите один поток', included: true, limit: 1 },
      { id: 'students', name: '10 студентов', description: 'До 10 студентов в потоке', included: true, limit: 10 },
      { id: 'storage', name: '1 ГБ хранилища', description: 'Для видео и материалов', included: true, limit: 1 },
      { id: 'analytics', name: 'Базовая аналитика', description: 'Основные метрики', included: true },
      { id: 'support', name: 'Email поддержка', description: 'Ответ в течение 48 часов', included: true },
    ],
    limits: {
      courses: 1,
      miniLessons: 10,
      cohorts: 1,
      studentsPerCohort: 10,
      totalStudents: 10,
      storage: 1,
      analytics: true,
      prioritySupport: false,
      customBranding: false,
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Для активных авторов',
    price: 2990,
    currency: 'RUB',
    interval: 'month',
    isPopular: true,
    features: [
      { id: 'courses', name: 'Безлимит курсов', description: 'Создавайте сколько угодно курсов', included: true },
      { id: 'cohorts', name: '5 потоков', description: 'До 5 одновременных потоков', included: true, limit: 5 },
      { id: 'students', name: '100 студентов', description: 'До 100 студентов на поток', included: true, limit: 100 },
      { id: 'storage', name: '50 ГБ хранилища', description: 'Для видео и материалов', included: true, limit: 50 },
      { id: 'analytics', name: 'Продвинутая аналитика', description: 'Детальные отчеты и метрики', included: true },
      { id: 'support', name: 'Приоритетная поддержка', description: 'Ответ в течение 4 часов', included: true },
      { id: 'integrations', name: 'Интеграции', description: 'Zoom, Google Meet, Slack', included: true },
    ],
    limits: {
      courses: -1,
      miniLessons: -1,
      cohorts: 5,
      studentsPerCohort: 100,
      totalStudents: 500,
      storage: 50,
      analytics: true,
      prioritySupport: true,
      customBranding: false,
    }
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Для команд и школ',
    price: 9990,
    currency: 'RUB',
    interval: 'month',
    features: [
      { id: 'courses', name: 'Безлимит курсов', description: 'Создавайте сколько угодно курсов', included: true },
      { id: 'cohorts', name: 'Безлимит потоков', description: 'Неограниченное количество потоков', included: true },
      { id: 'students', name: '1000 студентов', description: 'До 1000 студентов на поток', included: true, limit: 1000 },
      { id: 'storage', name: '500 ГБ хранилища', description: 'Для видео и материалов', included: true, limit: 500 },
      { id: 'analytics', name: 'Корпоративная аналитика', description: 'Полные отчеты и экспорт данных', included: true },
      { id: 'support', name: 'Персональный менеджер', description: 'Выделенный менеджер поддержки', included: true },
      { id: 'branding', name: 'Кастомный брендинг', description: 'Ваш логотип и цвета', included: true },
      { id: 'sso', name: 'SSO интеграция', description: 'Единый вход для команды', included: true },
    ],
    limits: {
      courses: -1,
      miniLessons: -1,
      cohorts: -1,
      studentsPerCohort: 1000,
      totalStudents: -1,
      storage: 500,
      analytics: true,
      prioritySupport: true,
      customBranding: true,
    }
  }
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: [],
      userSubscription: null,
      usageStats: null,
      leadForms: [],
      feedback: [],
      
      initializePlans: () => {
        set({ plans: defaultPlans });
      },
      
      setUserSubscription: (subscription) => {
        set({ userSubscription: subscription });
      },
      
      updateUsageStats: (stats) => {
        set({ usageStats: stats });
      },
      
      submitLeadForm: (formData) => {
        const leadForm: LeadForm = {
          ...formData,
          id: `lead_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'new'
        };
        
        set((state) => ({
          leadForms: [...state.leadForms, leadForm]
        }));
      },
      
      submitFeedback: (feedbackData) => {
        const feedback: ProductFeedback = {
          ...feedbackData,
          id: `feedback_${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'new'
        };
        
        set((state) => ({
          feedback: [...state.feedback, feedback]
        }));
      },
      
      getCurrentPlan: () => {
        const { plans, userSubscription } = get();
        if (!userSubscription) {
          return plans.find(p => p.id === 'free') || null;
        }
        return plans.find(p => p.id === userSubscription.planId) || null;
      },
      
      canCreateCourse: () => {
        const currentPlan = get().getCurrentPlan();
        const usageStats = get().usageStats;
        
        if (!currentPlan || !usageStats) return true; // Allow if no limits set yet
        
        if (currentPlan.limits.courses === -1) return true; // Unlimited
        
        return usageStats.coursesCreated < currentPlan.limits.courses;
      },
      
      canCreateCohort: () => {
        const currentPlan = get().getCurrentPlan();
        const usageStats = get().usageStats;
        
        if (!currentPlan || !usageStats) return true; // Allow if no limits set yet
        
        if (currentPlan.limits.cohorts === -1) return true; // Unlimited
        
        return usageStats.cohortsCreated < currentPlan.limits.cohorts;
      },
      
      getRemainingLimits: () => {
        const currentPlan = get().getCurrentPlan();
        const usageStats = get().usageStats;
        
        if (!currentPlan || !usageStats) {
          return { courses: -1, cohorts: -1, students: -1 };
        }
        
        return {
          courses: currentPlan.limits.courses === -1 
            ? -1 
            : Math.max(0, currentPlan.limits.courses - usageStats.coursesCreated),
          cohorts: currentPlan.limits.cohorts === -1 
            ? -1 
            : Math.max(0, currentPlan.limits.cohorts - usageStats.cohortsCreated),
          students: currentPlan.limits.totalStudents === -1 
            ? -1 
            : Math.max(0, currentPlan.limits.totalStudents - usageStats.totalStudents),
        };
      },
    }),
    {
      name: 'course-platform-subscription',
      version: 1,
    }
  )
);