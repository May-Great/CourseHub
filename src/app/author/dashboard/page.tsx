'use client';

import { mockCourses, mockCohorts } from '@/lib/mockData';
import { PlanLimitsWidget } from '@/components/pricing/PlanLimitsWidget';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Users, TrendingUp, DollarSign, Plus, ArrowRight, Activity, Calendar, Video } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useMiniLessonStore } from '@/lib/stores';
import { useEffect } from 'react';

export default function AuthorDashboard() {
  const { miniLessons, initialize: initLessons } = useMiniLessonStore();
  
  useEffect(() => {
    initLessons();
  }, [initLessons]);

  const totalCourses = mockCourses.length;
  const totalStudents = mockCourses.reduce((acc, course) => acc + course.studentsCount, 0);
  const activeCohorts = mockCohorts.filter(cohort => cohort.status === 'active').length;
  const totalRevenue = mockCourses.reduce((acc, course) => acc + (course.price * course.studentsCount), 0);
  
  // Calculate Mini Lesson stats
  const totalMiniLessons = miniLessons.length;
  const totalLessonViews = miniLessons.reduce((acc, lesson) => acc + (lesson.views || 0), 0);
  
  return (
    <PageShell>
      <div className="flex items-end justify-between mb-8">
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
              <Badge variant="success" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                +12%
              </Badge>
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
              <Badge variant="success" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                +5%
              </Badge>
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
              <Badge variant="secondary" size="sm">
                {totalLessonViews} views
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">Мини-уроков</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalMiniLessons}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Chart Placeholder */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Общая активность</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-slate-500">Неделя</Button>
            <Button variant="ghost" size="sm" className="bg-slate-100 text-slate-900">Месяц</Button>
            <Button variant="ghost" size="sm" className="text-slate-500">Год</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <div className="text-center">
               <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-400 font-medium">График просмотров уроков и продаж курсов</p>
             </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity and Plan Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Courses */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-900">Последние курсы</h2>
             <Link href="/author/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
               Все курсы <ArrowRight className="w-4 h-4 ml-1" />
             </Link>
           </div>
           
           <div className="grid md:grid-cols-2 gap-4">
            {mockCourses.slice(0, 4).map((course) => (
              <Card key={course.id} variant="hover" className="group">
                <CardContent className="p-5 flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                    {/* Placeholder for thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center mt-2 space-x-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        {course.studentsCount}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-3.5 h-3.5 mr-1" />
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
           </div>
        </div>
        
        {/* Sidebar Widgets */}
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
