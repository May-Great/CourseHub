import Link from 'next/link';
import Image from 'next/image';
import { MiniLesson } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Play, Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { useStudentStore } from '@/lib/stores/studentStore';
import { cn } from '@/lib/utils';

interface MiniLessonCardProps {
  lesson: MiniLesson;
  onWatch?: (id: string) => void;
  showSaveButton?: boolean;
}

export function MiniLessonCard({ lesson, onWatch, showSaveButton = true }: MiniLessonCardProps) {
  const { isMiniLessonSaved, toggleSaveMiniLesson, watchedMiniLessons } = useStudentStore();
  const isSaved = isMiniLessonSaved(lesson.id);
  const isWatched = watchedMiniLessons.some(w => w.lessonId === lesson.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveMiniLesson(lesson.id);
  };

  return (
    <Link href={`/buyer/lessons/${lesson.id}`} className="group h-full block">
      <Card variant="hover" className="h-full flex flex-col border-slate-200 hover:border-primary-200 relative overflow-hidden">
        
        {/* Save Button */}
        {showSaveButton && (
          <button 
            onClick={handleSave}
            className={cn(
              "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200",
              isSaved 
                ? "bg-white text-primary-600 shadow-md" 
                : "bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100"
            )}
            title={isSaved ? "Убрать из избранного" : "Сохранить"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}

        {/* Watched Badge */}
        {isWatched && (
          <div className="absolute top-3 left-3 z-20 bg-emerald-500/90 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg flex items-center">
            <Check className="w-3 h-3 mr-1" /> Просмотрено
          </div>
        )}

        <div className="aspect-video bg-slate-100 relative overflow-hidden">
          {lesson.coverImageUrl && (
            <Image 
              src={lesson.coverImageUrl} 
              alt={lesson.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-slate-900 ml-1" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {lesson.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
            {lesson.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
             <span>Мини-урок</span>
             {lesson.views !== undefined && (
               <span>{lesson.views} просмотров</span>
             )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
