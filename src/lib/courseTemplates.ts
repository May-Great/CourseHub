import { CourseTemplate, Course, Module } from './types';

export const courseTemplates: CourseTemplate[] = [
  {
    id: 'marathon-14',
    name: 'Марафон 14 дней',
    description: 'Интенсивное обучение с ежедневными заданиями и поддержкой группы',
    icon: '🏃‍♂️',
    duration: '14 дней',
    structure: {
      modulesCount: 2,
      lessonsPerModule: 7,
      suggestedSchedule: '1 урок в день'
    },
    defaultModules: [
      {
        title: 'Неделя 1: Основы',
        description: 'Изучаем базовые концепции и делаем первые шаги',
        suggestedLessons: [
          'Введение и цели',
          'Основные принципы',
          'Первая практика',
          'Разбор ошибок',
          'Углубляемся в тему',
          'Практическое задание',
          'Итоги недели'
        ]
      },
      {
        title: 'Неделя 2: Практика',
        description: 'Применяем знания на практике и закрепляем результат',
        suggestedLessons: [
          'Продвинутые техники',
          'Реальные кейсы',
          'Работа с проблемами',
          'Оптимизация подхода',
          'Финальный проект',
          'Презентация результатов',
          'Планы на будущее'
        ]
      }
    ],
    cohortSettings: {
      defaultDuration: 14,
      checkpointFrequency: 'daily',
      hasDeadlines: true
    }
  },
  {
    id: 'intensive-7',
    name: 'Интенсив 7 дней',
    description: 'Быстрое погружение в тему за неделю с максимальной концентрацией',
    icon: '⚡',
    duration: '7 дней',
    structure: {
      modulesCount: 1,
      lessonsPerModule: 7,
      suggestedSchedule: '1-2 урока в день'
    },
    defaultModules: [
      {
        title: 'Интенсивная неделя',
        description: 'Полное погружение в тему за 7 дней',
        suggestedLessons: [
          'День 1: Старт и мотивация',
          'День 2: Основы и теория',
          'День 3: Первая практика',
          'День 4: Углубление знаний',
          'День 5: Сложные вопросы',
          'День 6: Финальный проект',
          'День 7: Результаты и планы'
        ]
      }
    ],
    cohortSettings: {
      defaultDuration: 7,
      checkpointFrequency: 'daily',
      hasDeadlines: true
    }
  },
  {
    id: 'course-4weeks',
    name: 'Курс 4 недели',
    description: 'Сбалансированное обучение с еженедельными модулями',
    icon: '📚',
    duration: '4 недели',
    structure: {
      modulesCount: 4,
      lessonsPerModule: 4,
      suggestedSchedule: '3-4 урока в неделю'
    },
    defaultModules: [
      {
        title: 'Неделя 1: Введение',
        description: 'Знакомство с темой и базовые понятия',
        suggestedLessons: [
          'Добро пожаловать',
          'Основы теории',
          'Первые шаги',
          'Практическое задание'
        ]
      },
      {
        title: 'Неделя 2: Развитие',
        description: 'Углубляем знания и развиваем навыки',
        suggestedLessons: [
          'Продвинутые концепции',
          'Практические примеры',
          'Работа с инструментами',
          'Мини-проект'
        ]
      },
      {
        title: 'Неделя 3: Применение',
        description: 'Применяем знания в реальных задачах',
        suggestedLessons: [
          'Реальные кейсы',
          'Решение проблем',
          'Оптимизация процесса',
          'Групповая работа'
        ]
      },
      {
        title: 'Неделя 4: Мастерство',
        description: 'Достигаем мастерства и планируем развитие',
        suggestedLessons: [
          'Экспертные техники',
          'Финальный проект',
          'Презентация результатов',
          'Планы развития'
        ]
      }
    ],
    cohortSettings: {
      defaultDuration: 28,
      checkpointFrequency: 'weekly',
      hasDeadlines: true
    }
  },
  {
    id: 'profession-8weeks',
    name: 'Профессия 8 недель',
    description: 'Комплексное обучение профессии с портфолио и трудоустройством',
    icon: '🎯',
    duration: '8 недель',
    structure: {
      modulesCount: 8,
      lessonsPerModule: 5,
      suggestedSchedule: '4-5 уроков в неделю'
    },
    defaultModules: [
      {
        title: 'Неделя 1: Основы профессии',
        description: 'Введение в профессию и базовые навыки',
        suggestedLessons: [
          'Что такое профессия',
          'Необходимые навыки',
          'Инструменты работы',
          'Первый проект',
          'Обратная связь'
        ]
      },
      {
        title: 'Неделя 2: Технические навыки',
        description: 'Изучаем основные технические аспекты',
        suggestedLessons: [
          'Техническая база',
          'Практические упражнения',
          'Работа с инструментами',
          'Мини-проекты',
          'Ревью кода/работы'
        ]
      },
      {
        title: 'Неделя 3: Методология',
        description: 'Изучаем методы и подходы в работе',
        suggestedLessons: [
          'Методы работы',
          'Планирование проектов',
          'Работа в команде',
          'Управление временем',
          'Практическое применение'
        ]
      },
      {
        title: 'Неделя 4: Первый большой проект',
        description: 'Создаем первую серьезную работу для портфолио',
        suggestedLessons: [
          'Планирование проекта',
          'Техническая реализация',
          'Тестирование и отладка',
          'Презентация проекта',
          'Получение обратной связи'
        ]
      },
      {
        title: 'Неделя 5: Продвинутые техники',
        description: 'Изучаем сложные аспекты профессии',
        suggestedLessons: [
          'Продвинутые методы',
          'Оптимизация работы',
          'Решение сложных задач',
          'Работа с клиентами',
          'Профессиональная этика'
        ]
      },
      {
        title: 'Неделя 6: Второй проект',
        description: 'Создаем еще одну работу для портфолио',
        suggestedLessons: [
          'Выбор проекта',
          'Исследование и планирование',
          'Реализация',
          'Тестирование',
          'Финализация'
        ]
      },
      {
        title: 'Неделя 7: Портфолио и резюме',
        description: 'Готовим материалы для поиска работы',
        suggestedLessons: [
          'Создание портфолио',
          'Написание резюме',
          'Подготовка к собеседованиям',
          'Нетворкинг',
          'Личный бренд'
        ]
      },
      {
        title: 'Неделя 8: Трудоустройство',
        description: 'Ищем работу и развиваемся дальше',
        suggestedLessons: [
          'Поиск вакансий',
          'Прохождение собеседований',
          'Первые дни на работе',
          'Карьерное планирование',
          'Продолжение обучения'
        ]
      }
    ],
    cohortSettings: {
      defaultDuration: 56,
      checkpointFrequency: 'weekly',
      hasDeadlines: true
    }
  },
  {
    id: 'custom',
    name: 'Свой формат',
    description: 'Создайте курс с нуля по своему плану',
    icon: '🎨',
    duration: 'По вашему плану',
    structure: {
      modulesCount: 1,
      lessonsPerModule: 1,
      suggestedSchedule: 'Свободный график'
    },
    defaultModules: [
      {
        title: 'Модуль 1',
        description: 'Описание модуля',
        suggestedLessons: ['Урок 1']
      }
    ],
    cohortSettings: {
      defaultDuration: 30,
      checkpointFrequency: 'weekly',
      hasDeadlines: false
    }
  }
];

