import { render, screen, fireEvent } from '@testing-library/react';
import { QuizEditor } from '../QuizEditor';
import { Quiz } from '@/lib/types';
import { vi } from 'vitest';

const mockQuiz: Quiz = {
  questions: [
    {
      id: 'q1',
      text: 'Test Question 1',
      type: 'single_choice',
      options: [
        { id: 'opt1', text: 'Option 1', isCorrect: true },
        { id: 'opt2', text: 'Option 2', isCorrect: false }
      ]
    }
  ],
  passingScore: 70
};

describe('QuizEditor', () => {
  it('renders initial questions', () => {
    const handleChange = vi.fn();
    render(<QuizEditor quiz={mockQuiz} onChange={handleChange} />);
    expect(screen.getByDisplayValue('Test Question 1')).toBeInTheDocument();
  });

  it('adds a new question', () => {
    const handleChange = vi.fn();
    render(<QuizEditor quiz={mockQuiz} onChange={handleChange} />);
    
    const addButton = screen.getByText('Добавить вопрос');
    fireEvent.click(addButton);
    
    expect(handleChange).toHaveBeenCalled();
    const newQuiz = handleChange.mock.calls[0][0];
    expect(newQuiz.questions).toHaveLength(2);
  });
});
