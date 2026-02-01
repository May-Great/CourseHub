'use client';

import { useState } from 'react';
import { Button, Textarea, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Checkpoint, CheckpointResponse } from '@/lib/types';
import { useCheckpointStore } from '@/lib/stores/checkpointStore';

interface CheckpointFormProps {
  checkpoint: Checkpoint;
  userId: string;
  existingResponse?: CheckpointResponse;
  onResponseSubmitted?: () => void;
}

const weeklyQuestions = [
  {
    id: 'learned',
    question: 'Что нового вы изучили на этой неделе?',
    placeholder: 'Опишите ключевые концепции, навыки или инсайты...'
  },
  {
    id: 'challenges',
    question: 'Какие трудности возникли в процессе обучения?',
    placeholder: 'Расскажите о сложностях, с которыми столкнулись...'
  },
  {
    id: 'helpful',
    question: 'Что помогло вам больше всего в изучении материала?',
    placeholder: 'Материалы, методы, поддержка сообщества...'
  },
  {
    id: 'questions',
    question: 'Какие вопросы у вас остались?',
    placeholder: 'Что хотели бы уточнить или изучить глубже...'
  },
  {
    id: 'application',
    question: 'Как вы планируете применить полученные знания?',
    placeholder: 'Практические применения, проекты, эксперименты...'
  }
];

const moodOptions = [
  { value: 'great', label: 'Отлично', emoji: '🚀', color: 'text-green-600' },
  { value: 'good', label: 'Хорошо', emoji: '😊', color: 'text-blue-600' },
  { value: 'okay', label: 'Нормально', emoji: '😐', color: 'text-yellow-600' },
  { value: 'struggling', label: 'Сложно', emoji: '😓', color: 'text-orange-600' },
  { value: 'stuck', label: 'Застрял', emoji: '😵', color: 'text-red-600' }
];

export function CheckpointForm({ 
  checkpoint, 
  userId, 
  existingResponse, 
  onResponseSubmitted 
}: CheckpointFormProps) {
  const [responses, setResponses] = useState<Record<string, string>>(
    existingResponse?.responses.reduce((acc, r) => ({ ...acc, [r.question]: r.answer }), {}) || {}
  );
  const [mood, setMood] = useState<CheckpointResponse['mood']>(existingResponse?.mood || 'good');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitCheckpointResponse } = useCheckpointStore();
  
  const handleResponseChange = (questionId: string, answer: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const responseData = {
        checkpointId: checkpoint.id,
        userId,
        responses: weeklyQuestions.map(q => ({
          question: q.question,
          answer: responses[q.id] || ''
        })),
        mood
      };
      
      submitCheckpointResponse(responseData);
      onResponseSubmitted?.();
    } catch (error) {
      console.error('Error submitting checkpoint response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isReadOnly = !!existingResponse;
  const canSubmit = !isReadOnly && Object.values(responses).some(r => r.trim());
  
  const getStatusBadge = () => {
    if (existingResponse) {
      return <Badge variant="success">Отправлено</Badge>;
    }
    
    const now = new Date();
    const scheduledDate = new Date(checkpoint.scheduledDate);
    
    if (scheduledDate > now) {
      return <Badge variant="outline">Ожидается</Badge>;
    }
    
    return <Badge variant="warning">Активный</Badge>;
  };
  
  return (
    <div className="space-y-6">
      {/* Заголовок чекпоинта */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span className="text-2xl">📋</span>
                <span>{checkpoint.title}</span>
              </CardTitle>
              <p className="text-neutral-600 mt-2">{checkpoint.description}</p>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
      </Card>
      
      {/* Выбор настроения */}
      <Card>
        <CardHeader>
          <CardTitle>Как дела с обучением?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => !isReadOnly && setMood(option.value as CheckpointResponse['mood'])}
                disabled={isReadOnly}
                className={`
                  p-4 rounded-xl border-2 transition-all text-center
                  ${mood === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                  }
                  ${isReadOnly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className={`text-sm font-medium ${option.color}`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Вопросы для рефлексии */}
      <Card>
        <CardHeader>
          <CardTitle>Рефлексия недели</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {weeklyQuestions.map((q, index) => (
            <div key={q.id}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {index + 1}. {q.question}
              </label>
              <Textarea
                value={responses[q.id] || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleResponseChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                disabled={isReadOnly}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Кнопка отправки */}
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            loading={isSubmitting}
            leftIcon={<span>📤</span>}
          >
            Отправить чекпоинт
          </Button>
        </div>
      )}
      
      {/* Информация об отправке */}
      {existingResponse && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <span>✅</span>
              <span>
                Отправлено: {new Date(existingResponse.submittedAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}