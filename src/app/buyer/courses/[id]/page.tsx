'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore, useAppStore, useAssignmentStore } from '@/lib/stores';
import { Lesson } from '@/lib/types';
import { VideoPlayer } from '@/components/video';
import { cn } from '@/lib/utils';
import { AssignmentSubmission } from '@/components/assignment/AssignmentSubmission';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { ChevronRight, PlayCircle, FileText, CheckCircle, Circle, Menu, X, ArrowLeft, ArrowRight, MonitorPlay, Maximize2, HelpCircle } from 'lucide-react';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment' | 'discussion'>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const { courses, initialize: initCourses } = useCourseStore();
  const { userProgress, updateProgress } = useAppStore();
  const { getSubmissionsByUser } = useAssignmentStore();
  
  useEffect(() => {
    initCourses();
  }, [initCourses]);
  
  const course = courses.find(c => c.id === courseId);
  const progress = userProgress.find(p => p.courseId === courseId);
  const userSubmissions = getSubmissionsByUser('current-user');
  
  const theme = course?.theme || {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    fontFamily: 'sans',
    layout: 'default',
    buttonStyle: 'rounded'
  };

  // Dynamic Styles
  const primaryColorStyle = {
    '--primary': theme.primaryColor,
    '--primary-50': `${theme.primaryColor}10`, // 10% opacity
    '--primary-100': `${theme.primaryColor}20`, // 20% opacity
  } as React.CSSProperties;
  
  // Flatten lessons structure for easy navigation
  const allLessons = useMemo(() => {
    const lessons: (Lesson & { moduleTitle: string; moduleId: string })[] = [];
    course?.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        lessons.push({ ...lesson, moduleTitle: module.title, moduleId: module.id });
      });
    });
    return lessons;
  }, [course]);
  
  const selectedLesson = allLessons.find(l => l.id === selectedLessonId);
  const currentLessonIndex = allLessons.findIndex(l => l.id === selectedLessonId);
  
  useEffect(() => {
    if (allLessons.length > 0 && !selectedLessonId) {
      const lastWatched = progress?.currentLesson || allLessons[0].id;
      setSelectedLessonId(lastWatched);
    }
  }, [allLessons, selectedLessonId, progress]);
  
  if (!course) return null;
  
  const handleLessonComplete = (lessonId: string) => {
    const newProgress = {
      userId: 'current-user',
      courseId,
      completedLessons: progress?.completedLessons.includes(lessonId) 
        ? progress.completedLessons 
        : [...(progress?.completedLessons || []), lessonId],
      currentLesson: lessonId,
      enrolledAt: progress?.enrolledAt || new Date().toISOString(),
      completedAssignments: progress?.completedAssignments || [],
      notes: progress?.notes || [],
      bookmarks: progress?.bookmarks || [],
      streak: progress?.streak || 0,
      totalTimeSpent: progress?.totalTimeSpent || 0,
      achievements: progress?.achievements || []
    };
    updateProgress(newProgress);
  };
  
  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setSelectedLessonId(nextLesson.id);
      handleLessonComplete(selectedLessonId);
    }
  };
  
  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setSelectedLessonId(prevLesson.id);
    }
  };
  
  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };

  const currentSubmission = selectedLesson?.assignment 
    ? userSubmissions.find(s => s.assignmentId === selectedLesson.assignment!.id)
    : undefined;
  
  const renderSidebar = () => (
    <div className={cn(
      "w-80 md:w-96 bg-white border-l border-slate-100 overflow-y-auto transition-all duration-300 ease-in-out shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-30 fixed inset-y-0 right-0 md:relative",
      theme.layout === 'sidebar-left' && "order-first border-l-0 border-r",
      !isSidebarOpen && (theme.layout === 'sidebar-left' ? "-translate-x-full md:-ml-96" : "translate-x-full md:-mr-96"),
      isSidebarOpen && "translate-x-0"
    )} style={primaryColorStyle}>
      <div className="p-6 border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("font-bold text-slate-900 text-lg", theme.fontFamily === 'serif' && 'font-serif')}>
            Содержание курса
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
           <div 
             className="h-2 rounded-full transition-all duration-500"
             style={{ width: `${Math.round((progress?.completedLessons.length || 0) / allLessons.length * 100)}%`, backgroundColor: theme.primaryColor }}
           />
        </div>
        <div className="text-xs font-semibold text-slate-500 text-right">
           {Math.round((progress?.completedLessons.length || 0) / allLessons.length * 100)}% ЗАВЕРШЕНО
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {course.modules.map((module, mIdx) => (
          <div key={module.id} className="space-y-2">
            <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <span 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white mr-2 font-bold"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {mIdx + 1}
              </span>
              {module.title}
            </div>
            <div className="space-y-1">
              {module.lessons.map((lesson, lIdx) => {
                const isActive = selectedLessonId === lesson.id;
                const isCompleted = isLessonCompleted(lesson.id);
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={cn(
                      "w-full flex items-start text-left px-4 py-3.5 rounded-xl transition-all group relative border",
                      theme.buttonStyle === 'pill' && "rounded-full px-6",
                      theme.buttonStyle === 'sharp' && "rounded-none",
                      isActive 
                        ? "bg-[var(--primary-50)] border-[var(--primary-100)] shadow-sm" 
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors",
                      isCompleted ? "text-emerald-500" : isActive ? "text-[var(--primary)]" : "text-slate-300"
                    )}>
                      {isCompleted ? <CheckCircle className="w-5 h-5 fill-emerald-100" /> : 
                       isActive ? <PlayCircle className="w-5 h-5 fill-[var(--primary-50)]" /> : 
                       <Circle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-semibold leading-snug transition-colors truncate",
                        isActive ? "text-slate-900" : "text-slate-700",
                        theme.fontFamily === 'serif' && "font-serif"
                      )}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <span className="capitalize">
                           {lesson.type === 'video' ? 'Видео' : lesson.type === 'quiz' ? 'Тест' : 'Текст'}
                        </span>
                        {lesson.duration && (
                          <>
                            <span className="mx-1.5">•</span>
                            <span>{Math.ceil(lesson.duration / 60)} мин</span>
                          </>
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
    </div>
  );

  return (
    <div 
      className={cn(
        "flex h-[calc(100vh-64px)] overflow-hidden transition-colors duration-500",
        theme.fontFamily === 'serif' ? 'font-serif' : theme.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
      )}
      style={{ 
        backgroundColor: theme.backgroundColor,
        ...primaryColorStyle 
      }}
    >
      {/* Immersive Mode Background */}
      {theme.layout === 'immersive' && (
        <div className="absolute inset-0 bg-slate-900 z-0 pointer-events-none" />
      )}

      {/* Sidebar (Conditionally rendered first if layout is left) */}
      {theme.layout === 'sidebar-left' && renderSidebar()}

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 overflow-y-auto relative scroll-smooth z-10",
        theme.layout === 'immersive' ? "bg-slate-900 text-white" : "",
        theme.layout === 'centered' && "flex justify-center"
      )}>
        <div className={cn(
          "w-full p-6 md:p-8 pb-24 transition-all duration-300",
          theme.layout === 'centered' ? "max-w-4xl" : "max-w-6xl mx-auto",
          theme.layout === 'immersive' && "max-w-full px-0"
        )}>
          {selectedLesson && (
            <>
              {/* Header */}
              <div className={cn(
                "mb-6 flex items-center justify-between",
                theme.layout === 'immersive' && "px-8 pt-4"
              )}>
                <div>
                  <Breadcrumbs 
                    items={[
                      { label: 'Курсы', href: '/buyer/courses' },
                      { label: course.title, href: `/buyer/courses/${courseId}` },
                      { label: selectedLesson.title }
                    ]} 
                    className={cn("mb-4", theme.layout === 'immersive' && "text-slate-400")}
                  />
                  <h1 className={cn(
                    "text-3xl font-bold tracking-tight",
                    theme.layout === 'immersive' ? "text-white" : "text-slate-900"
                  )}>
                    {selectedLesson.title}
                  </h1>
                </div>
                
                <div className="flex items-center gap-3">
                  {!isSidebarOpen && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSidebarOpen(true)}
                      className={cn(theme.layout === 'immersive' && "bg-white/10 text-white border-white/20 hover:bg-white/20")}
                    >
                      <Menu className="w-4 h-4 mr-2" />
                      Содержание
                    </Button>
                  )}
                </div>
              </div>

              {/* Lesson Content Container */}
              <div className={cn(
                "relative overflow-hidden shadow-2xl shadow-slate-900/10 mb-8 bg-white",
                theme.layout === 'immersive' ? "rounded-none" : "rounded-2xl border border-slate-100"
              )}>
                {selectedLesson.type === 'video' ? (
                  <div className={cn(theme.layout === 'immersive' ? "aspect-[21/9]" : "aspect-video")}>
                     <VideoPlayer
                       src={selectedLesson.content}
                       courseId={courseId}
                       lessonId={selectedLesson.id}
                       materials={selectedLesson.materials || []}
                       onNext={handleNextLesson}
                       onPrevious={handlePreviousLesson}
                       hasNext={currentLessonIndex < allLessons.length - 1}
                       hasPrevious={currentLessonIndex > 0}
                       onLessonComplete={() => handleLessonComplete(selectedLesson.id)}
                     />
                  </div>
                ) : selectedLesson.type === 'quiz' && selectedLesson.quiz ? (
                  <div className="min-h-[500px]">
                     <QuizPlayer 
                       quiz={selectedLesson.quiz}
                       onComplete={(score) => {
                         if (score >= selectedLesson.quiz!.passingScore) {
                           handleLessonComplete(selectedLesson.id);
                         }
                       }}
                       onNext={handleNextLesson}
                     />
                  </div>
                ) : (
                  <div className="p-8 md:p-12 min-h-[400px]">
                    <div className="prose max-w-none">
                       {/* Render HTML/Markdown content here if needed, for now just text */}
                       <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800">
                         {selectedLesson.content}
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Controls (Only for non-quiz or completed quiz) */}
              {selectedLesson.type !== 'quiz' && (
                <div className={cn(
                  "flex items-center justify-between border-b pb-8 mb-8",
                  theme.layout === 'immersive' ? "border-white/10 px-8" : "border-slate-100"
                )}>
                  <Button 
                     variant="outline" 
                     onClick={handlePreviousLesson}
                     disabled={currentLessonIndex === 0}
                     className={cn(
                       "flex items-center",
                       theme.layout === 'immersive' 
                         ? "text-white border-white/20 hover:bg-white/10 disabled:opacity-30" 
                         : "text-slate-600 border-slate-200 hover:bg-slate-50"
                     )}
                     style={theme.buttonStyle === 'pill' ? { borderRadius: '9999px' } : theme.buttonStyle === 'sharp' ? { borderRadius: '0' } : {}}
                  >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Назад
                  </Button>
                  
                  <Button 
                     onClick={handleNextLesson}
                     disabled={currentLessonIndex === allLessons.length - 1}
                     className={cn(
                       "flex items-center text-white shadow-lg",
                       theme.layout === 'immersive' ? "bg-white text-black hover:bg-white/90" : "hover:brightness-110"
                     )}
                     style={{ 
                       backgroundColor: theme.layout === 'immersive' ? '#ffffff' : theme.primaryColor,
                       borderRadius: theme.buttonStyle === 'pill' ? '9999px' : theme.buttonStyle === 'sharp' ? '0' : '0.75rem'
                     }}
                  >
                     Далее
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Tabs Content */}
              <div className={cn(
                "max-w-4xl",
                theme.layout === 'immersive' && "px-8 pb-12"
              )}>
                <div className={cn(
                  "flex space-x-8 border-b mb-8",
                  theme.layout === 'immersive' ? "border-white/10" : "border-slate-100"
                )}>
                  {['overview', 'assignment', 'discussion'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "pb-4 text-sm font-semibold capitalize transition-all relative",
                        activeTab === tab 
                          ? (theme.layout === 'immersive' ? "text-white" : "text-[var(--primary)]") 
                          : (theme.layout === 'immersive' ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800")
                      )}
                    >
                      {tab === 'overview' ? 'Обзор' : tab === 'assignment' ? 'Задание' : 'Обсуждение'}
                      {activeTab === tab && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                          style={{ backgroundColor: theme.layout === 'immersive' ? '#ffffff' : theme.primaryColor }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 'overview' && (
                    <div className={cn(
                      "prose max-w-none",
                      theme.layout === 'immersive' ? "prose-invert" : "prose-slate"
                    )}>
                      <h3 className={cn("text-xl font-bold mb-4", theme.layout === 'immersive' ? "text-white" : "text-slate-900")}>
                        Об уроке
                      </h3>
                      <p className={cn("leading-relaxed text-lg", theme.layout === 'immersive' ? "text-slate-300" : "text-slate-600")}>
                        {selectedLesson.description}
                      </p>
                      
                      {selectedLesson.materials && selectedLesson.materials.length > 0 && (
                        <div className={cn(
                          "mt-8 rounded-2xl p-6 border",
                          theme.layout === 'immersive' ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                        )}>
                          <h4 className={cn(
                            "text-sm font-bold uppercase tracking-wider mb-4 flex items-center",
                            theme.layout === 'immersive' ? "text-white" : "text-slate-900"
                          )}>
                            <FileText className="w-4 h-4 mr-2 opacity-70" />
                            Материалы
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {selectedLesson.materials.map((material, idx) => (
                              <a 
                                key={idx} 
                                href={material.url} 
                                target="_blank" 
                                className={cn(
                                  "flex items-center p-4 border rounded-xl transition-all group",
                                  theme.layout === 'immersive' 
                                    ? "bg-white/5 border-white/10 hover:bg-white/10" 
                                    : "bg-white border-slate-200 hover:border-[var(--primary)] hover:shadow-md"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors",
                                  theme.layout === 'immersive' 
                                    ? "bg-white/10 text-white" 
                                    : "bg-[var(--primary-50)] text-[var(--primary)] group-hover:bg-[var(--primary-100)]"
                                )}>
                                  <span className="text-xl">
                                    {material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '🔗'}
                                  </span>
                                </div>
                                <div>
                                  <p className={cn(
                                    "font-semibold transition-colors",
                                    theme.layout === 'immersive' ? "text-white" : "text-slate-900 group-hover:text-[var(--primary)]"
                                  )}>{material.title}</p>
                                  <p className="text-xs text-slate-500 capitalize font-medium">{material.type}</p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'assignment' && (
                    <div className="max-w-3xl">
                       {selectedLesson.assignment ? (
                        <AssignmentSubmission 
                          assignment={selectedLesson.assignment}
                          existingSubmission={currentSubmission}
                          userId="current-user"
                          onSubmissionComplete={() => console.log('Submitted')}
                        />
                      ) : (
                        <div className={cn(
                          "text-center py-16 rounded-2xl border border-dashed",
                          theme.layout === 'immersive' ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                        )}>
                          <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                            theme.layout === 'immersive' ? "bg-white/10" : "bg-slate-100"
                          )}>
                            <FileText className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium">Нет задания для этого урока.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'discussion' && (
                    <div className={cn(
                      "text-center py-16 rounded-2xl border border-dashed",
                      theme.layout === 'immersive' ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                    )}>
                      <p className="text-slate-500 font-medium">Раздел обсуждений скоро появится.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Default Sidebar Position (Right) */}
      {theme.layout !== 'sidebar-left' && renderSidebar()}
    </div>
  );
}
