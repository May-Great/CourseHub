'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Zap, 
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/stores/authStore';
import { Logo } from '@/components/ui/Logo';

export default function Home() {
  const { userRole, initialized } = useAuthStore();
  
  // Navigation for Header
  const navLinks = [
    { label: 'Возможности', href: '#features' },
    { label: 'Для авторов', href: '#authors' },
    { label: 'Для студентов', href: '#students' },
    { label: 'Цены', href: '#pricing' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
             <Logo />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {initialized && userRole ? (
               <Link href={userRole === 'author' ? '/author/me' : '/buyer/catalog'}>
                 <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                   В кабинет
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">
                  Войти
                </Link>
                <Link href="/login?role=buyer">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
                    Начать учиться
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full blur-3xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100 to-rose-100 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-primary-700">Платформа 2.0 уже доступна</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Учитесь и обучайте <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">в потоке вдохновения</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Платформа для авторов с практическим опытом и студентов, которые хотят получить реальные навыки, а не просто пройти курс для галочки.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login?role=buyer">
              <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-lg rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20">
                Начать обучение
              </Button>
            </Link>
            <Link href="/login?role=author">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-lg rounded-full border-slate-200 hover:bg-slate-50 text-slate-700">
                Стать автором
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500">
             <div className="flex items-center">
               <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
               Практический опыт
             </div>
             <div className="flex items-center">
               <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
               Знания для дела
             </div>
             <div className="flex items-center">
               <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
               Удобство и простота
             </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">Всё необходимое в одном месте</h2>
             <p className="text-slate-500 max-w-2xl mx-auto">
               Мы убрали всё лишнее, оставив только инструменты, которые действительно помогают учиться и продавать знания.
             </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Делитесь опытом",
                  desc: "Инструменты для тех, кто хочет передать свои практические знания другим. Помогаем авторам учить."
                },
                {
                  icon: ShieldCheck,
                  title: "Реальные навыки",
                  desc: "Обучение ради знаний и скиллов, которые можно применить на практике сразу, а не для галочки."
                },
                {
                  icon: Users,
                  title: "Простота и фокус",
                  desc: "Удобная и простая платформа без лишнего шума, где ничто не отвлекает от главного — обучения."
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Role Split Section --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Authors */}
            <div id="authors" className="relative group cursor-pointer" onClick={() => window.location.href = '/login?role=author'}>
              <div className="absolute inset-0 bg-primary-600 rounded-3xl rotate-1 group-hover:rotate-2 transition-transform opacity-10" />
              <div className="relative bg-white border border-slate-200 rounded-3xl p-10 hover:border-primary-200 transition-colors">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                   <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Для Авторов</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 mr-3" />
                    Удобный конструктор курсов
                  </li>
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 mr-3" />
                    Аналитика продаж и прогресса
                  </li>
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 mr-3" />
                    Маркетинговые инструменты
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Создать курс</Button>
              </div>
            </div>

            {/* Students */}
            <div id="students" className="relative group cursor-pointer" onClick={() => window.location.href = '/login?role=buyer'}>
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl -rotate-1 group-hover:-rotate-2 transition-transform opacity-10" />
              <div className="relative bg-white border border-slate-200 rounded-3xl p-10 hover:border-indigo-200 transition-colors">
                 <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                   <GraduationCap className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Для Студентов</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" />
                    Доступ к тысячам курсов
                  </li>
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" />
                    Интерактивные задания и тесты
                  </li>
                  <li className="flex items-center text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" />
                    Практические навыки
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Найти курс</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
         </div>
         
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Готовы начать свой путь?</h2>
           <p className="text-xl text-slate-200 mb-10">
             Присоединяйтесь к тысячам пользователей, которые уже изменили свою жизнь с CourseHub.
           </p>
           <Link href="/login">
             <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10 h-14 text-lg rounded-full">
               Зарегистрироваться бесплатно
             </Button>
           </Link>
           <p className="mt-6 text-sm text-slate-400">
             Не требует кредитной карты • 14 дней бесплатно
           </p>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
             <Logo />
          </div>
          <div className="text-sm text-slate-500">
            © 2026 CourseHub Platform. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
