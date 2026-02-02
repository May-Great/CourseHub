'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Topbar } from '@/components/layout/Topbar';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { strings } from '@/lib/strings.ru';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userRole } = useAppStore();
  
  useEffect(() => {
    if (!userRole) {
      router.push('/');
    } else if (userRole === 'author') {
      // Access Denied: Authors cannot access buyer routes
      // Redirect to author's home
      router.push('/author/me');
    }
  }, [userRole, router]);
  
  // Show nothing while checking or if unauthorized
  if (!userRole || userRole !== 'buyer') {
    return null;
  }
  
  const buyerNavItems = [
    { label: strings.catalog, href: '/buyer/catalog' },
    { label: 'Авторы', href: '/buyer/authors' },
    { label: 'Библиотека', href: '/buyer/lessons' },
    { label: strings.myLearning, href: '/buyer/courses' },
    { label: strings.profile, href: '/buyer/profile' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Topbar navItems={buyerNavItems} role="buyer" />
      <main className="animate-fade-in">
        {children}
      </main>
      <CheckoutModal />
    </div>
  );
}
