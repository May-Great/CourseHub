'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lesson } from '@/lib/types';
import { CourseCard } from '@/components/course/CourseCard';
import { MiniLessonCard } from '@/components/content/MiniLessonCard';
import { DeadlineCalendar } from '@/components/cohort/DeadlineCalendar';
import { useAppStore, useCourseStore, useMiniLessonStore, useStudentStore } from '@/lib/stores';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { BookOpen, Calendar, Clock, ArrowRight, Heart, History, PlayCircle, Bookmark } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function BuyerCourses() {
  const { purchasedCourses, userProgress } = useAppStore();
  const { courses, initialize: initCourses } = useCourseStore();
  const { miniLessons, initialize: initLessons } = useMiniLessonStore();
  const { savedCourses, savedMiniLessons, watchedMiniLessons } = useStudentStore();

  const [activeTab, setActiveTab] = useState<'enrolled' | 'saved' | 'history'>('enrolled');

  useEffect(() => {
    initCourses();
    initLessons();
  }, [initCourses, initLessons]);
  
  // Enrolled Courses
  const purchasedCoursesList = courses.filter(course => 
    purchasedCourses.includes(course.id)
  );
  
  // Saved Items
  const savedCoursesList = courses.filter(course => savedCourses.includes(course.id));
  const savedLessonsList = miniLessons.filter(lesson => savedMiniLessons.includes(lesson.id));
  
  // Watch History (Recent first)
  const watchedLessonsList = watchedMiniLessons
    .map(w => miniLessons.find(l => l.id === w.lessonId))
    .filter((l): l is typeof l & {} => !!l); // Type guard to remove undefined
  
  const getCourseProgress = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    if (!progress) return 0;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  // Aggregate all lessons for deadlines
  const allLessons = purchasedCoursesList.reduce<Lesson[]>((acc, course) => {
    course.modules.forEach(module => {
      acc.push(...module.lessons);
    });
    return acc;
  }, []);

  const allCompletedLessonIds = userProgress.reduce<string[]>((acc, progress) => {
    acc.push(...progress.completedLessons);
    return acc;
  }, []);
  
  return (
    <PageShell>
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {strings.myLearning}
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Ваши курсы, закладки и история
              </p>
            </div>
            {purchasedCoursesList.length > 0 && (
              <Link href="/buyer/catalog">
                <Button variant="ghost" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                  Каталог курсов <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
                activeTab === 'enrolled' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Мои курсы
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
                activeTab === 'saved' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Избранное
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
                activeTab === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <History className="w-4 h-4 mr-2" />
              История
            </button>
          </div>
          
          {/* Enrolled Tab */}
          {activeTab === 'enrolled' && (
            purchasedCoursesList.length === 0 ? (
              <Card className="text-center py-20 border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {strings.noPurchasedCourses}
                </h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  {strings.noPurchasedCoursesDescription}
                </p>
                <Link href="/buyer/catalog">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none rounded-xl">
                    Перейти в каталог
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedCoursesList.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    showProgress={true}
                    progress={getCourseProgress(course.id)}
                    showBuyButton={true}
                  />
                ))}
              </div>
            )
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-10">
              {/* Saved Courses */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-500" /> Сохраненные курсы
                </h3>
                {savedCoursesList.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">Нет сохраненных курсов</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedCoursesList.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        showBuyButton={true}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Lessons */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2 text-emerald-500" /> Сохраненные уроки
                </h3>
                {savedLessonsList.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">Нет сохраненных уроков</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedLessonsList.map((lesson) => (
                      <MiniLessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
             <div>
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                 <History className="w-5 h-5 mr-2 text-indigo-500" /> Недавно просмотренные
               </h3>
               {watchedLessonsList.length === 0 ? (
                 <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4">История просмотров пуста</p>
                    <Link href="/buyer/lessons">
                      <Button variant="outline">Смотреть мини-уроки</Button>
                    </Link>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {watchedLessonsList.map((lesson) => (
                     <MiniLessonCard key={lesson.id} lesson={lesson} />
                   ))}
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Sidebar with Deadlines & Stats (Only show if there are enrolled courses) */}
        {purchasedCoursesList.length > 0 && (
          <div className="w-full md:w-80 flex-shrink-0 space-y-6 mt-8 md:mt-0">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ваша активность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-4 h-4 mr-2 text-primary-500" />
                    <span className="text-sm font-medium">В обучении</span>
                  </div>
                  <span className="font-bold text-slate-900">{purchasedCoursesList.length} курсов</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-600">
                    <BookOpen className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="text-sm font-medium">Продено уроков</span>
                  </div>
                  <span className="font-bold text-slate-900">{allCompletedLessonIds.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-600">
                    <History className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="text-sm font-medium">Мини-уроков</span>
                  </div>
                  <span className="font-bold text-slate-900">{watchedMiniLessons.length}</span>
                </div>
              </CardContent>
            </Card>

            <DeadlineCalendar 
              lessons={allLessons} 
              completedLessonIds={allCompletedLessonIds}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
