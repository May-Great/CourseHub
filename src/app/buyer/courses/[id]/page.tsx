'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockCourses } from '@/lib/mockData';
import { Lesson } from '@/lib/types';
import { VideoPlayer } from '@/components/video';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AssignmentSubmission } from '@/components/assignment/AssignmentSubmission';
import { useAssignmentStore } from '@/lib/stores/assignmentStore';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ChevronRight, PlayCircle, FileText, CheckCircle, Circle, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment' | 'discussion'>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const { userProgress, updateProgress } = useAppStore();
  const { getSubmissionsByUser } = useAssignmentStore();
  
  const course = mockCourses.find(c => c.id === courseId);
  const progress = userProgress.find(p => p.courseId === courseId);
  const userSubmissions = getSubmissionsByUser('current-user');
  
  // Flatten lessons structure for easy navigation
  const allLessons: (Lesson & { moduleTitle: string; moduleId: string })[] = [];
  course?.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      allLessons.push({ ...lesson, moduleTitle: module.title, moduleId: module.id });
    });
  });
  
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
  
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        <div className="max-w-6xl mx-auto p-6 md:p-8 pb-24">
          {selectedLesson && (
            <>
              {/* Modern Header */}
              <div className="mb-6">
                <Breadcrumbs 
                  items={[
                    { label: 'Курсы', href: '/buyer/courses' },
                    { label: course.title, href: `/buyer/courses/${courseId}` },
                    { label: selectedLesson.title }
                  ]} 
                  className="mb-4"
                />
                
                <div className="flex items-center justify-between">
                   <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedLesson.title}</h1>
                   <button 
                     onClick={() => setSidebarOpen(!isSidebarOpen)} 
                     className="md:hidden p-2 text-slate-500 hover:text-slate-900"
                   >
                      <Menu className="w-6 h-6" />
                   </button>
                </div>
                <div className="text-sm text-slate-500 mt-2 font-medium flex items-center">
                  <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md mr-2">
                    {selectedLesson.moduleTitle}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="ml-2 flex items-center">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Video Lesson
                  </span>
                </div>
              </div>

              {/* Video Player Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-slate-900 aspect-video mb-8">
                {selectedLesson.type === 'video' && (
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
                )}
              </div>

              {/* Lesson Controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-8">
                <Button 
                   variant="outline" 
                   onClick={handlePreviousLesson}
                   disabled={currentLessonIndex === 0}
                   className="flex items-center text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Предыдущий урок
                </Button>
                
                <Button 
                   onClick={handleNextLesson}
                   disabled={currentLessonIndex === allLessons.length - 1}
                   className="flex items-center bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 px-6"
                >
                   Следующий урок
                   <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Tabs Content */}
              <div className="max-w-4xl">
                <div className="flex space-x-8 border-b border-slate-100 mb-8">
                  {['overview', 'assignment', 'discussion'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "pb-4 text-sm font-semibold capitalize transition-all relative",
                        activeTab === tab 
                          ? "text-primary-600" 
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 'overview' && (
                    <div className="prose prose-slate max-w-none">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">About this lesson</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">{selectedLesson.description}</p>
                      
                      {selectedLesson.materials && selectedLesson.materials.length > 0 && (
                        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-primary-600" />
                            Materials
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {selectedLesson.materials.map((material, idx) => (
                              <a 
                                key={idx} 
                                href={material.url} 
                                target="_blank" 
                                className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
                              >
                                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-100 transition-colors">
                                  <span className="text-xl">
                                    {material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '🔗'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">{material.title}</p>
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
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium">No assignment required for this lesson.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'discussion' && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500 font-medium">Discussion forum coming soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar - Course Content */}
      <div className={cn(
        "w-96 bg-white border-l border-slate-100 overflow-y-auto transition-all duration-300 ease-in-out shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20",
        isSidebarOpen ? "translate-x-0" : "translate-x-full hidden md:block md:w-0 md:border-none"
      )}>
        <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-900 text-lg">Course Content</h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
             <div 
               className="bg-primary-500 h-2 rounded-full transition-all duration-500"
               style={{ width: `${Math.round((progress?.completedLessons.length || 0) / allLessons.length * 100)}%` }}
             />
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-2 text-right">
             {Math.round((progress?.completedLessons.length || 0) / allLessons.length * 100)}% COMPLETE
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {course.modules.map((module, mIdx) => (
            <div key={module.id} className="space-y-2">
              <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Module {mIdx + 1} • {module.title}
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
                        isActive 
                          ? "bg-primary-50 border-primary-100 shadow-sm" 
                          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors",
                        isCompleted 
                          ? "text-emerald-500" 
                          : isActive ? "text-primary-600" : "text-slate-300"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 fill-emerald-100" />
                        ) : isActive ? (
                          <PlayCircle className="w-5 h-5 fill-primary-100" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold leading-snug transition-colors truncate",
                          isActive ? "text-primary-900" : "text-slate-700"
                        )}>
                          {lIdx + 1}. {lesson.title}
                        </p>
                        <div className="flex items-center text-xs text-slate-400 mt-1">
                          <span className="capitalize">{lesson.type}</span>
                          <span className="mx-1.5">•</span>
                          <span>{Math.ceil((lesson.duration || 0) / 60)} min</span>
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
    </div>
  );
}
