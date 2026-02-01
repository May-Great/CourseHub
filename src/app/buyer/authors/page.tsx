'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthorProfileStore, useMiniLessonStore, useCourseStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, BookOpen, Video, Users, UserPlus, UserCheck, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function BuyerAuthorsCatalog() {
  const { profiles, initialize: initProfiles, isFollowing, toggleFollow } = useAuthorProfileStore();
  const { listPublishedMiniLessons } = useMiniLessonStore();
  const { courses, initialize: initCourses } = useCourseStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'subscriptions'>('all');
  
  useEffect(() => {
    initProfiles();
    initCourses();
  }, [initProfiles, initCourses]);
  
  const filteredProfiles = profiles.filter(profile => {
    // Search Filter
    const matchesSearch = 
      profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Tab Filter
    if (viewMode === 'subscriptions') {
      return matchesSearch && isFollowing(profile.id);
    }
    
    return matchesSearch;
  });
  
  const getStats = (authorId: string) => {
    const authorLessons = listPublishedMiniLessons().filter(l => l.authorId === authorId).length;
    const authorCourses = courses.filter(c => c.authorId === authorId && c.status === 'published').length;
    // Mock students count for now
    const studentsCount = courses
      .filter(c => c.authorId === authorId)
      .reduce((acc, c) => acc + c.studentsCount, 0);
      
    return { authorLessons, authorCourses, studentsCount };
  };

  const handleQuickFollow = (e: React.MouseEvent, authorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(authorId);
  };

  return (
    <PageShell>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Наши Авторы
        </h1>
        <p className="text-lg text-slate-500">
          Учитесь у лучших экспертов в своих областях.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('all')}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              viewMode === 'all' 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Все авторы
          </button>
          <button
            onClick={() => setViewMode('subscriptions')}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
              viewMode === 'subscriptions' 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Heart className={cn("w-4 h-4 mr-2", viewMode === 'subscriptions' ? "text-rose-500 fill-rose-500" : "")} />
            Мои подписки
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm py-4">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-soft text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all"
            placeholder={viewMode === 'subscriptions' ? "Поиск в подписках..." : "Найти автора..."}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl whitespace-nowrap bg-white border-slate-200">
             <Filter className="w-4 h-4 mr-2" />
             Популярные
           </Button>
        </div>
      </div>
      
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {viewMode === 'subscriptions' ? 'Вы пока ни на кого не подписаны' : 'Авторы не найдены'}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {viewMode === 'subscriptions' 
              ? 'Перейдите во вкладку "Все авторы", чтобы найти интересных экспертов.'
              : 'Попробуйте изменить запрос.'
            }
          </p>
          {viewMode === 'subscriptions' && (
            <Button className="mt-6" onClick={() => setViewMode('all')}>
              Найти авторов
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map((profile) => {
            const stats = getStats(profile.id);
            const followed = isFollowing(profile.id);
            
            return (
              <Link key={profile.id} href={`/buyer/authors/${profile.id}`} className="group">
                <Card variant="hover" className="h-full flex flex-col overflow-hidden border-slate-200 hover:border-primary-200 relative">
                  {/* Quick Subscribe Button (Absolute Position) */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={(e) => handleQuickFollow(e, profile.id)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",
                        followed 
                          ? "bg-white text-rose-500 hover:bg-rose-50" 
                          : "bg-white/90 text-slate-400 hover:text-primary-600 hover:bg-white"
                      )}
                      title={followed ? "Отписаться" : "Подписаться"}
                    >
                      {followed ? <Heart className="w-5 h-5 fill-current" /> : <UserPlus className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Cover */}
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    {profile.coverUrl && (
                      <img src={profile.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <CardContent className="flex-1 flex flex-col p-6 pt-0 relative">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white -mt-10 mb-4 overflow-hidden relative z-10">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
                          {profile.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-900 text-xl group-hover:text-primary-600 transition-colors">
                        {profile.displayName}
                      </h3>
                      {profile.highlight && (
                        <p className="text-sm font-medium text-primary-600 mt-1">
                          {profile.highlight}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                      {profile.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {profile.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs font-medium text-slate-500">
                      <div className="flex items-center">
                        <Video className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {stats.authorLessons} уроков
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {stats.authorCourses} курсов
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {stats.studentsCount} студентов
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
