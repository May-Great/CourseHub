'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, X, Check, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Logo } from '@/components/ui/Logo';

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
  const router = useRouter();
  const { currentUser, signOut } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchPath = role === 'author' ? '/author/courses' : '/buyer/catalog';
      router.push(`${searchPath}?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const homeLink = role === 'author' ? '/author/me' : '/buyer/catalog';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link href={homeLink} className="flex items-center group">
            <Logo />
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
          {/* Search */}
          <div className="relative" ref={searchRef}>
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80 bg-white shadow-lg rounded-xl border border-slate-200 p-1 flex items-center z-50">
                <Search className="w-4 h-4 ml-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  autoFocus
                  className="flex-1 border-none focus:ring-0 text-sm px-3 py-1.5"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Уведомления</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Прочитать все
                    </button>
                  )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      Нет новых уведомлений
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                            !notification.readAt && "bg-blue-50/50"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={cn("text-sm font-medium", !notification.readAt ? "text-slate-900" : "text-slate-600")}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{notification.message}</p>
                          {!notification.readAt && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="p-1 text-primary-600 bg-white rounded-full shadow-sm border border-slate-100"
                                title="Отметить как прочитанное"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />

          {/* Profile Dropdown Trigger */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 pl-1 pr-2 py-1 rounded-full border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {currentUser?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-sm font-bold text-slate-900">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser?.email || 'email@example.com'}</p>
                </div>
                
                <Link 
                  href={role === 'author' ? '/author/me' : '/buyer/profile'} 
                  className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 text-slate-400" />
                  Профиль
                </Link>
                <Link 
                  href={role === 'author' ? '/author/settings' : '/buyer/profile'} 
                  className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3 text-slate-400" />
                  Настройки
                </Link>
                <Link 
                  href="/support" 
                  className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
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
