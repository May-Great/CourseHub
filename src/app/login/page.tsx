'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loader2, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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

  const handleOAuth = async (provider: 'google' | 'yandex') => {
    setLoading(true);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Success Screen after Registration
  if (emailSent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl border-slate-200 text-center animate-in fade-in zoom-in-95">
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
            className="w-full"
          >
            Вернуться ко входу
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-slate-200 animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isLogin 
              ? 'Введите свои данные для доступа к платформе' 
              : 'Создайте аккаунт, чтобы начать обучение или преподавание'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
             <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
               <button
                 type="button"
                 onClick={() => setRole('buyer')}
                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                   role === 'buyer' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 Я студент
               </button>
               <button
                 type="button"
                 onClick={() => setRole('author')}
                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                   role === 'author' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 Я автор
               </button>
             </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <Input
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600 leading-tight">
                Я принимаю <Link href="#" className="text-primary-600 hover:underline">пользовательское соглашение</Link> и даю согласие на обработку персональных данных
              </label>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white h-11 shadow-lg shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                isLogin ? 'Войти' : 'Создать аккаунт'
              )}
            </Button>

            {/* 
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Или войти через</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOAuth('yandex')}
                disabled={loading}
                className="w-full"
              >
                <span className="font-bold text-red-500 mr-1">Я</span>ндекс
              </Button>
            </div>
            */}

            <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setAgreed(false);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
