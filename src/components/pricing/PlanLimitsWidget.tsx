'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, ProgressBar } from '@/components/ui';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';
import { useCourseStore, useCohortStore } from '@/lib/stores';

export function PlanLimitsWidget() {
  const { 
    getCurrentPlan, 
    usageStats, 
    updateUsageStats, 
    getRemainingLimits,
    initializePlans 
  } = useSubscriptionStore();
  
  const { courses, initialize } = useCourseStore();
  const { cohorts } = useCohortStore();
  
  const currentPlan = getCurrentPlan();
  const remainingLimits = getRemainingLimits();
  
  // Initialize stores
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Initialize plans if not loaded
  useEffect(() => {
    if (!currentPlan) {
      initializePlans();
    }
  }, [currentPlan, initializePlans]);
  
  // Update usage stats
  useEffect(() => {
    const totalStudents = cohorts.reduce((sum, cohort) => sum + cohort.participants.length, 0);
    
    const stats = {
      userId: 'current-user',
      coursesCreated: courses.length,
      cohortsCreated: cohorts.length,
      totalStudents,
      storageUsed: courses.length * 0.5, // Mock: 0.5GB per course
      lastUpdated: new Date().toISOString(),
    };
    
    updateUsageStats(stats);
  }, [courses.length, cohorts.length, updateUsageStats]);
  
  if (!currentPlan || !usageStats) {
    return null;
  }
  
  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };
  
  const isNearLimit = (used: number, limit: number) => {
    if (limit === -1) return false;
    return (used / limit) >= 0.8;
  };
  
  const hasAnyLimits = currentPlan.limits.courses !== -1 || 
                      currentPlan.limits.cohorts !== -1 || 
                      currentPlan.limits.totalStudents !== -1;
  
  const nearLimitItems = [
    {
      label: 'Курсы',
      used: usageStats.coursesCreated,
      limit: currentPlan.limits.courses,
      isNear: isNearLimit(usageStats.coursesCreated, currentPlan.limits.courses)
    },
    {
      label: 'Потоки',
      used: usageStats.cohortsCreated,
      limit: currentPlan.limits.cohorts,
      isNear: isNearLimit(usageStats.cohortsCreated, currentPlan.limits.cohorts)
    },
    {
      label: 'Студенты',
      used: usageStats.totalStudents,
      limit: currentPlan.limits.totalStudents,
      isNear: isNearLimit(usageStats.totalStudents, currentPlan.limits.totalStudents)
    }
  ].filter(item => item.isNear);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>💳</span>
            <span>Тарифный план</span>
          </CardTitle>
          <Badge variant={currentPlan.id === 'free' ? 'outline' : 'primary'}>
            {currentPlan.name}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick stats */}
        {hasAnyLimits && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {currentPlan.limits.courses === -1 ? '∞' : remainingLimits.courses}
              </div>
              <div className="text-xs text-gray-600">Курсов осталось</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {currentPlan.limits.cohorts === -1 ? '∞' : remainingLimits.cohorts}
              </div>
              <div className="text-xs text-gray-600">Потоков осталось</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {currentPlan.limits.totalStudents === -1 ? '∞' : remainingLimits.students}
              </div>
              <div className="text-xs text-gray-600">Студентов осталось</div>
            </div>
          </div>
        )}
        
        {/* Warnings for near limits */}
        {nearLimitItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-amber-600">⚠️</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  Приближение к лимитам
                </h4>
                <div className="space-y-1">
                  {nearLimitItems.map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-amber-700">
                        {item.label}: {item.used}/{item.limit === -1 ? '∞' : item.limit}
                      </span>
                      <ProgressBar 
                        progress={getUsagePercentage(item.used, item.limit)}
                        className="w-16 h-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upgrade suggestion */}
        {currentPlan.id === 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-center">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Готовы к росту?
              </h4>
              <p className="text-xs text-blue-700 mb-3">
                Обновитесь до Pro для безлимитных курсов и расширенной аналитики
              </p>
              <Link href="/author/pricing">
                <Button size="sm" className="w-full">
                  Посмотреть планы
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Plan features preview */}
        {!hasAnyLimits && (
          <div className="text-center">
            <div className="text-green-600 text-2xl mb-2">🚀</div>
            <p className="text-sm text-gray-600">
              У вас безлимитный план!
            </p>
            <Link href="/author/pricing" className="text-xs text-blue-600 hover:text-blue-800">
              Управление планом
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}