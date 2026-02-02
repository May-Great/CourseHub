'use client';

import { useState } from 'react';
import { Quiz, QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onNext?: () => void;
}

export function QuizPlayer({ quiz, onComplete, onNext }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionSelect = (questionId: string, optionId: string, type: 'single_choice' | 'multiple_choice') => {
    if (isSubmitted) return;

    setSelectedOptions(prev => {
      const current = prev[questionId] || [];
      if (type === 'single_choice') {
        return { ...prev, [questionId]: [optionId] };
      } else {
        const exists = current.includes(optionId);
        return {
          ...prev,
          [questionId]: exists 
            ? current.filter(id => id !== optionId) 
            : [...current, optionId]
        };
      }
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;

    quiz.questions.forEach(q => {
      const userAnswers = selectedOptions[q.id] || [];
      const correctAnswers = q.options.filter(o => o.isCorrect).map(o => o.id);
      
      // Simple exact match check
      const isCorrect = 
        userAnswers.length === correctAnswers.length && 
        userAnswers.every(id => correctAnswers.includes(id));
      
      if (isCorrect) correctCount++;
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    if (calculatedScore >= quiz.passingScore) {
      onComplete(calculatedScore);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setIsSubmitted(false);
    setScore(0);
  };

  if (isSubmitted) {
    const isPassed = score >= quiz.passingScore;
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center animate-in fade-in zoom-in duration-300">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6",
          isPassed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        )}>
          {isPassed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {isPassed ? 'Тест сдан!' : 'Тест не сдан'}
        </h2>
        
        <p className="text-slate-500 mb-8 text-lg">
          Вы набрали <span className={cn("font-bold", isPassed ? "text-emerald-600" : "text-rose-600")}>{score}%</span>
          <br />
          Проходной балл: {quiz.passingScore}%
        </p>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleRetry} className="flex items-center">
            <RotateCcw className="w-4 h-4 mr-2" />
            Попробовать снова
          </Button>
          
          {isPassed && onNext && (
            <Button onClick={onNext} className="bg-primary-600 hover:bg-primary-700 text-white flex items-center">
              Следующий урок
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto p-6 md:p-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = (selectedOptions[currentQuestion.id] || []).includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option.id, currentQuestion.type)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center group",
                  isSelected 
                    ? "border-primary-600 bg-primary-50 text-primary-900" 
                    : "border-slate-200 hover:border-primary-200 hover:bg-slate-50 text-slate-700"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors",
                  isSelected 
                    ? "border-primary-600 bg-primary-600" 
                    : "border-slate-300 group-hover:border-primary-400"
                )}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-medium text-lg">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8"
            disabled={Object.keys(selectedOptions).length < quiz.questions.length} // Force answer all? Or just current?
          >
            Завершить тест
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8"
            disabled={!(selectedOptions[currentQuestion.id] || []).length}
          >
            Далее
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
