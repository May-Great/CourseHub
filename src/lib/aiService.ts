import { QuizQuestion } from "./types";

// Mock delay to simulate API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Generates quiz questions based on the provided text content.
   * In a real app, this would call OpenAI API.
   */
  async generateQuizFromText(text: string): Promise<QuizQuestion[]> {
    // Simulate network delay
    await delay(2000);

    // Basic logic to generate somewhat relevant questions based on keywords
    // This makes the mock feel "smart"
    const lowerText = text.toLowerCase();
    const questions: QuizQuestion[] = [];

    if (lowerText.includes('react')) {
      questions.push({
        id: `ai-${Date.now()}-1`,
        text: 'Что является основным строительным блоком React приложения?',
        type: 'single_choice',
        options: [
          { id: 'opt-1', text: 'Компонент', isCorrect: true },
          { id: 'opt-2', text: 'Сервис', isCorrect: false },
          { id: 'opt-3', text: 'Контроллер', isCorrect: false }
        ]
      });
    }

    if (lowerText.includes('hook') || lowerText.includes('хук')) {
      questions.push({
        id: `ai-${Date.now()}-2`,
        text: 'Какой хук используется для управления состоянием?',
        type: 'single_choice',
        options: [
          { id: 'opt-1', text: 'useEffect', isCorrect: false },
          { id: 'opt-2', text: 'useState', isCorrect: true },
          { id: 'opt-3', text: 'useContext', isCorrect: false }
        ]
      });
    }

    // Default fallback questions if no keywords match or to fill up
    if (questions.length < 3) {
      questions.push(
        {
          id: `ai-${Date.now()}-3`,
          text: 'Какова главная цель изученного материала?',
          type: 'single_choice',
          options: [
            { id: 'opt-1', text: 'Понять основные принципы', isCorrect: true },
            { id: 'opt-2', text: 'Заучить определения', isCorrect: false },
            { id: 'opt-3', text: 'Ничего из перечисленного', isCorrect: false }
          ]
        },
        {
          id: `ai-${Date.now()}-4`,
          text: 'Выберите верные утверждения из урока:',
          type: 'multiple_choice',
          options: [
            { id: 'opt-1', text: 'Практика важнее теории', isCorrect: true },
            { id: 'opt-2', text: 'Теория не нужна', isCorrect: false },
            { id: 'opt-3', text: 'Нужен баланс', isCorrect: true }
          ]
        }
      );
    }

    return questions;
  }
};
