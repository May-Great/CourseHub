'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { strings } from '@/lib/strings.ru';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const authorItems: NavItem[] = [
  { href: '/author/dashboard', label: strings.dashboard, icon: '📊' },
  { href: '/author/courses', label: strings.myCourses, icon: '📚' },
  { href: '/author/cohorts', label: strings.cohorts, icon: '👥' },
  { href: '/author/settings', label: strings.settings, icon: '⚙️' },
];

const buyerItems: NavItem[] = [
  { href: '/buyer/catalog', label: strings.catalog, icon: '🔍' },
  { href: '/buyer/courses', label: strings.myLearning, icon: '📖' },
  { href: '/buyer/profile', label: strings.profile, icon: '👤' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { userRole } = useAppStore();
  
  const items = userRole === 'author' ? authorItems : buyerItems;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 px-1 text-xs transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}