'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMiniLessonStore, useCourseStore, useAppStore, useStudentStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VideoPlayer } from '@/components/video';
import { ArrowLeft, Sparkles, BookOpen, ExternalLink, PlayCircle, Video, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function BuyerLessonPlayer() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  
  const { getMiniLessonById, initialize: initLessons, listPublishedMiniLessons } = useMiniLessonStore();
  const { courses, initialize: initCourses } = useCourseStore();
  const { purchasedCourses } = useAppStore();
  const { markMiniLessonAsWatched, isMiniLessonSaved, toggleSaveMiniLesson } = useStudentStore();
  
  const [activeTab, setActiveTab] = useState<'analysis' | 'materials'>('analysis');

  useEffect(() => {
    initLessons();
    initCourses();
  }, [initLessons, initCourses]);

  const lesson = getMiniLessonById(lessonId);
  const otherLessons = listPublishedMiniLessons()
    .filter(l => l.id !== lessonId)
    .slice(0, 3); // Show max 3 other lessons

  const isSaved = lesson ? isMiniLessonSaved(lesson.id) : false;

  const handleLessonComplete = () => {
    if (lesson) {
      markMiniLessonAsWatched(lesson.id);
    }
  };

  const handleSave = () => {
    if (lesson) {
      toggleSaveMiniLesson(lesson.id);
    }
  };

  if (!lesson) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Урок не найден</h1>
          <Link href="/buyer/lessons">
            <Button className="mt-4">Вернуться в библиотеку</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const linkedCourse = lesson.linkedCourseId 
    ? courses.find(c => c.id === lesson.linkedCourseId) 
    : null;

  const isCoursePurchased = linkedCourse && purchasedCourses.includes(linkedCourse.id);

  return (
    <PageShell className="bg-white min-h-screen pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/buyer/lessons" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад в библиотеку
          </Link>
          <div className="flex items-start justify-between gap-4">
             <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
               {lesson.title}
             </h1>
             <Button
               variant="outline"
               onClick={handleSave}
               className={cn(
                 "flex-shrink-0 transition-all",
                 isSaved ? "text-primary-600 bg-primary-50 border-primary-200" : "text-slate-500"
               )}
             >
               {isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
               {isSaved ? "Сохранено" : "Сохранить"}
             </Button>
          </div>
          
          <div className="flex items-center mt-3 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Анна Петрова</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(lesson.createdAt), { addSuffix: true, locale: ru })}</span>
            <span className="mx-2">•</span>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
              Бесплатный урок
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Player & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 relative">
               <VideoPlayer
                 src={lesson.videoUrl}
                 courseId="free-library" // Dummy ID
                 lessonId={lesson.id}
                 onLessonComplete={handleLessonComplete}
               />
            </div>

            {/* Content Tabs */}
            <div>
               <div className="flex border-b border-slate-100 mb-6">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={cn(
                      "pb-3 px-1 text-sm font-semibold border-b-2 transition-colors mr-6",
                      activeTab === 'analysis' 
                        ? "border-primary-600 text-primary-600" 
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    AI Разбор
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={cn(
                      "pb-3 px-1 text-sm font-semibold border-b-2 transition-colors",
                      activeTab === 'materials' 
                        ? "border-primary-600 text-primary-600" 
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Описание
                  </button>
               </div>

               <div className="prose prose-slate max-w-none">
                 {activeTab === 'analysis' ? (
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <div className="flex items-center mb-4">
                       <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3 text-amber-600">
                         <Sparkles className="w-4 h-4" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 m-0">Ключевые моменты</h3>
                     </div>
                     <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                       {lesson.aiAnalysisText || "Для этого урока пока нет автоматического разбора."}
                     </div>
                   </div>
                 ) : (
                   <div>
                     <p className="text-slate-700 leading-relaxed text-lg">
                       {lesson.description}
                     </p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CTA & Recommendations */}
          <div className="space-y-6">
            {/* Course CTA Card */}
            {linkedCourse && (
              <Card className="border-primary-100 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                <CardContent className="p-6 relative z-10">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                      Рекомендуемый курс
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                      {linkedCourse.title}
                    </h3>
                  </div>
                  
                  <div className="aspect-video bg-slate-200 rounded-lg mb-4 overflow-hidden relative">
                     {linkedCourse.thumbnail && (
                       <img src={linkedCourse.thumbnail} alt="" className="w-full h-full object-cover" />
                     )}
                  </div>

                  <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                    {linkedCourse.shortDescription}
                  </p>

                  <Link href={isCoursePurchased ? `/buyer/courses/${linkedCourse.id}` : `/buyer/catalog`}>
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20">
                      {isCoursePurchased ? 'Продолжить обучение' : (lesson.ctaText || 'Перейти к курсу')}
                      {isCoursePurchased ? <PlayCircle className="w-4 h-4 ml-2" /> : <ExternalLink className="w-4 h-4 ml-2" />}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* More Lessons */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Другие уроки автора</h3>
              <div className="space-y-3">
                {otherLessons.map(other => (
                  <Link key={other.id} href={`/buyer/lessons/${other.id}`} className="block group">
                    <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {other.coverImageUrl ? (
                          <img src={other.coverImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <Video className="w-6 h-6" />
                           </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                           {other.title}
                         </h4>
                         <span className="text-xs text-slate-400 mt-1 block">
                           {formatDistanceToNow(new Date(other.createdAt), { addSuffix: true, locale: ru })}
                         </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {otherLessons.length === 0 && (
                  <p className="text-sm text-slate-400 italic">Нет других уроков</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
