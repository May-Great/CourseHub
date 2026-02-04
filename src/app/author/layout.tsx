'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Topbar } from '@/components/layout/Topbar';
import { strings } from '@/lib/strings.ru';

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userRole, initialized } = useAuthStore();
  
  useEffect(() => {
    if (!initialized) return;

    if (!userRole) {
      router.push('/');
    } else if (userRole === 'buyer') {
      // Access Denied: Buyers cannot access author routes
      // Redirect to buyer's home instead of auto-switching role
      router.push('/buyer/catalog');
    }
  }, [userRole, router, initialized]);
  
  // Show nothing while checking or if unauthorized
  if (!initialized || !userRole || userRole !== 'author') {
    return null;
  }
  
  const authorNavItems = [
    { label: 'Моя страница', href: '/author/me' },
    { label: strings.dashboard, href: '/author/dashboard' },
    { label: strings.myCourses, href: '/author/courses' },
    { label: 'Уроки', href: '/author/lessons' },
    { label: strings.cohorts, href: '/author/cohorts' },
    { label: strings.messages, href: '/author/messages' },
    { label: 'Тарифы', href: '/author/pricing' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Topbar navItems={authorNavItems} role="author" />
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}
