'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Users, BookOpen, Activity, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      
      // 1. Total Users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. New Users (Last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeek.toISOString());

      // 3. Courses
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        activeToday: Math.floor((userCount || 0) * 0.15), // Mock for now until analytics table fills
        newThisWeek: newUsersCount || 0,
        totalCourses: courseCount || 0
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Панель управления</h1>
        <p className="text-slate-500 mt-2">Обзор ключевых показателей платформы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего пользователей"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
          trendUp={true}
          description="Все зарегистрированные"
        />
        <StatCard
          title="Новые за неделю"
          value={stats.newThisWeek}
          icon={TrendingUp}
          trend="+5%"
          trendUp={true}
          description="Регистрации за 7 дней"
        />
        <StatCard
          title="Активные сегодня"
          value={stats.activeToday}
          icon={Activity}
          description="Пользователи онлайн (est)"
        />
        <StatCard
          title="Всего курсов"
          value={stats.totalCourses}
          icon={BookOpen}
          description="Опубликованные курсы"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Последние регистрации</h3>
          <div className="text-sm text-slate-500 text-center py-8">
            Здесь будет список последних зарегистрированных пользователей...
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Популярные курсы</h3>
          <div className="text-sm text-slate-500 text-center py-8">
            Здесь будет график популярных курсов...
          </div>
        </Card>
      </div>
    </div>
  );
}
