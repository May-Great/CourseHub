'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { Course, Module, Lesson, CourseTheme } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { ThemeEditor } from '@/components/course/ThemeEditor';
import { LessonEditor } from '@/components/course/LessonEditor';
import { 
  Eye, 
  Upload, 
  GripVertical, 
  Plus, 
  Trash, 
  ChevronRight, 
  Settings, 
  FileText, 
  Video,
  List,
  CheckCircle,
  Palette,
  Edit,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/authStore';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  // State for data
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // UI State
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'theme'>('content');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string, lessonId: string } | null>(null);
  
  const supabase = createClient();
  const { currentUser } = useAuthStore();

  // Fetch Course Data
  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        
        // 1. Fetch Course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;

        // 2. Fetch Modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order', { ascending: true });

        if (modulesError) throw modulesError;

        // 3. Fetch Lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          // We need to filter lessons by the modules we just fetched
          // But Supabase allows filtering by joined table, or we can fetch all for these modules
          // For simplicity, let's fetch all lessons that belong to these modules
          // A better way is to join in the query, but let's stick to simple separate queries for now or map client-side
          .in('module_id', modulesData.map(m => m.id))
          .order('order', { ascending: true });

        if (lessonsError) throw lessonsError;

        // 4. Assemble the Course object
        const fullModules: Module[] = modulesData.map(m => ({
          id: m.id,
          title: m.title,
          description: '', // Add if needed in DB
          order: m.order,
          lessons: lessonsData
            .filter(l => l.module_id === m.id)
            .map(l => ({
              id: l.id,
              title: l.title,
              description: l.content || '', // Mapping content to description for list view
              type: l.video_url ? 'video' : 'text',
              content: l.content,
              videoUrl: l.video_url,
              order: l.order,
              duration: 0
            }))
        }));

        const fullCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description || '',
          shortDescription: courseData.description || '',
          authorId: courseData.author_id,
          authorName: currentUser?.name || 'Me', // Fallback
          thumbnail: courseData.cover_url,
          price: courseData.price,
          category: 'Development', // Placeholder, add to DB if needed
          modules: fullModules,
          createdAt: courseData.created_at,
          updatedAt: courseData.updated_at,
          studentsCount: 0,
          rating: 0,
          tags: [],
          status: courseData.is_published ? 'published' : 'draft',
          settings: { // Defaults
            hasDeadlines: false,
            autoAdvance: false,
            allowLateSubmissions: false,
            requireSequentialProgress: false,
            certificateEnabled: false,
            discussionEnabled: false
          }
        };

        setCourse(fullCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
        // router.push('/author/courses'); // Redirect on error?
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, currentUser, supabase, router]);

  // Handlers for Updates
  const handleUpdateCourse = async (updates: Partial<Course>) => {
    if (!course) return;
    
    // Optimistic update
    setCourse({ ...course, ...updates });
    
    try {
      // Map back to DB columns
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.status !== undefined) dbUpdates.is_published = updates.status === 'published';
      // Add category, etc. if added to DB
      
      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await supabase
          .from('courses')
          .update(dbUpdates)
          .eq('id', courseId);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleAddModule = async () => {
    if (!course) return;
    
    try {
      setSaving(true);
      const newOrder = course.modules.length + 1;
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: 'Новый модуль',
          order: newOrder
        })
        .select()
        .single();

      if (error) throw error;

      const newModule: Module = {
        id: data.id,
        title: data.title,
        description: '',
        lessons: [],
        order: data.order
      };

      setCourse({
        ...course,
        modules: [...course.modules, newModule]
      });
      setActiveModuleId(newModule.id);
    } catch (error) {
      console.error('Error adding module:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleUpdateModule = async (moduleId: string, title: string) => {
    if (!course) return;
    
    // Optimistic
    const updatedModules = course.modules.map(m => 
      m.id === moduleId ? { ...m, title } : m
    );
    setCourse({ ...course, modules: updatedModules });

    try {
      await supabase
        .from('modules')
        .update({ title })
        .eq('id', moduleId);
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Вы уверены? Все уроки в модуле будут удалены.')) return;
    
    try {
      // Optimistic
      if (course) {
        setCourse({
          ...course,
          modules: course.modules.filter(m => m.id !== moduleId)
        });
      }

      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return;
    
    try {
      setSaving(true);
      const module = course.modules.find(m => m.id === moduleId);
      const newOrder = (module?.lessons.length || 0) + 1;
      
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: 'Новый урок',
          order: newOrder,
          content: '',
          is_free: false
        })
        .select()
        .single();

      if (error) throw error;

      const newLesson: Lesson = {
        id: data.id,
        title: data.title,
        description: '',
        type: 'text',
        content: '',
        order: data.order,
        duration: 0
      };

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: [...m.lessons, newLesson] };
        }
        return m;
      });

      setCourse({ ...course, modules: updatedModules });
      setEditingLesson({ moduleId, lessonId: newLesson.id });
    } catch (error) {
      console.error('Error adding lesson:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleUpdateLesson = async (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    if (!course) return;

    // Optimistic
    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    });
    setCourse({ ...course, modules: updatedModules });

    try {
      // Map to DB
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
      
      if (Object.keys(dbUpdates).length > 0) {
        await supabase
          .from('lessons')
          .update(dbUpdates)
          .eq('id', lessonId);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
     if (!confirm('Удалить этот урок?')) return;
     
     try {
       if (course) {
         const updatedModules = course.modules.map(m => {
           if (m.id === moduleId) {
             return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
           }
           return m;
         });
         setCourse({ ...course, modules: updatedModules });
       }

       await supabase
         .from('lessons')
         .delete()
         .eq('id', lessonId);
     } catch (error) {
       console.error('Error deleting lesson:', error);
     }
  };

  const togglePublish = () => {
    if (!course) return;
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    handleUpdateCourse({ status: newStatus });
  };
  
  const togglePreview = () => {
    window.open(`/buyer/courses/${courseId}`, '_blank');
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </PageShell>
    );
  }

  if (!course) {
    return (
      <PageShell>
         <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Курс не найден</h1>
          <Button className="mt-4" onClick={() => router.push('/author/courses')}>Вернуться к списку</Button>
        </div>
      </PageShell>
    );
  }

  const activeLessonData = editingLesson 
    ? course.modules.find(m => m.id === editingLesson.moduleId)?.lessons.find(l => l.id === editingLesson.lessonId)
    : null;
  
  return (
    <PageShell className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Редактор курса
          </h1>
          <div className="flex items-center mt-2 text-slate-500">
            <span className="font-medium">{course.title}</span>
            <span className="mx-2">•</span>
            <Badge variant={course.status === 'published' ? 'success' : 'secondary'}>
              {course.status === 'published' ? 'Опубликован' : 'Черновик'}
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={togglePreview}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Предпросмотр</span>
          </Button>
          <Button 
            onClick={togglePublish}
            className={cn(
              "flex items-center border-none shadow-lg transition-colors",
              course.status === 'published' 
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20"
            )}
          >
            {course.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap",
            activeTab === 'content' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <List className="w-4 h-4 mr-2" />
          Структура
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap",
            activeTab === 'theme' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Palette className="w-4 h-4 mr-2" />
          Внешний вид
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap",
            activeTab === 'settings' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Settings className="w-4 h-4 mr-2" />
          Настройки
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'content' && (
            <Card className="min-h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
                <CardTitle className="text-xl">Структура курса</CardTitle>
                <Button size="sm" variant="ghost" onClick={handleAddModule} disabled={saving} className="text-primary-600 hover:bg-primary-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} 
                  Добавить модуль
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400">В курсе пока нет модулей</p>
                    <Button variant="ghost" onClick={handleAddModule} disabled={saving} className="mt-2 text-primary-600">
                      Создать первый модуль
                    </Button>
                  </div>
                )}

                {course.modules.map((module) => (
                  <div key={module.id} className="group/module">
                    {/* Module Header */}
                    <div className="flex items-center py-2 px-2 hover:bg-slate-50 rounded-lg transition-colors group/header">
                      <div className="mr-2 cursor-grab text-slate-300 hover:text-slate-500 opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                        className="mr-2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <ChevronRight className={cn("w-4 h-4 transition-transform", activeModuleId === module.id && "rotate-90")} />
                      </button>
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={module.title}
                          onChange={(e) => handleUpdateModule(module.id, e.target.value)}
                          className="w-full bg-transparent border-none p-0 font-semibold text-slate-900 focus:ring-0 placeholder:text-slate-300"
                          placeholder="Название модуля"
                        />
                      </div>
                      <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-opacity space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleAddLesson(module.id)} title="Добавить урок">
                          <Plus className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteModule(module.id)} title="Удалить модуль">
                          <Trash className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Lessons List */}
                    {activeModuleId === module.id && (
                      <div className="ml-10 mt-1 space-y-1 border-l border-slate-100 pl-4 py-2">
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={cn(
                              "flex items-center py-1.5 px-2 rounded-md group/lesson transition-colors cursor-pointer",
                              editingLesson?.lessonId === lesson.id ? "bg-primary-50 ring-1 ring-primary-100" : "hover:bg-slate-50"
                            )}
                            onClick={() => setEditingLesson({ moduleId: module.id, lessonId: lesson.id })}
                          >
                            <div className="mr-2 cursor-grab text-slate-300 hover:text-slate-500 opacity-0 group-hover/lesson:opacity-100">
                              <GripVertical className="w-3 h-3" />
                            </div>
                            <div className="mr-3 text-slate-400">
                              {lesson.type === 'video' || lesson.videoUrl ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 text-sm text-slate-700 font-medium truncate">
                              {lesson.title}
                            </div>
                            <div className="flex items-center opacity-0 group-hover/lesson:opacity-100">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0 mr-1 text-slate-400 hover:text-primary-600"
                                title="Редактировать"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLesson(module.id, lesson.id);
                                }}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-rose-500"
                                title="Удалить"
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddLesson(module.id)}
                          className="text-xs text-slate-400 hover:text-primary-600 mt-2 ml-2"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Добавить урок
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'theme' && (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Редактор тем временно недоступен</p>
            </div>
          )}

          {activeTab === 'settings' && (
             <div className="space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg">Настройки курса</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                     <input 
                       type="text" 
                       value={course.title}
                       onChange={(e) => handleUpdateCourse({ title: e.target.value })}
                       className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                     <select
                       value={course.category}
                       onChange={(e) => handleUpdateCourse({ category: e.target.value })}
                       className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                     >
                       <option value="Программирование">Программирование</option>
                       <option value="Дизайн">Дизайн</option>
                       <option value="Маркетинг">Маркетинг</option>
                       <option value="Бизнес">Бизнес</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Цена (₽)</label>
                     <input 
                       type="number" 
                       value={course.price}
                       onChange={(e) => handleUpdateCourse({ price: Number(e.target.value) })}
                       className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                     />
                   </div>
                 </CardContent>
               </Card>
             </div>
          )}
        </div>

        {/* RIGHT COLUMN: Preview & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Обложка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group cursor-pointer">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <span className="text-sm">Нет изображения</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" className="text-white border-white hover:bg-white/20">
                    <Upload className="w-4 h-4 mr-2" /> Загрузить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Готовность к публикации</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Заполнено {course.modules.length > 0 ? '80%' : '10%'}. Добавьте описание уроков для завершения.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Editor Slide-over */}
      {editingLesson && activeLessonData && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
            onClick={() => setEditingLesson(null)}
          />
          <LessonEditor 
            lesson={activeLessonData} 
            onUpdate={(updates) => {
              handleUpdateLesson(editingLesson.moduleId, editingLesson.lessonId, updates);
            }}
            onClose={() => setEditingLesson(null)}
          />
        </>
      )}
    </PageShell>
  );
}
