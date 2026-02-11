'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams.get('role') as 'author' | 'buyer' | null;
  
  const { signIn, signUp, signInWithOAuth } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'author' | 'buyer'>(initialRole || 'buyer');
  
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin) {
      if (!name) return;
      if (!agreed) {
        setError('Необходимо принять пользовательское соглашение');
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    let result;
    
    if (isLogin) {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password, role, name);
    }
    
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      setLoading(false);
      
      // Handle Email Confirmation Flow
      if (!isLogin && (result as any).emailConfirmationRequired) {
        setEmailSent(true);
        return;
      }

      // Standard Login Redirect
      const targetRole = isLogin && (email === 'adminIMN1' ? 'author' : email === 'adminIMN2' ? 'buyer' : role) || role;
      router.push(targetRole === 'author' ? '/author/me' : '/buyer/catalog');
    }
  };

  // Content for the left side
  const getLeftContent = () => {
    if (isLogin) {
      return {
        title: "С возвращением!",
        description: "Продолжите свое развитие с CourseHub. Ваши курсы и прогресс ждут вас.",
        features: [
          { icon: <BookOpen className="w-5 h-5 text-blue-600" />, text: "Доступ к вашей библиотеке" },
          { icon: <Sparkles className="w-5 h-5 text-blue-600" />, text: "Персональные рекомендации" },
          { icon: <GraduationCap className="w-5 h-5 text-blue-600" />, text: "Отслеживание прогресса" }
        ]
      };
    }
    
    if (role === 'author') {
      return {
        title: "Станьте автором",
        description: "Делитесь знаниями, создавайте курсы с помощью AI и монетизируйте свою экспертность.",
        features: [
          { icon: <Sparkles className="w-5 h-5 text-blue-600" />, text: "AI-помощник для создания контента" },
          { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, text: "Удобный редактор курсов" },
          { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, text: "Аналитика и быстрые выплаты" }
        ]
      };
    }

    return {
      title: "Начните учиться",
      description: "Получите доступ к тысячам курсов от экспертов и развивайте новые навыки.",
      features: [
        { icon: <BookOpen className="w-5 h-5 text-blue-600" />, text: "Учитесь в своем темпе" },
        { icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, text: "Доступ к материалам навсегда" },
        { icon: <GraduationCap className="w-5 h-5 text-blue-600" />, text: "Практические задания" }
      ]
    };
  };

  const leftContent = getLeftContent();

  if (emailSent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl text-center animate-in fade-in zoom-in-95">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Проверьте почту</h2>
          <p className="text-slate-600 mb-6">
            Мы отправили письмо с подтверждением на <strong>{email}</strong>. 
            Перейдите по ссылке в письме, чтобы активировать аккаунт.
          </p>
          <Button 
            onClick={() => {
              setEmailSent(false);
              setIsLogin(true);
            }}
            className="w-full h-12 rounded-xl text-base"
          >
            Вернуться ко входу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Info Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden p-12 flex-col justify-center">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto w-full">
          <Link href="/" className="inline-block mb-12">
             <Logo />
          </Link>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {leftContent.title}
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {leftContent.description}
              </p>
              
              <div className="space-y-6">
                {leftContent.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4 text-blue-600">
                      {feature.icon}
                    </div>
                    <span className="font-medium text-slate-800">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </h2>
            <p className="mt-2 text-slate-500">
              {isLogin 
                ? 'Введите свои данные для входа' 
                : 'Заполните форму ниже, чтобы начать'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
               <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-2xl">
                 <button
                   type="button"
                   onClick={() => setRole('buyer')}
                   className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                     role === 'buyer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Я студент
                 </button>
                 <button
                   type="button"
                   onClick={() => setRole('author')}
                   className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                     role === 'author' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Я автор
                 </button>
               </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1">Имя</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Пароль</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-slate-500 leading-tight cursor-pointer select-none">
                  Я принимаю <Link href="#" className="text-blue-600 hover:underline font-medium">пользовательское соглашение</Link> и даю согласие на обработку данных
                </label>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 flex items-center animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-base font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  isLogin ? 'Войти' : 'Создать аккаунт'
                )}
              </Button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm">
                {isLogin ? 'Впервые у нас?' : 'Уже есть аккаунт?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setAgreed(false);
                  }}
                  className="ml-1.5 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  {isLogin ? 'Регистрация' : 'Войти'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
