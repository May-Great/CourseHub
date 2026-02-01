'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { PricingPlan } from '@/lib/types';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';

interface PricingPlansProps {
  onPlanSelect?: (planId: string) => void;
  showCurrentPlan?: boolean;
}

export function PricingPlans({ onPlanSelect, showCurrentPlan = true }: PricingPlansProps) {
  const { plans, initializePlans, getCurrentPlan } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const currentPlan = getCurrentPlan();
  
  useEffect(() => {
    if (plans.length === 0) {
      initializePlans();
    }
  }, [plans.length, initializePlans]);
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onPlanSelect?.(planId);
  };
  
  const formatPrice = (price: number, currency: string, interval: string) => {
    if (price === 0) return 'Бесплатно';
    
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === 'RUB' ? 'RUB' : 'USD',
      minimumFractionDigits: 0,
    });
    
    return `${formatter.format(price)}/${interval === 'month' ? 'мес' : 'год'}`;
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Выберите тарифный план
        </h2>
        <p className="text-lg text-gray-600">
          Начните бесплатно и масштабируйтесь по мере роста
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative transition-all hover:shadow-lg ${
              plan.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
            } ${
              currentPlan?.id === plan.id && showCurrentPlan ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="primary" className="px-4 py-1">
                  Популярный
                </Badge>
              </div>
            )}
            
            {currentPlan?.id === plan.id && showCurrentPlan && (
              <div className="absolute -top-3 right-4">
                <Badge variant="success" className="px-3 py-1">
                  Текущий план
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(plan.price, plan.currency, plan.interval)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    <span className={`mt-0.5 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <span className={`font-medium ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                {currentPlan?.id === plan.id && showCurrentPlan ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    Текущий план
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    Начать бесплатно
                  </Button>
                ) : (
                  <Button 
                    variant={plan.isPopular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.price === 0 ? 'Выбрать план' : 'Оставить заявку'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
        <p>
          Все планы включают 14-дневный бесплатный пробный период. 
          Отмените в любое время без дополнительных комиссий.
        </p>
      </div>
    </div>
  );
}