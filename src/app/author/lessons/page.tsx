'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMiniLessonStore, useAppStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Video, Play, Edit, Trash, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AuthorLessonsList() {
  const { miniLessons, initialize, deleteMiniLesson } = useMiniLessonStore();
  const { planLimits, currentUser } = useAppStore();
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Filter for current author (mocked as '1' or currentUser.id)
  const authorId = currentUser?.id || '1';
  const authorLessons = miniLessons.filter(l => l.authorId === authorId);
  const lessonsCount = authorLessons.length;
  const lessonsLimit = planLimits.free.miniLessons; // Assuming free plan for now
  
  const handleCreateClick = (e: React.MouseEvent) => {
    if (lessonsCount >= lessonsLimit) {
      e.preventDefault();
      setShowLimitModal(true);
    }
  };
  
  return (
    <PageShell>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Мини-уроки
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Бесплатные уроки для привлечения аудитории
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-500 mr-2">Использовано:</span>
            <span className={`text-sm font-bold ${lessonsCount >= lessonsLimit ? 'text-rose-500' : 'text-slate-900'}`}>
              {lessonsCount} / {lessonsLimit === Infinity ? '∞' : lessonsLimit}
            </span>
          </div>
          
          <Link href="/author/lessons/new" onClick={handleCreateClick}>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20">
              <Plus className="w-5 h-5 mr-2" />
              Добавить урок
            </Button>
          </Link>
        </div>
      </div>
      
      {lessonsCount === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <Video className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            У вас пока нет мини-уроков
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Создайте короткие полезные видео, чтобы привлечь студентов к вашим основным курсам.
          </p>
          <Link href="/author/lessons/new" onClick={handleCreateClick}>
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              Создать первый урок
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorLessons.map((lesson) => (
            <Card key={lesson.id} variant="hover" className="group flex flex-col h-full">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-100 rounded-t-2xl overflow-hidden">
                {lesson.coverImageUrl ? (
                  <img src={lesson.coverImageUrl} alt={lesson.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Video className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href={`/author/lessons/${lesson.id}`}>
                    <Button variant="ghost" className="text-white border-white hover:bg-white/20 rounded-full">
                      <Edit className="w-5 h-5 mr-2" /> Редактировать
                    </Button>
                  </Link>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={lesson.status === 'published' ? 'success' : 'secondary'}>
                    {lesson.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
              
              {/* Content */}
              <CardContent className="flex-1 flex flex-col p-5">
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {lesson.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatDistanceToNow(new Date(lesson.createdAt), { addSuffix: true, locale: ru })}</span>
                  <div className="flex space-x-2">
                     <button 
                       onClick={() => window.open(`/buyer/lessons/${lesson.id}`, '_blank')}
                       className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-primary-600 transition-colors" 
                       title="Preview"
                     >
                       <ExternalLink className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => deleteMiniLesson(lesson.id)}
                       className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors" 
                       title="Delete"
                     >
                       <Trash className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Достигнут лимит Free плана</h3>
            <p className="text-slate-500 mb-6">
              Вы использовали все {lessonsLimit} доступных мини-уроков. Чтобы создавать больше, обновите тариф до Pro.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowLimitModal(false)}>Отмена</Button>
              <Link href="/author/pricing">
                <Button className="bg-primary-600 text-white">Перейти к тарифам</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
