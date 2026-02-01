'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface TopbarProps {
  navItems: NavItem[];
  role: 'author' | 'buyer';
}

export function Topbar({ navItems, role }: TopbarProps) {
  const pathname = usePathname();
  const { currentUser, setUserRole, setCurrentUser } = useAppStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setUserRole(null as any);
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">CourseHub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Search (Optional) */}
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />

          {/* Profile Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 pl-1 pr-2 py-1 rounded-full border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                {currentUser?.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {currentUser?.name.split(' ')[0]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                </div>
                
                <Link href={role === 'author' ? '/author/settings' : '/buyer/profile'} className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <User className="w-4 h-4 mr-3 text-slate-400" />
                  Профиль
                </Link>
                <Link href="#" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <Settings className="w-4 h-4 mr-3 text-slate-400" />
                  Настройки
                </Link>
                <Link href="#" className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <HelpCircle className="w-4 h-4 mr-3 text-slate-400" />
                  Помощь
                </Link>
                
                <div className="border-t border-slate-50 mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
