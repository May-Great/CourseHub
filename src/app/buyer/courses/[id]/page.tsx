"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/lib/stores/courseStore';
import { useProgressStore } from '@/lib/stores/progressStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useSocialStore } from '@/lib/stores/socialStore';
import { useStudentStore } from '@/lib/stores/studentStore';
import { useAppStore } from '@/lib/stores'; // Keeping for other legacy props if any
import { EnrollButton } from '@/components/course/EnrollButton';
import { 
  PlayCircle, CheckCircle, Lock, Menu, ChevronLeft, ChevronRight, 
  FileText, Clock, Award, MessageSquare, Star, Users 
} from 'lucide-react';
import { InteractiveVideoPlayer as VideoPlayer } from '@/components/video/VideoPlayer';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { CommentSection } from '@/components/social/CommentSection';
import { CohortChat } from '@/components/social/CohortChat';
import { CourseReviews } from '@/components/social/CourseReviews';
import { Certificate } from '@/components/course/Certificate';
import { cn } from '@/lib/utils';
import { Lesson, CourseTheme } from '@/lib/types';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const { courses } = useCourseStore();
  const { userProgress, completeLesson, getUserProgress } = useProgressStore();
  const { currentUser: user } = useAuthStore();
  const { purchasedCourses } = useStudentStore();
  
  const course = courses.find(c => c.id === courseId);
  const userCourseProgress = user ? getUserProgress(user.id, courseId) : undefined;
  
  const isPurchased = course && purchasedCourses.includes(course.id);
  const isLocked = course && course.price > 0 && !isPurchased;
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'discussion' | 'chat' | 'reviews' | 'certificate'>('overview');

  // Initialize active lesson based on progress or first lesson
  useEffect(() => {
    if (course && !activeLesson) {
      // Try to find the last watched or first uncompleted lesson
      // For now, just default to the first lesson of the first module
      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

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
  
  // Font Family
  const fontFamilyClass = theme?.fontFamily === 'serif' ? 'font-serif' : 
                         theme?.fontFamily === 'mono' ? 'font-mono' : 
                         'font-sans';

  // Button Radius
  const buttonRadiusClass = theme?.buttonStyle === 'pill' ? 'rounded-full' :
                           theme?.buttonStyle === 'sharp' ? 'rounded-none' :
                           'rounded-lg';

  const themeStyles = theme ? {
    '--primary': theme.primaryColor,
    '--bg-color': theme.backgroundColor,
  } as React.CSSProperties : {};

  // Layout logic
  const isSidebarLeft = theme?.layout === 'sidebar-left';
  const isCentered = theme?.layout === 'centered';
  const isImmersive = theme?.layout === 'immersive';

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", fontFamilyClass)} 
         style={{ ...themeStyles, backgroundColor: theme?.backgroundColor || '#f8fafc' }}>
      {/* Top Navigation */}
      <header className={cn(
        "border-b h-16 flex items-center justify-between px-4 z-20 sticky top-0 shadow-sm transition-colors duration-300",
        isImmersive ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/buyer/dashboard')}
            className={cn(
              "p-2 rounded-full transition-colors",
              isImmersive ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             {/* Use theme primary color if available, else default indigo */}
            <div 
              className={cn("w-8 h-8 flex items-center justify-center text-white font-bold", buttonRadiusClass)}
              style={{ backgroundColor: theme?.primaryColor || '#4f46e5' }}
            >
              {course.title.charAt(0)}
            </div>
            <h1 className={cn("font-semibold hidden md:block", isImmersive ? "text-white" : "text-slate-900")}>
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <div className={cn("text-xs mb-1", isImmersive ? "text-slate-400" : "text-slate-500")}>Прогресс курса</div>
            <div className={cn("w-32 h-2 rounded-full overflow-hidden", isImmersive ? "bg-slate-800" : "bg-slate-100")}>
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
            className={cn(
              "p-2 rounded-lg lg:hidden",
              isImmersive ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            )}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className={cn("flex flex-1 overflow-hidden relative", isSidebarLeft && "flex-row-reverse")}>
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth",
          isCentered && "flex justify-center"
        )}>
          <div className={cn("w-full space-y-6", isCentered ? "max-w-3xl" : "max-w-4xl mx-auto")}>
            
            {/* Lesson Content Viewer */}
            {activeLesson ? (
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isImmersive ? "bg-slate-900 border-slate-800 shadow-xl" : "bg-white border border-slate-200 shadow-sm",
                buttonRadiusClass === 'rounded-none' ? 'rounded-none' : 'rounded-2xl'
              )}>
                {/* Lesson Header */}
                <div className={cn("p-6 border-b", isImmersive ? "border-slate-800" : "border-slate-100")}>
                  <div className={cn("flex items-center gap-2 text-sm mb-2", isImmersive ? "text-slate-400" : "text-slate-500")}>
                    <span className={cn("font-medium", isImmersive ? "text-slate-200" : "text-slate-900")}>
                      Модуль {course.modules.findIndex(m => m.lessons.some(l => l.id === activeLesson.id)) + 1}
                    </span>
                    <span>•</span>
                    <span>Урок {activeLesson.order}</span>
                  </div>
                  <h2 className={cn("text-2xl font-bold", isImmersive ? "text-white" : "text-slate-900")}>
                    {activeLesson.title}
                  </h2>
                </div>

                {/* Content Player */}
                <div className="bg-slate-900 aspect-video relative">
                  {isLocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10 text-white p-6 text-center">
                      <Lock className="w-16 h-16 text-slate-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Доступ закрыт</h3>
                      <p className="text-slate-400 mb-6 max-w-md">
                        Этот урок доступен только после покупки курса. Приобретите полный доступ, чтобы продолжить обучение.
                      </p>
                      <EnrollButton 
                        course={course} 
                        size="lg" 
                        className={cn("bg-indigo-600 hover:bg-indigo-700 text-white border-none", buttonRadiusClass)}
                      />
                    </div>
                  ) : null}
                  
                  {activeLesson.type === 'video' ? (
                     <VideoPlayer 
                       src={activeLesson.content} 
                       courseId={courseId}
                       lessonId={activeLesson.id}
                       materials={activeLesson.materials}
                       onLessonComplete={handleLessonComplete}
                     />
                  ) : activeLesson.type === 'quiz' && activeLesson.quiz ? (
                     <div className={cn("h-full w-full overflow-y-auto p-6", isImmersive ? "bg-slate-800" : "bg-slate-50")}>
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
                          className={cn("mt-6 px-6 py-2 text-white transition-colors", buttonRadiusClass)}
                          style={{ backgroundColor: theme?.primaryColor || '#4f46e5' }}
                        >
                          Отметить как пройденный
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Description & Actions */}
                <div className={cn("p-6", isImmersive ? "bg-slate-900 text-slate-300" : "bg-white")}>
                   <div className={cn("prose max-w-none mb-8", isImmersive ? "prose-invert" : "text-slate-600")}>
                     {activeLesson.description}
                   </div>

                   {/* Tabs for extra content */}
                   <div className={cn("border-b mb-6", isImmersive ? "border-slate-800" : "border-slate-200")}>
                     <nav className="flex gap-6">
                       {[
                         { id: 'overview', label: 'Обзор', icon: null },
                         { id: 'discussion', label: 'Обсуждение', icon: MessageSquare },
                         { id: 'chat', label: 'Чат потока', icon: Users },
                         { id: 'reviews', label: 'Отзывы', icon: Star },
                       ].map((tab) => (
                         <button 
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as typeof activeTab)}
                           className={cn(
                             "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                             activeTab === tab.id
                               ? "" // Active color handled by style
                               : isImmersive ? "border-transparent text-slate-500 hover:text-slate-300" : "border-transparent text-slate-500 hover:text-slate-700"
                           )}
                           style={activeTab === tab.id ? { borderColor: theme?.primaryColor || '#4f46e5', color: theme?.primaryColor || '#4f46e5' } : {}}
                         >
                           {tab.icon && <tab.icon className="w-4 h-4" />}
                           {tab.label}
                         </button>
                       ))}
                     </nav>
                   </div>

                   {/* Tab Content */}
                   <div>
                     {activeTab === 'overview' && (
                       <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <h3 className={cn("font-semibold", isImmersive ? "text-white" : "text-slate-900")}>Материалы урока</h3>
                         {activeLesson.materials && activeLesson.materials.length > 0 ? (
                           <ul className="space-y-2">
                             {activeLesson.materials.map((material, idx) => (
                               <li key={idx} className={cn(
                                 "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer group",
                                 isImmersive 
                                   ? "bg-slate-800 border-slate-700 hover:border-slate-600" 
                                   : "bg-slate-50 border-slate-100 hover:border-slate-200"
                               )}>
                                 <div className={cn(
                                   "p-2 rounded-md shadow-sm transition-colors",
                                   isImmersive ? "bg-slate-700 text-slate-400 group-hover:text-white" : "bg-white text-slate-500 group-hover:text-indigo-600"
                                 )}>
                                   <FileText className="w-5 h-5" />
                                 </div>
                                 <div className="flex-1">
                                   <div className={cn("font-medium", isImmersive ? "text-slate-200" : "text-slate-900")}>{material.title}</div>
                                   <div className="text-xs text-slate-500 uppercase">{material.type}</div>
                                 </div>
                                 <a 
                                   href={material.url || '#'} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className={cn("text-sm font-medium px-3 py-1 rounded-md transition-colors", buttonRadiusClass)}
                                   style={{ 
                                     backgroundColor: isImmersive ? 'rgba(255,255,255,0.1)' : `${theme?.primaryColor || '#4f46e5'}10`,
                                     color: theme?.primaryColor || '#4f46e5'
                                   }}
                                 >
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
                       <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <CommentSection 
                           lessonId={activeLesson.id} 
                           currentUser={user || { id: 'guest', name: 'Guest' }}
                         />
                       </div>
                     )}
                     
                     {activeTab === 'chat' && (
                       <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <CohortChat 
                           courseId={course.id} 
                           className="h-[calc(100vh-350px)] min-h-[500px]" 
                           height="auto" 
                         />
                       </div>
                     )}
                     
                     {activeTab === 'reviews' && (
                       <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <CourseReviews courseId={course.id} />
                       </div>
                     )}
                     
                     {activeTab === 'certificate' && user && (
                       <div className="flex justify-center py-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <Certificate 
                           course={course} 
                           user={user} 
                           completionDate={new Date().toISOString()} 
                         />
                       </div>
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
          "w-80 border-l flex-shrink-0 flex flex-col transition-all duration-300 absolute inset-y-0 right-0 lg:static lg:transform-none z-10",
          isImmersive ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:w-80",
          !isSidebarOpen && "lg:w-0 lg:overflow-hidden lg:border-l-0"
        )}>
           <div className={cn("p-4 border-b flex items-center justify-between", isImmersive ? "border-slate-800" : "border-slate-100")}>
             <h3 className={cn("font-semibold", isImmersive ? "text-white" : "text-slate-900")}>Содержание</h3>
             <button 
               onClick={() => setIsSidebarOpen(false)}
               className={cn("p-1 rounded-md lg:hidden", isImmersive ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {course.modules.map((module, mIdx) => (
               <div key={module.id} className={cn("border-b last:border-0", isImmersive ? "border-slate-800" : "border-slate-100")}>
                 <div className={cn(
                   "px-4 py-3 font-medium text-sm flex items-center justify-between sticky top-0 z-10",
                   isImmersive ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-800"
                 )}>
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
                           "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
                           isImmersive ? "hover:bg-slate-800" : "hover:bg-slate-50",
                           isActive 
                             ? isImmersive ? "bg-slate-800 border-l-4" : "bg-indigo-50 border-l-4" 
                             : "border-l-4 border-transparent"
                         )}
                         style={isActive ? { 
                           borderColor: theme?.primaryColor || '#4f46e5',
                           backgroundColor: isImmersive ? 'rgba(255,255,255,0.05)' : `${theme?.primaryColor || '#4f46e5'}10`
                         } : {}}
                       >
                         <div className="mt-0.5">
                           {isCompleted ? (
                             <CheckCircle className="w-4 h-4 text-emerald-500" />
                           ) : isLocked ? (
                             <Lock className={cn("w-4 h-4", isImmersive ? "text-slate-600" : "text-slate-300")} />
                           ) : (
                             <div className={cn(
                               "w-4 h-4 rounded-full border-2",
                               isActive ? "" : isImmersive ? "border-slate-600" : "border-slate-300"
                             )} 
                             style={isActive ? { borderColor: theme?.primaryColor || '#4f46e5' } : {}}
                             />
                           )}
                         </div>
                         <div>
                           <div className={cn(
                             "text-sm font-medium line-clamp-2",
                             isActive 
                               ? "" // Color handled by style
                               : isCompleted ? "text-slate-500" : isImmersive ? "text-slate-300" : "text-slate-700"
                           )}
                           style={isActive ? { color: theme?.primaryColor || '#4f46e5' } : {}}
                           >
                             {lIdx + 1}. {lesson.title}
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                             <span className={cn("text-xs flex items-center gap-1", isImmersive ? "text-slate-500" : "text-slate-400")}>
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
