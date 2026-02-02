'use client';

import { mockCourses, mockCohorts } from '@/lib/mockData';
import { PlanLimitsWidget } from '@/components/pricing/PlanLimitsWidget';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SimpleChart, TrendIndicator } from '@/components/dashboard/AnalyticsComponents';
import { BookOpen, Users, DollarSign, Plus, ArrowRight, Video, Calendar, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { useMiniLessonStore } from '@/lib/stores';
import { useEffect, useState } from 'react';

export default function AuthorDashboard() {
  const { miniLessons, initialize: initLessons } = useMiniLessonStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  useEffect(() => {
    initLessons();
  }, [initLessons]);

  const totalCourses = mockCourses.length;
  const totalStudents = mockCourses.reduce((acc, course) => acc + course.studentsCount, 0);
  const totalRevenue = mockCourses.reduce((acc, course) => acc + (course.price * course.studentsCount), 0);
  
  // Calculate Mini Lesson stats
  const totalMiniLessons = miniLessons.length;
  const totalLessonViews = miniLessons.reduce((acc, lesson) => acc + (lesson.views || 0), 0);
  
  // --- MOCK ANALYTICS GENERATION ---
  // In a real app, this would come from an API based on `timeRange`
  
  // 1. Revenue History (Monthly)
  const revenueData = [
    { label: 'Янв', value: totalRevenue * 0.05 },
    { label: 'Фев', value: totalRevenue * 0.08 },
    { label: 'Мар', value: totalRevenue * 0.12 },
    { label: 'Апр', value: totalRevenue * 0.10 },
    { label: 'Май', value: totalRevenue * 0.15 },
    { label: 'Июн', value: totalRevenue * 0.18 },
    { label: 'Июл', value: totalRevenue * 0.22 }, // Current month (projected)
  ];

  // 2. Student Growth (Monthly)
  const studentsData = [
    { label: 'Янв', value: 10 },
    { label: 'Фев', value: 25 },
    { label: 'Мар', value: 45 },
    { label: 'Апр', value: 60 },
    { label: 'Май', value: 85 },
    { label: 'Июн', value: 120 },
    { label: 'Июл', value: totalStudents },
  ];

  // 3. Recent Activity Feed
  const recentActivity = [
    { id: 1, type: 'sale', text: 'Новая продажа: "React и TypeScript"', time: '2 часа назад', amount: 4990 },
    { id: 2, type: 'student', text: 'Иван К. записался на курс', time: '5 часов назад' },
    { id: 3, type: 'review', text: 'Новый отзыв (5★) от Елены П.', time: '1 день назад' },
    { id: 4, type: 'lesson', text: 'Мини-урок "Figma Tips" набрал 1000 просмотров', time: '2 дня назад' },
  ];

  return (
    <PageShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {strings.dashboard}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Обзор активности курсов и мини-уроков
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/author/lessons/new">
            <Button variant="outline" className="hidden sm:flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Добавить урок
            </Button>
          </Link>
          <Link href="/author/courses/new">
            <Button className="flex items-center bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none">
              <Plus className="w-4 h-4 mr-2" />
              {strings.createCourse}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="flat" className="relative overflow-hidden group hover:border-primary-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendIndicator value={12} label="vs прош. мес." />
            </div>
            <p className="text-sm font-medium text-slate-500">Общий доход</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        
        <Card variant="flat" className="relative overflow-hidden group hover:border-primary-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <TrendIndicator value={5} label="vs прош. мес." />
            </div>
            <p className="text-sm font-medium text-slate-500">{strings.students}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalStudents}</p>
          </CardContent>
        </Card>
        
        <Card variant="flat" className="relative overflow-hidden group hover:border-primary-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                2 черновика
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Всего курсов</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalCourses}</p>
          </CardContent>
        </Card>

        <Card variant="flat" className="relative overflow-hidden group hover:border-primary-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Video className="w-6 h-6" />
              </div>
              <TrendIndicator value={24} label="просмотры" />
            </div>
            <p className="text-sm font-medium text-slate-500">Мини-уроков</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalMiniLessons}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
           <SimpleChart 
             title="Динамика выручки (RUB)" 
             data={revenueData} 
             height={240}
             valuePrefix="₽"
           />
        </div>
        <div>
           <SimpleChart 
             title="Рост студентов" 
             data={studentsData} 
             type="line"
             height={240}
             className="bg-slate-50/50 border-slate-200"
           />
        </div>
      </div>
      
      {/* Recent Activity and Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Activity & Cohorts */}
        <div className="lg:col-span-2 space-y-8">
           {/* Recent Activity Feed */}
           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-lg flex items-center">
                 <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                 Лента событий
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               {recentActivity.map((item, idx) => (
                 <div key={item.id} className={`px-6 py-4 flex items-center hover:bg-slate-50 transition-colors ${idx !== 0 ? 'border-t border-slate-50' : ''}`}>
                   <div className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0",
                     item.type === 'sale' ? "bg-emerald-100 text-emerald-600" :
                     item.type === 'student' ? "bg-blue-100 text-blue-600" :
                     item.type === 'review' ? "bg-amber-100 text-amber-600" :
                     "bg-purple-100 text-purple-600"
                   )}>
                     {item.type === 'sale' ? <DollarSign className="w-5 h-5" /> :
                      item.type === 'student' ? <Plus className="w-5 h-5" /> :
                      item.type === 'review' ? <Star className="w-5 h-5" /> :
                      <Video className="w-5 h-5" />}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-slate-900">{item.text}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                   </div>
                   {item.amount && (
                     <span className="font-bold text-emerald-600 text-sm">+{formatPrice(item.amount)}</span>
                   )}
                 </div>
               ))}
             </CardContent>
           </Card>

           {/* Top Courses Table */}
           <Card>
             <CardHeader>
               <div className="flex items-center justify-between">
                 <CardTitle className="text-lg">Популярные курсы</CardTitle>
                 <Link href="/author/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                   Все курсы
                 </Link>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="border-b border-slate-100 bg-slate-50/50">
                       <th className="px-6 py-3 font-medium text-slate-500">Название</th>
                       <th className="px-6 py-3 font-medium text-slate-500">Учеников</th>
                       <th className="px-6 py-3 font-medium text-slate-500">Рейтинг</th>
                       <th className="px-6 py-3 font-medium text-slate-500 text-right">Выручка</th>
                     </tr>
                   </thead>
                   <tbody>
                     {mockCourses.slice(0, 3).map((course) => (
                       <tr key={course.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                         <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                         <td className="px-6 py-4 text-slate-600">{course.studentsCount}</td>
                         <td className="px-6 py-4 text-slate-600 flex items-center">
                           <Star className="w-3.5 h-3.5 text-amber-400 fill-current mr-1" />
                           {course.rating}
                         </td>
                         <td className="px-6 py-4 text-right font-medium text-slate-900">
                           {formatPrice(course.price * course.studentsCount)}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
        </div>
        
        {/* Right Column: Widgets */}
        <div className="space-y-6">
           <PlanLimitsWidget />
           
           <Card>
             <CardHeader>
               <CardTitle className="text-lg">Активные потоки</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               {mockCohorts.filter(c => c.status === 'active').slice(0, 3).map((cohort, idx) => (
                 <div key={cohort.id} className={`p-5 flex items-center space-x-4 ${idx !== 0 ? 'border-t border-slate-50' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {cohort.participants.length}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{cohort.title}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                         <Calendar className="w-3 h-3 mr-1" />
                         Скоро дедлайн
                      </div>
                    </div>
                 </div>
               ))}
               {mockCohorts.filter(c => c.status === 'active').length === 0 && (
                 <div className="p-8 text-center text-slate-500 text-sm">
                   Нет активных потоков
                 </div>
               )}
             </CardContent>
           </Card>
        </div>
      </div>
    </PageShell>
  );
}
