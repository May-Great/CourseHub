'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCohortStore, useCourseStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { Card } from '@/components/ui/Card';

import { GroupProgress } from '@/components/cohort/GroupProgress';

export default function CohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cohortId = params.id as string;
  const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'assignments'>('participants');
  
  const { getCohort } = useCohortStore();
  const { courses, initialize } = useCourseStore();
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initialize();
    setIsLoaded(true);
  }, [initialize]);

  const cohort = getCohort(cohortId);
  const course = cohort ? courses.find(c => c.id === cohort.courseId) : null;
  
  if (!isLoaded) return null;

  if (!cohort || !course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Поток не найден</h1>
        <Button className="mt-4" onClick={() => router.push('/author/cohorts')}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  // Calculate stats
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  
  // Mock progress data for GroupProgress component
  const mockProgressData: Record<string, { completedLessons: number }> = {};
  cohort.participants.forEach(p => {
    // Generate random progress for demo
    mockProgressData[p.id] = { completedLessons: Math.floor(Math.random() * (totalLessons + 1)) };
  });

  const courseModules = course.modules.map(m => ({
    id: m.id,
    title: m.title,
    lessonsCount: m.lessons.length
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {cohort.title}
          </h1>
          <p className="text-gray-600 mt-2">
            Курс: {course.title}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Настройки</Button>
          <Button>Пригласить студентов</Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Участники</p>
              <p className="text-2xl font-bold text-gray-900">
                {cohort.participants.length} / {cohort.maxParticipants}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Длительность</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.ceil((new Date(cohort.endDate).getTime() - new Date(cohort.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Статус</p>
              <p className="text-lg font-bold text-gray-900">
                {cohort.status === 'active' ? 'Активный' : 
                 cohort.status === 'upcoming' ? 'Предстоящий' : 'Завершен'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-1 px-4 py-2">
            {[
              { key: 'participants', label: 'Участники', icon: '👥' },
              { key: 'chat', label: 'Чат', icon: '💬' },
              { key: 'assignments', label: 'Успеваемость', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2
                  ${activeTab === tab.key 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'participants' && (
            <div className="space-y-4">
              {cohort.participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Нет участников. Пригласите студентов, чтобы начать обучение.
                </div>
              ) : (
                cohort.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         Активен
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'chat' && (
            <div className="text-center py-12">
               <div className="text-4xl mb-4">💬</div>
               <p className="text-gray-500">История сообщений потока будет здесь</p>
            </div>
          )}
          
          {activeTab === 'assignments' && (
             <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Прогресс группы</h3>
                  <Button variant="outline" size="sm">Скачать отчет</Button>
                </div>
                <GroupProgress 
                  participants={cohort.participants}
                  courseModules={courseModules}
                  progressData={mockProgressData}
                />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}