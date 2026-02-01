'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCohortStore, useCourseStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { CohortCard } from '@/components/cohort/CohortCard';
import { Cohort } from '@/lib/types';
import { mockCohorts } from '@/lib/mockData';

export default function AuthorCohorts() {
  const router = useRouter();
  const { cohorts, createCohort } = useCohortStore();
  const { courses, initialize: initializeCourses } = useCourseStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    initializeCourses();
    // Simple hydration check
    if (cohorts.length === 0 && mockCohorts.length > 0) {
       // Optional: hydrate from mock data if empty (for demo purposes)
       mockCohorts.forEach(c => createCohort(c));
    }
    setIsHydrated(true);
  }, [initializeCourses, cohorts.length, createCohort]);

  const handleCreateCohort = () => {
    // In a real app, open a modal. For MVP, we'll create a draft and redirect
    if (courses.length === 0) {
      alert('Сначала создайте курс!');
      return;
    }

    const newCohort: Omit<Cohort, 'id'> = {
      title: 'Новый поток',
      courseId: courses[0].id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      participants: [],
      maxParticipants: 50,
      status: 'upcoming',
      settings: {
        hasDeadlines: true,
        checkpointFrequency: 'weekly',
        autoAdvance: true,
        allowLateJoin: false,
        requireCompletion: true,
        certificateEnabled: true
      },
      schedule: [],
      checkpoints: []
    };
    
    createCohort(newCohort);
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {strings.cohorts}
          </h1>
          <p className="text-gray-600 mt-2">
            Управляйте потоками и участниками ваших курсов
          </p>
        </div>
        
        <Button size="lg" onClick={handleCreateCohort}>
          <span className="mr-2">➕</span>
          Создать поток
        </Button>
      </div>
      
      {cohorts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            У вас пока нет потоков
          </h3>
          <p className="text-gray-600 mb-6">
            Создайте первый поток для запуска курса с группой студентов
          </p>
          <Button size="lg" onClick={handleCreateCohort}>
            Создать поток
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => {
            const course = courses.find(c => c.id === cohort.courseId);
            
            return (
              <CohortCard 
                key={cohort.id}
                cohort={cohort}
                courseTitle={course?.title || 'Unknown Course'}
                onClick={() => router.push(`/author/cohorts/${cohort.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}