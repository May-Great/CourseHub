"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/lib/stores/courseStore';
import { useProgressStore } from '@/lib/stores/progressStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useSocialStore } from '@/lib/stores/socialStore';
import { 
  PlayCircle, CheckCircle, Lock, Menu, ChevronLeft, ChevronRight, 
  FileText, Clock, Award, MessageSquare, Star, Users 
} from 'lucide-react';
import { InteractiveVideoPlayer as VideoPlayer } from '@/components/video/VideoPlayer';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { CommentSection } from '@/components/social/CommentSection';
import { CohortChat } from '@/components/social/CohortChat';
import { CourseReviews } from '@/components/social/CourseReviews';
import { cn } from '@/lib/utils';
import { Lesson, CourseTheme } from '@/lib/types';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const { courses } = useCourseStore();
  const { userProgress, completeLesson, getUserProgress } = useProgressStore();
  const { currentUser: user } = useAuthStore();
  
  const course = courses.find(c => c.id === courseId);
  const userCourseProgress = user ? getUserProgress(user.id, courseId) : undefined;
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'discussion' | 'chat' | 'reviews'>('overview');

  // Initialize active lesson based on progress or first lesson
  useEffect(() => {
    if (course && !activeLesson) {
      // Try to find the last watched or first uncompleted lesson
      // For now, just default to the first lesson of the first module
      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
    }
  }, [course, activeLesson]);

  if (!course) {
    return <div className="p-8 text-center">Курс не найден</div>;
  }

  const handleLessonComplete = () => {
    if (user && activeLesson) {
      completeLesson(user.id, courseId, activeLesson.id);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userCourseProgress?.completedLessons.includes(lessonId) || false;
  };

  // Helper to get total lessons count
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedCount = userCourseProgress?.completedLessons.length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Apply theme styles
  const theme = course.theme;
  const themeStyles = theme ? {
    '--primary': theme.primaryColor,
    '--bg-color': theme.backgroundColor,
    '--font-family': theme.fontFamily === 'serif' ? 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' : 
                     theme.fontFamily === 'mono' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : 
                     'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  } as React.CSSProperties : {};

  // Custom class for primary color text/bg based on theme (simplified approach)
  // Real implementation would parse hex to RGB for tailwind opacity utilities or use inline styles more extensively
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family-name:var(--font-family)]" style={themeStyles}>
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/buyer/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             {/* Use theme primary color if available, else default indigo */}
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: theme?.primaryColor || '#4f46e5' }}
            >
              {course.title.charAt(0)}
            </div>
            <h1 className="font-semibold text-slate-900 hidden md:block">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <div className="text-xs text-slate-500 mb-1">Прогресс курса</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: theme?.primaryColor || '#4f46e5'
                }}
              />
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Lesson Content Viewer */}
            {activeLesson ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Lesson Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <span className="font-medium text-slate-900">
                      Модуль {course.modules.findIndex(m => m.lessons.some(l => l.id === activeLesson.id)) + 1}
                    </span>
                    <span>•</span>
                    <span>Урок {activeLesson.order}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                </div>

                {/* Content Player */}
                <div className="bg-slate-900 aspect-video relative">
                  {activeLesson.type === 'video' ? (
                     <VideoPlayer 
                       src={activeLesson.content} 
                       courseId={courseId}
                       lessonId={activeLesson.id}
                       materials={activeLesson.materials}
                       onLessonComplete={handleLessonComplete}
                     />
                  ) : activeLesson.type === 'quiz' && activeLesson.quiz ? (
                     <div className="h-full w-full bg-slate-50 overflow-y-auto p-6">
                       <QuizPlayer 
                         quiz={activeLesson.quiz}
                         onComplete={(score) => {
                           if (score >= (activeLesson.quiz?.passingScore || 0)) {
                             handleLessonComplete();
                           }
                         }}
                       />
                     </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-slate-800 p-8 text-center">
                      <div>
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Это текстовый урок или задание.</p>
                        <p className="text-sm opacity-70 mt-2">Контент: {activeLesson.content}</p>
                        <button 
                          onClick={handleLessonComplete}
                          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                          style={{ backgroundColor: theme?.primaryColor }}
                        >
                          Отметить как пройденный
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Description & Actions */}
                <div className="p-6">
                   <div className="prose max-w-none text-slate-600 mb-8">
                     {activeLesson.description}
                   </div>

                   {/* Tabs for extra content */}
                   <div className="border-b border-slate-200 mb-6">
                     <nav className="flex gap-6">
                       <button 
                         onClick={() => setActiveTab('overview')}
                         className={cn(
                           "pb-3 text-sm font-medium border-b-2 transition-colors",
                           activeTab === 'overview' 
                             ? "border-indigo-600 text-indigo-600" 
                             : "border-transparent text-slate-500 hover:text-slate-700"
                         )}
                         style={activeTab === 'overview' ? { borderColor: theme?.primaryColor, color: theme?.primaryColor } : {}}
                       >
                         Обзор
                       </button>
                       <button 
                         onClick={() => setActiveTab('discussion')}
                         className={cn(
                           "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                           activeTab === 'discussion'
                             ? "border-indigo-600 text-indigo-600" 
                             : "border-transparent text-slate-500 hover:text-slate-700"
                         )}
                         style={activeTab === 'discussion' ? { borderColor: theme?.primaryColor, color: theme?.primaryColor } : {}}
                       >
                         <MessageSquare className="w-4 h-4" />
                         Обсуждение
                       </button>
                       <button 
                         onClick={() => setActiveTab('chat')}
                         className={cn(
                           "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                           activeTab === 'chat'
                             ? "border-indigo-600 text-indigo-600" 
                             : "border-transparent text-slate-500 hover:text-slate-700"
                         )}
                         style={activeTab === 'chat' ? { borderColor: theme?.primaryColor, color: theme?.primaryColor } : {}}
                       >
                         <Users className="w-4 h-4" />
                         Чат потока
                       </button>
                       <button 
                         onClick={() => setActiveTab('reviews')}
                         className={cn(
                           "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                           activeTab === 'reviews'
                             ? "border-indigo-600 text-indigo-600" 
                             : "border-transparent text-slate-500 hover:text-slate-700"
                         )}
                         style={activeTab === 'reviews' ? { borderColor: theme?.primaryColor, color: theme?.primaryColor } : {}}
                       >
                         <Star className="w-4 h-4" />
                         Отзывы
                       </button>
                     </nav>
                   </div>

                   {/* Tab Content */}
                   <div>
                     {activeTab === 'overview' && (
                       <div className="space-y-4">
                         <h3 className="font-semibold text-slate-900">Материалы урока</h3>
                         {activeLesson.materials && activeLesson.materials.length > 0 ? (
                           <ul className="space-y-2">
                             {activeLesson.materials.map((material, idx) => (
                               <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
                                 <div className="p-2 bg-white rounded-md shadow-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
                                   <FileText className="w-5 h-5" />
                                 </div>
                                 <div className="flex-1">
                                   <div className="font-medium text-slate-900">{material.title}</div>
                                   <div className="text-xs text-slate-500 uppercase">{material.type}</div>
                                 </div>
                                 <a href={material.url || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1 bg-indigo-50 rounded-md">
                                   Скачать
                                 </a>
                               </li>
                             ))}
                           </ul>
                         ) : (
                           <p className="text-slate-500 text-sm italic">Нет дополнительных материалов к этому уроку.</p>
                         )}
                       </div>
                     )}

                     {activeTab === 'discussion' && (
                       <CommentSection 
                         lessonId={activeLesson.id} 
                         currentUser={user || { id: 'guest', name: 'Guest' }}
                       />
                     )}
                     
                     {activeTab === 'chat' && (
                       <CohortChat courseId={course.id} />
                     )}
                     
                     {activeTab === 'reviews' && (
                       <CourseReviews courseId={course.id} />
                     )}
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <PlayCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Выберите урок</h2>
                <p className="text-slate-500 mt-2">Начните обучение, выбрав урок из меню слева</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Navigation */}
        <aside className={cn(
          "w-80 bg-white border-l border-slate-200 flex-shrink-0 flex flex-col transition-all duration-300 absolute inset-y-0 right-0 lg:static lg:transform-none z-10",
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:w-80",
          !isSidebarOpen && "lg:w-0 lg:overflow-hidden lg:border-l-0"
        )}>
           <div className="p-4 border-b border-slate-100 flex items-center justify-between">
             <h3 className="font-semibold text-slate-900">Содержание</h3>
             <button 
               onClick={() => setIsSidebarOpen(false)}
               className="p-1 hover:bg-slate-100 rounded-md text-slate-500 lg:hidden"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {course.modules.map((module, mIdx) => (
               <div key={module.id} className="border-b border-slate-100 last:border-0">
                 <div className="px-4 py-3 bg-slate-50 font-medium text-slate-800 text-sm flex items-center justify-between sticky top-0 z-10">
                   <span>Модуль {mIdx + 1}: {module.title}</span>
                 </div>
                 <div>
                   {module.lessons.map((lesson, lIdx) => {
                     const isCompleted = isLessonCompleted(lesson.id);
                     const isActive = activeLesson?.id === lesson.id;
                     const isLocked = false; // Implement locking logic later

                     return (
                       <button
                         key={lesson.id}
                         onClick={() => setActiveLesson(lesson)}
                         className={cn(
                           "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors hover:bg-slate-50",
                           isActive ? "bg-indigo-50 border-l-4 border-indigo-600" : "border-l-4 border-transparent"
                         )}
                         style={isActive ? { backgroundColor: `${theme?.primaryColor}10`, borderColor: theme?.primaryColor } : {}}
                       >
                         <div className="mt-0.5">
                           {isCompleted ? (
                             <CheckCircle className="w-4 h-4 text-emerald-500" />
                           ) : isLocked ? (
                             <Lock className="w-4 h-4 text-slate-300" />
                           ) : (
                             <div className={cn(
                               "w-4 h-4 rounded-full border-2",
                               isActive ? "border-indigo-600" : "border-slate-300"
                             )} 
                             style={isActive ? { borderColor: theme?.primaryColor } : {}}
                             />
                           )}
                         </div>
                         <div>
                           <div className={cn(
                             "text-sm font-medium line-clamp-2",
                             isActive ? "text-indigo-900" : "text-slate-700",
                             isCompleted && "text-slate-500"
                           )}
                           style={isActive ? { color: theme?.primaryColor } : {}}
                           >
                             {lIdx + 1}. {lesson.title}
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs text-slate-400 flex items-center gap-1">
                               <Clock className="w-3 h-3" />
                               {lesson.duration ? `${Math.ceil(lesson.duration / 60)} мин` : '10 мин'}
                             </span>
                             {lesson.type === 'video' && (
                               <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Видео</span>
                             )}
                             {lesson.type === 'quiz' && (
                               <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">Тест</span>
                             )}
                           </div>
                         </div>
                       </button>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
        </aside>
      </div>
    </div>
  );
}
