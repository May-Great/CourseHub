'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { strings } from '@/lib/strings.ru';
import { BookOpen, GraduationCap, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();
  const { userRole, setUserRole, setCurrentUser } = useAppStore();
  
  const handleRoleSelect = (role: 'author' | 'buyer') => {
    setUserRole(role);
    // Mock login
    setCurrentUser({
      id: 'current-user',
      name: role === 'author' ? 'Иван Автор' : 'Петр Студент',
      email: role === 'author' ? 'author@example.com' : 'student@example.com',
      role: role
    });
    
    if (role === 'author') {
      router.push('/author/me');
    } else {
      router.push('/buyer/catalog');
    }
  };
  
  const handleResetRole = () => {
    setUserRole(null as any);
    setCurrentUser(null);
    window.location.reload();
  };
  
  // Если роль уже выбрана, показываем кнопку сброса (Premium Welcome Back Card)
  if (userRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
           <Card variant="hover" className="p-8 text-center border-slate-200">
             <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              {userRole === 'author' ? (
                <BookOpen className="w-8 h-8 text-primary-600" />
              ) : (
                <GraduationCap className="w-8 h-8 text-primary-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              С возвращением!
            </h2>
            <p className="text-slate-500 mb-8 font-medium">
              Вы авторизованы как <span className="text-primary-600 font-bold">{userRole === 'author' ? 'Автор' : 'Студент'}</span>
            </p>
            
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30 rounded-xl h-12 text-base"
                onClick={() => userRole === 'author' ? router.push('/author/me') : router.push('/buyer/catalog')}
              >
                Продолжить работу
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleResetRole}
                className="w-full text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                Сменить роль
              </Button>
            </div>
           </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-amber-400 mr-2 fill-current" />
            <span className="text-sm font-semibold text-slate-600">Образовательная платформа нового поколения</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            CourseHub — <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">учёба потоком</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Создавайте курсы без рутины и учитесь с удовольствием. <br className="hidden md:block"/>
            Платформа, которая не отвлекает от главного.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
          {/* Author Card */}
          <div 
            className="group bg-white rounded-[2rem] p-10 border border-slate-200 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => handleRoleSelect('author')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                {strings.iAmAuthor}
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                {strings.authorDescription}
              </p>
              
              <div className="flex items-center text-primary-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                Панель автора
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Buyer Card */}
          <div 
            className="group bg-white rounded-[2rem] p-10 border border-slate-200 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => handleRoleSelect('buyer')}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-50 to-primary-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {strings.iAmBuyer}
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                {strings.buyerDescription}
              </p>
              
              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                Каталог курсов
                <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-20">
          <p className="text-slate-400 text-sm font-medium">
            © 2026 CourseHub Platform. Designed for focus.
          </p>
        </div>
      </div>
    </div>
  );
}
