'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ProductFeedback } from '@/lib/types';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';

interface FeedbackFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

const feedbackTypes = [
  { value: 'feature_request', label: 'Запрос функции' },
  { value: 'bug_report', label: 'Сообщение об ошибке' },
  { value: 'general_feedback', label: 'Общая обратная связь' },
  { value: 'pricing_feedback', label: 'Отзыв о ценах' },
];

const ratingLabels = [
  { value: 1, label: 'Очень плохо', emoji: '😞' },
  { value: 2, label: 'Плохо', emoji: '😕' },
  { value: 3, label: 'Нормально', emoji: '😐' },
  { value: 4, label: 'Хорошо', emoji: '😊' },
  { value: 5, label: 'Отлично', emoji: '😍' },
];

export function FeedbackForm({ onSubmit, onCancel }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    type: 'general_feedback' as ProductFeedback['type'],
    title: '',
    description: '',
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { submitFeedback } = useSubscriptionStore();
  
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) return;
    
    setIsSubmitting(true);
    
    try {
      submitFeedback({
        userId: 'current-user',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        rating: formData.rating || undefined,
      });
      
      setIsSubmitted(true);
      
      // Simulate API delay
      setTimeout(() => {
        onSubmit?.();
      }, 1000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Спасибо за обратную связь!
          </h3>
          <p className="text-gray-600 mb-6">
            Ваше мнение очень важно для нас. Мы обязательно рассмотрим ваше предложение.
          </p>
          <Button onClick={onSubmit} className="w-full">
            Закрыть
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const isValid = formData.title && formData.description;
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Обратная связь
        </CardTitle>
        <p className="text-center text-gray-600">
          Помогите нам улучшить CourseHub
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Тип обратной связи"
            value={formData.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('type', e.target.value)}
            options={feedbackTypes}
          />
          
          <Input
            label="Заголовок *"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
            placeholder="Краткое описание"
            required
          />
          
          <Textarea
            label="Подробное описание *"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
            placeholder="Расскажите подробнее..."
            rows={4}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Оценка продукта (опционально)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ratingLabels.map((rating) => (
                <button
                  key={rating.value}
                  type="button"
                  onClick={() => handleInputChange('rating', rating.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-center
                    ${formData.rating === rating.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{rating.emoji}</div>
                  <div className="text-xs font-medium">{rating.value}</div>
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {ratingLabels.find(r => r.value === formData.rating)?.label}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Отмена
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              className="flex-1"
            >
              Отправить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}