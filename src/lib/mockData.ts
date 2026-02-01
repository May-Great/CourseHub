import { 
  User, 
  Course, 
  Cohort, 
  ChatMessage, 
  UserProgress,
  Lesson,
  Module,
  Assignment,
  Material,
  MiniLesson,
  AuthorProfile
} from './types';

// Mock Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Петрова',
    email: 'anna@example.com',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Михаил Иванов',
    email: 'mikhail@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    email: 'elena@example.com',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

export const mockAuthorProfiles: AuthorProfile[] = [
  {
    id: '1',
    displayName: 'Анна Петрова',
    handle: '@annapetrova',
    bio: 'Senior Frontend Developer с 10-летним опытом. Автор курсов по React, TypeScript и архитектуре приложений. Помогаю новичкам стать профессионалами.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    coverUrl: 'https://images.unsplash.com/photo-1499750310159-5254f4cc157e?w=1600&h=400&fit=crop',
    highlight: '10 лет в разработке / 500+ учеников',
    tags: ['Frontend', 'React', 'Design Systems', 'Mentoring'],
    directions: ['Программирование', 'Дизайн'],
    social: {
      telegram: 'https://t.me/annapetrova',
      youtube: 'https://youtube.com/@annapetrova',
      website: 'https://annapetrova.dev'
    },
    views: 1250,
    followersCount: 342,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React и TypeScript: Полное руководство',
    description: 'Изучите современную разработку веб-приложений с React и TypeScript. От основ до продвинутых техник.',
    shortDescription: 'Современная разработка с React и TypeScript',
    authorId: '1',
    authorName: 'Анна Петрова',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    price: 4990,
    category: 'Программирование',
    studentsCount: 156,
    rating: 4.8,
    tags: ['React', 'TypeScript', 'Frontend'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    status: 'published',
    settings: {
      hasDeadlines: true,
      autoAdvance: true,
      allowLateSubmissions: true,
      requireSequentialProgress: true,
      certificateEnabled: true,
      discussionEnabled: true
    },
    modules: [
      {
        id: 'm1',
        title: 'Основы React',
        description: 'Изучаем компоненты, состояние и события',
        order: 1,
        lessons: [
          {
            id: 'l1',
            title: 'Введение в React',
            description: 'Что такое React и зачем он нужен',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 1200,
            order: 1,
            materials: [
              {
                type: 'pdf',
                title: 'Конспект урока',
                url: 'https://example.com/lesson1.pdf'
              },
              {
                type: 'link',
                title: 'Официальная документация React',
                url: 'https://react.dev'
              }
            ] as Material[],
            assignment: {
              id: 'a1',
              title: 'Создайте первый компонент',
              description: 'Создайте простой компонент Hello World и отправьте скриншот',
              status: 'not_started',
              submissionType: 'file',
              dueDate: '2024-02-20T23:59:59Z'
            } as Assignment
          },
          {
            id: 'l2',
            title: 'Компоненты и JSX',
            description: 'Создание и использование компонентов',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 1800,
            order: 2
          }
        ]
      },
      {
        id: 'm2',
        title: 'TypeScript интеграция',
        description: 'Добавляем типизацию в React проекты',
        order: 2,
        lessons: [
          {
            id: 'l3',
            title: 'Настройка TypeScript',
            description: 'Конфигурация и первые шаги',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 900,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'UX/UI Дизайн: От идеи до прототипа',
    description: 'Полный курс по UX/UI дизайну с практическими заданиями и разбором реальных кейсов.',
    shortDescription: 'Создавайте удобные и красивые интерфейсы',
    authorId: '1',
    authorName: 'Анна Петрова',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    price: 6990,
    category: 'Дизайн',
    studentsCount: 89,
    rating: 4.9,
    tags: ['UX', 'UI', 'Figma', 'Дизайн'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
    status: 'published',
    settings: {
      hasDeadlines: false,
      autoAdvance: true,
      allowLateSubmissions: true,
      requireSequentialProgress: false,
      certificateEnabled: true,
      discussionEnabled: true
    },
    modules: [
      {
        id: 'm3',
        title: 'Основы UX',
        description: 'Пользовательский опыт и исследования',
        order: 1,
        lessons: [
          {
            id: 'l4',
            title: 'Что такое UX',
            description: 'Введение в пользовательский опыт',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 1500,
            order: 1
          }
        ]
      }
    ]
  }
];

export const mockCohorts: Cohort[] = [
  {
    id: 'c1',
    courseId: '1',
    title: 'React Поток #3 - Февраль 2024',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    maxParticipants: 25,
    status: 'active',
    participants: [mockUsers[1], mockUsers[2]],
    settings: {
      hasDeadlines: true,
      checkpointFrequency: 'weekly',
      autoAdvance: true,
      allowLateJoin: true,
      requireCompletion: true,
      certificateEnabled: true
    },
    schedule: [],
    checkpoints: []
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg1',
    userId: '2',
    userName: 'Михаил Иванов',
    message: 'Привет всем! Кто-нибудь уже начал первое задание?',
    timestamp: '2024-02-16T10:30:00Z',
    cohortId: 'c1',
    type: 'message'
  },
  {
    id: 'msg2',
    userId: '3',
    userName: 'Елена Сидорова',
    message: 'Да, уже делаю. Очень интересно!',
    timestamp: '2024-02-16T10:35:00Z',
    cohortId: 'c1',
    type: 'message'
  },
  {
    id: 'msg3',
    userId: '1',
    userName: 'Анна Петрова',
    message: 'Отлично! Если будут вопросы - пишите, помогу разобраться.',
    timestamp: '2024-02-16T10:40:00Z',
    cohortId: 'c1',
    type: 'message'
  }
];

export const mockProgress: UserProgress[] = [
  {
    userId: '2',
    courseId: '1',
    completedLessons: ['l1'],
    completedAssignments: [],
    currentLesson: 'l2',
    lastWatched: {
      lessonId: 'l2',
      position: 450
    },
    enrolledAt: '2024-02-15T09:00:00Z',
    notes: [],
    bookmarks: [],
    streak: 3,
    totalTimeSpent: 125,
    achievements: []
  }
];

export const mockMiniLessons: MiniLesson[] = [
  {
    id: 'ml1',
    authorId: '1',
    title: '5 ошибок новичков в React',
    description: 'Разбираем самые популярные ошибки при работе с хуками и состоянием.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    aiAnalysisText: 'В этом уроке автор фокусируется на проблеме излишних рендеров. Ключевые моменты: 1. Не используйте useEffect без зависимостей. 2. Мемоизируйте тяжелые вычисления. 3. Правильно разделяйте компоненты.',
    linkedCourseId: '1',
    ctaText: 'Хотите знать больше? Пройдите полный курс React',
    status: 'published',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    views: 1250
  },
  {
    id: 'ml2',
    authorId: '1',
    title: 'Figma Auto Layout за 5 минут',
    description: 'Быстрый гайд по самой мощной функции Figma.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    aiAnalysisText: 'Урок демонстрирует базовые принципы Auto Layout: настройки направления, отступов и выравнивания. Показано на примере создания кнопки и карточки товара.',
    linkedCourseId: '2',
    ctaText: 'Станьте профи в Figma на полном курсе',
    status: 'published',
    createdAt: '2024-02-12T15:30:00Z',
    updatedAt: '2024-02-12T15:30:00Z',
    views: 890
  },
  {
    id: 'ml3',
    authorId: '1',
    title: 'Как выбрать шрифт для проекта',
    description: 'Простые правила типографики для не-дизайнеров.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    aiAnalysisText: 'Основные советы: ограничьтесь 2 шрифтами, используйте контрастные пары (с засечками + без), следите за читаемостью.',
    status: 'draft',
    createdAt: '2024-02-14T09:15:00Z',
    updatedAt: '2024-02-14T09:15:00Z',
    views: 0
  }
];
