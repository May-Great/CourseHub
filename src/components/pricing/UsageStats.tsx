'use client';

import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, Badge } from '@/components/ui';
import { useSubscriptionStore } from '@/lib/stores/subscriptionStore';
import { useCourseStore, useCohortStore } from '@/lib/stores';

export function UsageStats() {
  const { 
    getCurrentPlan, 
    usageStats, 
    updateUsageStats, 
    getRemainingLimits 
  } = useSubscriptionStore();
  
  const { courses } = useCourseStore();
  const { cohorts } = useCohortStore();
  
  const currentPlan = getCurrentPlan();
  const remainingLimits = getRemainingLimits();
  
  // Update usage stats based on current data
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
  
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-amber-600';
    return 'text-green-600';
  };
  
  const formatLimit = (limit: number) => {
    return limit === -1 ? '∞' : limit.toString();
  };
  
  const usageItems = [
    {
      label: 'Курсы',
      used: usageStats.coursesCreated,
      limit: currentPlan.limits.courses,
      icon: '📚',
    },
    {
      label: 'Потоки',
      used: usageStats.cohortsCreated,
      limit: currentPlan.limits.cohorts,
      icon: '👥',
    },
    {
      label: 'Студенты',
      used: usageStats.totalStudents,
      limit: currentPlan.limits.totalStudents,
      icon: '🎓',
    },
    {
      label: 'Хранилище',
      used: usageStats.storageUsed,
      limit: currentPlan.limits.storage,
      icon: '💾',
      unit: 'ГБ',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Использование ресурсов
        </h3>
        <Badge variant="primary">
          План: {currentPlan.name}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageItems.map((item) => {
          const percentage = getUsagePercentage(item.used, item.limit);
          const isNearLimit = percentage >= 80 && item.limit !== -1;
          
          return (
            <Card key={item.label} className={isNearLimit ? 'ring-2 ring-amber-200' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  {isNearLimit && (
                    <Badge variant="warning" size="sm">
                      Близко к лимиту
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {item.used}{item.unit ? ` ${item.unit}` : ''} из {formatLimit(item.limit)}{item.unit ? ` ${item.unit}` : ''}
                    </span>
                    {item.limit !== -1 && (
                      <span className={`font-medium ${getUsageColor(percentage)}`}>
                        {Math.round(percentage)}%
                      </span>
                    )}
                  </div>
                  
                  {item.limit !== -1 && (
                    <ProgressBar 
                      progress={percentage}
                      className="h-2"
                    />
                  )}
                  
                  {item.limit === -1 && (
                    <div className="text-xs text-green-600 font-medium">
                      Безлимитно
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Warnings for limits */}
      {usageItems.some(item => getUsagePercentage(item.used, item.limit) >= 90) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <span className="text-amber-600 text-xl">⚠️</span>
              <div>
                <h4 className="font-medium text-amber-800 mb-1">
                  Приближение к лимитам
                </h4>
                <p className="text-amber-700 text-sm">
                  Вы приближаетесь к лимитам вашего тарифного плана. 
                  Рассмотрите возможность обновления до более высокого плана.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="text-xs text-gray-500">
        Последнее обновление: {new Date(usageStats.lastUpdated).toLocaleString('ru-RU')}
      </div>
    </div>
  );
}