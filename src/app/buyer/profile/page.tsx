'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAppStore, useStudentStore, useMiniLessonStore, useProgressStore } from '@/lib/stores';
import { strings } from '@/lib/strings.ru';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BookOpen, CheckCircle, Clock, History, PlayCircle, Bookmark } from 'lucide-react';
import { GamificationStats } from '@/components/gamification/GamificationStats';
import Link from 'next/link';

export default function BuyerProfile() {
  const { purchasedCourses } = useAppStore();
  // Rename legacy userProgress to avoid conflict
  const { userProgress: legacyProgress } = useAppStore();
  const { userProgress } = useProgressStore();
  const { watchedMiniLessons, savedCourses, savedMiniLessons } = useStudentStore();
  const { miniLessons, initialize: initLessons } = useMiniLessonStore();
  
  useEffect(() => {
    initLessons();
  }, [initLessons]);
  
  const totalCourses = purchasedCourses.length;
  
  // Calculate stats from new store
  const totalPoints = userProgress.reduce((acc, p) => acc + (p.points || 0), 0);
  const maxStreak = userProgress.reduce((acc, p) => Math.max(acc, p.streak || 0), 0);
  const totalAchievements = userProgress.reduce((acc, p) => acc + (p.achievements?.length || 0), 0);

  const completedCourses = userProgress.filter(p => {
    return p.completedLessons.length > 0; // Simplified for demo
  }).length;
  
  // Calculate stats
  const totalWatchedLessons = watchedMiniLessons.length;
  const totalSavedItems = savedCourses.length + savedMiniLessons.length;
  
  // Recent Activity
  const recentWatched = watchedMiniLessons.slice(0, 3).map(w => {
    const lesson = miniLessons.find(l => l.id === w.lessonId);
    return { ...w, lesson };
  }).filter(item => item.lesson);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {strings.profile}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Управляйте настройками профиля и отслеживайте прогресс
        </p>
      </div>
      
      {/* Gamification Stats */}
      <GamificationStats 
        points={totalPoints} 
        streak={maxStreak} 
        achievementsCount={totalAchievements} 
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="flat" className="text-center p-6 border-slate-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalCourses}</div>
          <p className="text-slate-500 text-sm">Курсов куплено</p>
        </Card>
        
        <Card variant="flat" className="text-center p-6 border-slate-200">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{completedCourses}</div>
          <p className="text-slate-500 text-sm">Курсов завершено</p>
        </Card>
        
        <Card variant="flat" className="text-center p-6 border-slate-200">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalWatchedLessons}</div>
          <p className="text-slate-500 text-sm">Мини-уроков</p>
        </Card>

        <Card variant="flat" className="text-center p-6 border-slate-200">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalSavedItems}</div>
          <p className="text-slate-500 text-sm">В избранном</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Column */}
        <div className="lg:col-span-2 space-y-8">
           {/* Recent Activity */}
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-lg flex items-center">
                 <Clock className="w-5 h-5 mr-2 text-slate-400" /> Недавняя активность
               </CardTitle>
               <Link href="/buyer/courses" className="text-sm text-primary-600 font-medium hover:text-primary-700">
                 Вся история
               </Link>
             </CardHeader>
             <CardContent>
               {recentWatched.length === 0 ? (
                 <p className="text-slate-500 text-sm italic py-4 text-center">История просмотров пуста</p>
               ) : (
                 <div className="space-y-4">
                   {recentWatched.map((item) => (
                     <div key={item.lessonId} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                         <PlayCircle className="w-5 h-5 text-slate-500" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-medium text-slate-900 truncate">{item.lesson?.title}</p>
                         <p className="text-xs text-slate-500">Мини-урок</p>
                       </div>
                       <span className="text-xs text-slate-400 whitespace-nowrap">
                         {new Date(item.watchedAt).toLocaleDateString()}
                       </span>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>

           {/* Profile Settings */}
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Личная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    defaultValue="Михаил Иванов"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="mikhail@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  О себе
                </label>
                <textarea
                  rows={3}
                  defaultValue="Изучаю программирование и дизайн"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all resize-none"
                />
              </div>
              
              <div className="pt-2">
                <Button className="bg-primary-600 text-white">
                  Сохранить изменения
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Preferences */}
        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="text-lg">Настройки обучения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Автовоспроизведение</p>
                  <p className="text-xs text-slate-500 mt-1">Включать следующий урок автоматически</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1 rounded text-primary-600 focus:ring-primary-500" />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Уведомления</p>
                  <p className="text-xs text-slate-500 mt-1">О новых уроках и комментариях</p>
                </div>
                <input type="checkbox" defaultChecked className="mt-1 rounded text-primary-600 focus:ring-primary-500" />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Напоминания</p>
                  <p className="text-xs text-slate-500 mt-1">Еженедельный отчет о прогрессе</p>
                </div>
                <input type="checkbox" className="mt-1 rounded text-primary-600 focus:ring-primary-500" />
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Сбросить настройки
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