// Helper functions for working with templates
export function getTemplateById(id: string): CourseTemplate | undefined {
  return courseTemplates.find(template => template.id === id);
}

export function generateCourseFromTemplate(
  template: CourseTemplate,
  courseData: {
    title: string;
    description: string;
    category: string;
    price: number;
  }
): Omit<Course, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt' | 'studentsCount' | 'rating'> {
  const modules: Module[] = template.defaultModules.map((moduleTemplate, moduleIndex) => ({
    id: `module_${moduleIndex + 1}`,
    title: moduleTemplate.title,
    description: moduleTemplate.description,
    order: moduleIndex + 1,
    lessons: moduleTemplate.suggestedLessons.map((lessonTitle, lessonIndex) => ({
      id: `lesson_${moduleIndex + 1}_${lessonIndex + 1}`,
      title: lessonTitle,
      description: `Описание урока: ${lessonTitle}`,
      type: 'video' as const,
      content: '', // Will be filled by user
      order: lessonIndex + 1,
      materials: [],
    }))
  }));

  return {
    title: courseData.title,
    description: courseData.description,
    shortDescription: courseData.description.substring(0, 100) + '...',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    price: courseData.price,
    category: courseData.category,
    modules,
    tags: [],
    status: 'draft',
    templateId: template.id,
    settings: {
      hasDeadlines: true,
      autoAdvance: true,
      allowLateSubmissions: true,
      requireSequentialProgress: false,
      discussionEnabled: true
    }
  };
}