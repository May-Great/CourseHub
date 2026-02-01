'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { PricingPlan } from '@/lib/types';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';

interface LeadFormProps {
  plan: PricingPlan;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function LeadForm({ plan, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { submitLeadForm } = useSubscriptionStore();
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    
    try {
      submitLeadForm({
        userId: 'current-user',
        planId: plan.id,
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        message: formData.message || undefined,
      });
      
      setIsSubmitted(true);
      
      // Simulate API delay
      setTimeout(() => {
        onSubmit?.();
      }, 1000);
    } catch (error) {
      console.error('Error submitting lead form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Заявка отправлена!
          </h3>
          <p className="text-gray-600 mb-6">
            Мы свяжемся с вами в течение 24 часов для обсуждения плана {plan.name}.
          </p>
          <Button onClick={onSubmit} className="w-full">
            Продолжить
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const isValid = formData.name && formData.email;
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Заявка на план {plan.name}
        </CardTitle>
        <p className="text-center text-gray-600">
          Оставьте заявку и мы свяжемся с вами для активации плана
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Имя *"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
            placeholder="Ваше имя"
            required
          />
          
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            required
          />
          
          <Input
            label="Компания"
            value={formData.company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('company', e.target.value)}
            placeholder="Название компании (опционально)"
          />
          
          <Textarea
            label="Сообщение"
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
            placeholder="Расскажите о ваших потребностях..."
            rows={3}
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              План {plan.name} включает:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {plan.features.slice(0, 3).map((feature) => (
                <li key={feature.id} className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>{feature.name}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-blue-600">
                  и еще {plan.features.length - 3} возможностей...
                </li>
              )}
            </ul>
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
              Отправить заявку
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}