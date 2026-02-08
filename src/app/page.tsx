'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { LavaBackground } from '@/components/layout/LavaBackground';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Users, 
  Zap,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { currentUser } = useAuthStore();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <LavaBackground />

      {/* Navbar (Transparent) */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">CourseHub</span>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link href="/buyer/dashboard">
              <Button className="bg-white/80 hover:bg-white text-indigo-900 border-white/20 backdrop-blur-sm shadow-sm">
                Мой кабинет
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" className="text-slate-700 hover:bg-white/20">
                  Вход
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border-none rounded-xl px-6">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-900">
                На платформе 2.0 уже доступны ИИ инструменты
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Учите и учитесь <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                без границ
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Создавайте курсы с помощью ИИ, находите студентов и развивайте навыки в удобном темпе. Доступ навсегда.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/buyer/catalog">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  Начать учиться
                  <BookOpen className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href={currentUser ? "/author/courses" : "/auth?mode=signup"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg bg-white/50 hover:bg-white border-white/40 text-slate-900 rounded-2xl backdrop-blur-sm shadow-sm transition-all hover:-translate-y-1">
                  Стать автором
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative z-10 py-24 bg-white/40 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Популярные курсы</h2>
            <Link href="/buyer/catalog" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center">
              Смотреть все <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <FeaturedCourses />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Почему CourseHub?
            </h2>
            <p className="text-lg text-slate-600">
              Всё, что нужно для эффективного обучения и преподавания
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Features */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Для студентов</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  Учитесь в своем темпе
                </li>
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  Доступ к материалам навсегда
                </li>
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  Сертификаты после завершения
                </li>
              </ul>
            </div>

            {/* Author Features */}
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Для авторов</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                  Простой редактор курсов
                </li>
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                  Быстрый старт с ИИ инструментами
                </li>
                <li className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                  Аналитика и отзывы
                </li>
              </ul>
            </div>

            {/* AI Feature */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl transform md:scale-105">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">ИИ Помощник</h3>
              <p className="text-indigo-100 mb-6 leading-relaxed">
                Используйте мощь искусственного интеллекта для создания структуры курса, генерации тестов и улучшения контента.
              </p>
              <Link href={currentUser ? "/author/courses" : "/auth?mode=signup"}>
                <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-none">
                  Попробовать бесплатно
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Создай свой курс через ИИ сегодня или начни путь к новой профессии.
          </p>
          <Link href={currentUser ? "/buyer/catalog" : "/auth?mode=signup"}>
            <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-500/30">
              Присоединиться к CourseHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CourseHub. Все права защищены.</p>
        </div>
      </footer>
    </main>
  );
}
