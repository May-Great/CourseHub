import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { User, Star, Clock, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react';
import { useStudentStore } from '@/lib/stores/studentStore';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  showBuyButton?: boolean;
  showProgress?: boolean;
  progress?: number;
  onBuy?: (courseId: string) => void;
  hideAuthor?: boolean;
}

export function CourseCard({ 
  course, 
  showBuyButton = false, 
  showProgress = false,
  progress = 0,
  onBuy,
  hideAuthor = false
}: CourseCardProps) {
  const { isCourseSaved, toggleSaveCourse } = useStudentStore();
  const isSaved = isCourseSaved(course.id);
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveCourse(course.id);
  };
  
  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-300 border border-slate-100 hover:border-primary-100 flex flex-col h-full relative">
      
      {/* Save Button (Absolute) */}
      <button 
        onClick={handleSave}
        className={cn(
          "absolute top-3 left-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200",
          isSaved 
            ? "bg-white text-primary-600 shadow-md" 
            : "bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100"
        )}
        title={isSaved ? "Remove from saved" : "Save course"}
      >
        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
      </button>

      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          {course.price === 0 ? (
            <div className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {strings.free}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/50">
              {formatPrice(course.price)}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded-md">
            {course.category}
          </span>
          <div className="flex items-center text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-current mr-1" />
            {course.rating}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {course.shortDescription}
        </p>
        
        {/* Meta Info */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            {!hideAuthor && (
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5" />
                {course.authorName}
              </span>
            )}
            <span className="flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              {totalLessons} {strings.lessons}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Progress</span>
              <span className="text-primary-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Actions - Visible on Hover */}
        <div className="mt-4 pt-0 h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 group-hover:pt-2 transition-all duration-300">
          <Link 
            href={showBuyButton ? `/buyer/courses/${course.id}` : `/author/courses/${course.id}`}
            className="block"
          >
            <Button 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none"
            >
              {showBuyButton ? 'View Details' : 'Edit Course'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
