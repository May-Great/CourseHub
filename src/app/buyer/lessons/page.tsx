'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMiniLessonStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Video, Play, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function BuyerLessonLibrary() {
  const { miniLessons, initialize, listPublishedMiniLessons } = useMiniLessonStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const publishedLessons = listPublishedMiniLessons();
  
  const filteredLessons = publishedLessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageShell>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Бесплатная библиотека
        </h1>
        <p className="text-lg text-slate-500">
          Короткие уроки от экспертов. Учитесь новому за 5-10 минут.
        </p>
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
            placeholder="Что хотите узнать?"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl whitespace-nowrap bg-white border-slate-200">
             <Filter className="w-4 h-4 mr-2" />
             Новые
           </Button>
           <Button variant="outline" className="rounded-xl whitespace-nowrap bg-white border-slate-200">
             Популярные
           </Button>
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Уроков пока нет
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Библиотека пополняется. Загляните позже или посмотрите наши полные курсы.
          </p>
          <Link href="/buyer/catalog">
             <Button variant="outline" className="mt-6">
               Перейти в каталог курсов
             </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLessons.map((lesson) => (
            <Link key={lesson.id} href={`/buyer/lessons/${lesson.id}`} className="group">
              <Card variant="hover" className="h-full flex flex-col overflow-hidden border-slate-200 hover:border-primary-200">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {lesson.coverImageUrl ? (
                    <img src={lesson.coverImageUrl} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Video className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-slate-900 ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge (Mock) */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium backdrop-blur-sm">
                    5:00
                  </div>
                </div>
                
                {/* Content */}
                <CardContent className="flex-1 flex flex-col p-4">
                  <h3 className="font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {lesson.title}
                  </h3>
                  
                  <div className="flex items-center text-xs text-slate-500 mb-3">
                    <span>Автор: Анна Петрова</span>
                    <span className="mx-1.5">•</span>
                    <span>{formatDistanceToNow(new Date(lesson.createdAt), { addSuffix: true, locale: ru })}</span>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                       Бесплатно
                     </span>
                     <span className="text-xs text-slate-400 flex items-center">
                       {lesson.views || 0} просмотров
                     </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
