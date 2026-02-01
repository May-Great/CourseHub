'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { strings } from '@/lib/strings.ru';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Search, 
  Library, 
  User, 
  RotateCcw,
  Video,
  PenSquare
} from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

// These items should ideally be outside the component or memoized
// Added missing items for Author (Lessons, My Page)
const authorItems: SidebarItem[] = [
  { href: '/author/me', label: 'Моя страница', icon: PenSquare },
  { href: '/author/dashboard', label: strings.dashboard, icon: LayoutDashboard },
  { href: '/author/courses', label: strings.myCourses, icon: BookOpen },
  { href: '/author/lessons', label: 'Уроки', icon: Video },
  { href: '/author/cohorts', label: strings.cohorts, icon: Users },
  { href: '/author/messages', label: strings.messages, icon: MessageSquare },
  { href: '/author/pricing', label: 'Тарифы', icon: CreditCard },
  { href: '/author/settings', label: strings.settings, icon: Settings },
];

const buyerItems: SidebarItem[] = [
  { href: '/buyer/catalog', label: strings.catalog, icon: Search },
  { href: '/buyer/authors', label: 'Авторы', icon: Users },
  { href: '/buyer/lessons', label: 'Библиотека', icon: Video },
  { href: '/buyer/courses', label: strings.myLearning, icon: Library },
  { href: '/buyer/profile', label: strings.profile, icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  // Optimization: Select only the userRole from the store to prevent unnecessary re-renders
  // when other parts of the state change (like progress or chat messages)
  const userRole = useAppStore((state) => state.userRole);
  
  const items = userRole === 'author' ? authorItems : buyerItems;
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 left-0 z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
        <div className="flex items-center flex-shrink-0 h-16 px-6 border-b border-slate-100">
          <Link href="/" className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span>CourseHub</span>
          </Link>
        </div>
        
        <div className="mt-6 flex-grow flex flex-col px-4">
          <nav className="flex-1 space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 p-4 border-t border-slate-100">
          <Link
            href="/"
            className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RotateCcw className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            Сменить роль
          </Link>
        </div>
      </div>
    </div>
  );
}
