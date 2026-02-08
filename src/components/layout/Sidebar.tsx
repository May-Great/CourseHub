'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/authStore';
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
  PenSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

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
  const userRole = useAuthStore((state) => state.userRole);
  const [isOpen, setIsOpen] = useState(false);
  
  const items = userRole === 'author' ? authorItems : buyerItems;
  const homeLink = userRole === 'author' ? '/author/me' : (userRole === 'buyer' ? '/buyer/catalog' : '/');

  const toggleMenu = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow bg-white h-full">
      <div className="flex items-center flex-shrink-0 h-16 px-6 border-b border-slate-100 justify-between md:justify-start">
        <Link href={homeLink} className="text-xl font-bold text-slate-900 flex items-center space-x-2" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span>CourseHub</span>
        </Link>
        {/* Mobile Close Button */}
        <button onClick={toggleMenu} className="md:hidden text-slate-500 hover:text-slate-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="mt-6 flex-grow flex flex-col px-4 overflow-y-auto">
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
  );
  
  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4 justify-between">
         <Link href={homeLink} className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span>CourseHub</span>
          </Link>
         <Button variant="ghost" size="sm" onClick={toggleMenu}>
           <Menu className="w-6 h-6 text-slate-700" />
         </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in duration-200"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-200">
        <SidebarContent />
      </div>
      
      {/* Mobile Header Spacer */}
      <div className="md:hidden h-16" /> 
    </>
  );
}
