'use client';

import { useState } from 'react';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { LeadForm } from '@/components/pricing/LeadForm';
import { FeedbackForm } from '@/components/pricing/FeedbackForm';
import { PlanLimitsWidget } from '@/components/pricing/PlanLimitsWidget';
import { Button } from '@/components/ui/Button';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/Card';

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const { plans } = useSubscriptionStore();
  
  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    
    // Show lead form for paid plans
    if (planId !== 'free') {
      setShowLeadForm(true);
    }
  };
  
  const handleLeadFormSubmit = () => {
    setShowLeadForm(false);
    setSelectedPlanId(null);
  };
  
  const handleFeedbackSubmit = () => {
    setShowFeedbackForm(false);
  };
  
  if (showLeadForm && selectedPlan) {
    return (
      <PageShell>
        <LeadForm
          plan={selectedPlan}
          onSubmit={handleLeadFormSubmit}
          onCancel={() => setShowLeadForm(false)}
        />
      </PageShell>
    );
  }
  
  if (showFeedbackForm) {
    return (
      <PageShell>
        <FeedbackForm
          onSubmit={handleFeedbackSubmit}
          onCancel={() => setShowFeedbackForm(false)}
        />
      </PageShell>
    );
  }
  
  return (
    <PageShell>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Инвестируйте в свое развитие
          </h1>
          <p className="text-lg text-slate-500">
            Выберите план, который подходит именно вам. Прозрачные цены, никаких скрытых комиссий.
          </p>
        </div>

        {/* Current Usage Widget */}
        <div className="max-w-4xl mx-auto">
           <Card className="border-primary-100 bg-gradient-to-br from-white to-primary-50/30">
             <CardContent className="p-8">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Ваш текущий статус: Free Plan</h3>
               <div className="grid md:grid-cols-2 gap-8">
                 <PlanLimitsWidget />
                 <div className="flex flex-col justify-center items-start">
                   <p className="text-slate-600 mb-4 leading-relaxed">
                     Вы используете бесплатный тариф. Это отличный старт! 
                     Но если вы хотите создавать больше контента и получить доступ к аналитике, 
                     рекомендуем обновиться до Pro.
                   </p>
                   <Button onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}>
                     Смотреть тарифы
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
        
        {/* Pricing Plans */}
        <div id="pricing-plans" className="-mx-4 md:mx-0">
          <PricingPlans onPlanSelect={handlePlanSelect} />
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Часто задаваемые вопросы
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">
                Можно ли изменить план в любое время?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Да, вы можете повысить или понизить тарифный план в любое время. 
                Изменения вступают в силу немедленно.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">
                Что происходит при превышении лимитов?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                При приближении к лимитам мы уведомим вас. 
                Вы сможете обновить план или удалить неиспользуемый контент.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">
                Есть ли скидки для образовательных учреждений?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Да, мы предоставляем специальные условия для школ и университетов. 
                Свяжитесь с нами для получения предложения.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">
                Можно ли получить возврат средств?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Мы предлагаем 30-дневную гарантию возврата средств 
                без вопросов для всех платных планов.
              </p>
            </div>
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Помогите нам стать лучше
            </h2>
            <p className="text-slate-300 mb-8">
              Ваше мнение важно для нас. Поделитесь идеями о том, 
              как мы можем улучшить CourseHub.
            </p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-slate-900"
              onClick={() => setShowFeedbackForm(true)}
            >
              Оставить отзыв
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
