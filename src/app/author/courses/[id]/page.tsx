'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Course, Module, Lesson } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { LessonEditor } from '@/components/course/LessonEditor';
import { 
  Eye, 
  Plus, 
  Trash, 
  ChevronRight, 
  Settings, 
  List,
  CheckCircle,
  Palette,
  Loader2,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { FileUpload } from '@/components/ui/FileUpload';

// DnD Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableLessonItem } from '@/components/course/editor/SortableLessonItem';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'theme'>('content');
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string, lessonId: string } | null>(null);
  
  const supabase = createClient();
  const { currentUser } = useAuthStore();

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch Data
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
          .in('module_id', modulesData.map(m => m.id))
          .order('order', { ascending: true });

        if (lessonsError) throw lessonsError;

        // 4. Assemble
        const fullModules: Module[] = modulesData.map(m => ({
          id: m.id,
          title: m.title,
          description: '',
          order: m.order,
          lessons: lessonsData
            .filter(l => l.module_id === m.id)
            .sort((a, b) => a.order - b.order) // Ensure sorted by order
            .map(l => ({
              id: l.id,
              title: l.title,
              description: l.content || '',
              type: l.video_url ? 'video' : 'text',
              content: l.content,
              videoUrl: l.video_url,
              order: l.order,
              duration: 0
            }))
        }));

        setCourse({
          id: courseData.id,
          title: courseData.title,
          description: courseData.description || '',
          shortDescription: courseData.description || '',
          authorId: courseData.author_id,
          authorName: currentUser?.name || 'Me',
          thumbnail: courseData.cover_url,
          price: courseData.price,
          category: 'Development',
          modules: fullModules,
          createdAt: courseData.created_at,
          updatedAt: courseData.updated_at,
          studentsCount: 0,
          rating: 0,
          tags: [],
          status: courseData.is_published ? 'published' : 'draft',
          settings: { hasDeadlines: false, autoAdvance: false, allowLateSubmissions: false, requireSequentialProgress: false, discussionEnabled: false }
        });
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, currentUser, supabase, router]);

  // Handlers
  const handleUpdateCourse = async (updates: Partial<Course>) => {
    if (!course) return;
    setCourse({ ...course, ...updates });
    
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.status !== undefined) dbUpdates.is_published = updates.status === 'published';
      if (updates.thumbnail !== undefined) dbUpdates.cover_url = updates.thumbnail;
      
      if (Object.keys(dbUpdates).length > 0) {
        await supabase.from('courses').update(dbUpdates).eq('id', courseId);
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleAddModule = async () => {
    if (!course) return;
    try {
      setSaving(true);
      const newOrder = course.modules.length + 1;
      const { data, error } = await supabase
        .from('modules')
        .insert({ course_id: courseId, title: 'Новый модуль', order: newOrder })
        .select().single();

      if (error) throw error;

      setCourse({
        ...course,
        modules: [...course.modules, { id: data.id, title: data.title, description: '', lessons: [], order: data.order }]
      });
      setActiveModuleId(data.id);
    } catch (error) {
      console.error('Error adding module:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleUpdateModule = async (moduleId: string, title: string) => {
    if (!course) return;
    const updatedModules = course.modules.map(m => m.id === moduleId ? { ...m, title } : m);
    setCourse({ ...course, modules: updatedModules });

    try {
      await supabase.from('modules').update({ title }).eq('id', moduleId);
    } catch (error) { console.error(error); }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Удалить модуль?')) return;
    if (course) {
      setCourse({ ...course, modules: course.modules.filter(m => m.id !== moduleId) });
    }
    await supabase.from('modules').delete().eq('id', moduleId);
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return;
    try {
      setSaving(true);
      const module = course.modules.find(m => m.id === moduleId);
      const newOrder = (module?.lessons.length || 0) + 1;
      
      const { data, error } = await supabase
        .from('lessons')
        .insert({ module_id: moduleId, title: 'Новый урок', order: newOrder })
        .select().single();

      if (error) throw error;

      const newLesson: Lesson = {
        id: data.id, title: data.title, description: '', type: 'text', content: '', order: data.order, duration: 0
      };

      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) return { ...m, lessons: [...m.lessons, newLesson] };
        return m;
      });

      setCourse({ ...course, modules: updatedModules });
      setEditingLesson({ moduleId, lessonId: newLesson.id });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleUpdateLesson = async (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    if (!course) return;
    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l) };
      }
      return m;
    });
    setCourse({ ...course, modules: updatedModules });

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
      
      if (Object.keys(dbUpdates).length > 0) {
        await supabase.from('lessons').update(dbUpdates).eq('id', lessonId);
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Удалить урок?')) return;
    if (course) {
      const updatedModules = course.modules.map(m => {
        if (m.id === moduleId) return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
        return m;
      });
      setCourse({ ...course, modules: updatedModules });
    }
    await supabase.from('lessons').delete().eq('id', lessonId);
  };

  // --- Drag and Drop Logic ---
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !course) return;

    // Find the module containing these lessons
    // We assume drag is only within one module for now (simple implementation)
    const activeModule = course.modules.find(m => m.lessons.some(l => l.id === active.id));
    if (!activeModule) return;

    const oldIndex = activeModule.lessons.findIndex(l => l.id === active.id);
    const newIndex = activeModule.lessons.findIndex(l => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // 1. Optimistic Update
      const newLessons = arrayMove(activeModule.lessons, oldIndex, newIndex).map((l, idx) => ({
        ...l,
        order: idx + 1 // Re-assign order based on new position
      }));

      const updatedModules = course.modules.map(m => 
        m.id === activeModule.id ? { ...m, lessons: newLessons } : m
      );

      setCourse({ ...course, modules: updatedModules });

      // 2. Persist to DB
      try {
        const updates = newLessons.map(l => ({
          id: l.id,
          module_id: activeModule.id, // Ensure module_id is present
          title: l.title, // Required fields for upsert might be needed depending on schema
          order: l.order,
          updated_at: new Date().toISOString()
        }));

        // We only want to update 'order', but upsert requires primary key.
        // Supabase upsert:
        const { error } = await supabase
          .from('lessons')
          .upsert(updates.map(u => ({ id: u.id, order: u.order, module_id: u.module_id, title: u.title }))); // title is required NOT NULL usually, so we include it
          
        if (error) throw error;
      } catch (error) {
        console.error('Error reordering lessons:', error);
        // Revert on error?
      }
    }
  };

  if (loading) return <PageShell><div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin" /></div></PageShell>;
  if (!course) return <PageShell><div>Курс не найден</div></PageShell>;

  const activeLessonData = editingLesson 
    ? course.modules.find(m => m.id === editingLesson.moduleId)?.lessons.find(l => l.id === editingLesson.lessonId)
    : null;

  return (
    <PageShell className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Редактор курса</h1>
          <div className="flex items-center mt-2 text-slate-500">
            <span className="font-medium">{course.title}</span>
            <span className="mx-2">•</span>
            <Badge variant={course.status === 'published' ? 'success' : 'secondary'}>
              {course.status === 'published' ? 'Опубликован' : 'Черновик'}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.open(`/buyer/courses/${courseId}`, '_blank')}>
            <Eye className="w-4 h-4 mr-2" /> Предпросмотр
          </Button>
          <Button 
            onClick={() => handleUpdateCourse({ status: course.status === 'published' ? 'draft' : 'published' })}
            className={cn("text-white", course.status === 'published' ? "bg-amber-500 hover:bg-amber-600" : "bg-primary-600 hover:bg-primary-700")}
          >
            {course.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
          </Button>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
        <button onClick={() => setActiveTab('content')} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'content' ? "bg-white shadow-sm" : "text-slate-500")}>
          <List className="w-4 h-4 mr-2 inline" /> Структура
        </button>
        <button onClick={() => setActiveTab('settings')} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", activeTab === 'settings' ? "bg-white shadow-sm" : "text-slate-500")}>
          <Settings className="w-4 h-4 mr-2 inline" /> Настройки
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'content' && (
            <Card className="min-h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
                <CardTitle className="text-xl">Структура курса</CardTitle>
                <Button size="sm" variant="ghost" onClick={handleAddModule} className="text-primary-600">
                  <Plus className="w-4 h-4 mr-1" /> Добавить модуль
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEnd}
                >
                  {course.modules.map((module) => (
                    <div key={module.id} className="group/module">
                      <div className="flex items-center py-2 px-2 hover:bg-slate-50 rounded-lg transition-colors group/header">
                        <button onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)} className="mr-2 text-slate-400">
                          <ChevronRight className={cn("w-4 h-4 transition-transform", activeModuleId === module.id && "rotate-90")} />
                        </button>
                        <input 
                          value={module.title}
                          onChange={(e) => handleUpdateModule(module.id, e.target.value)}
                          className="w-full bg-transparent border-none p-0 font-semibold text-slate-900 focus:ring-0"
                        />
                        <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-opacity">
                           <Button size="sm" variant="ghost" onClick={() => handleDeleteModule(module.id)}><Trash className="w-4 h-4 text-slate-400" /></Button>
                        </div>
                      </div>

                      {activeModuleId === module.id && (
                        <div className="ml-8 mt-1 border-l border-slate-100 pl-4 py-2">
                          <SortableContext 
                            items={module.lessons.map(l => l.id)} 
                            strategy={verticalListSortingStrategy}
                          >
                            {module.lessons.map((lesson) => (
                              <SortableLessonItem 
                                key={lesson.id} 
                                lesson={lesson} 
                                isEditing={editingLesson?.lessonId === lesson.id}
                                onEdit={() => setEditingLesson({ moduleId: module.id, lessonId: lesson.id })}
                                onDelete={() => handleDeleteLesson(module.id, lesson.id)}
                              />
                            ))}
                          </SortableContext>
                          <Button variant="ghost" size="sm" onClick={() => handleAddLesson(module.id)} className="text-xs text-slate-400 hover:text-primary-600 mt-2 ml-2">
                            <Plus className="w-3 h-3 mr-1" /> Добавить урок
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </DndContext>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
             <Card>
               <CardContent className="space-y-4 pt-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                   <input value={course.title} onChange={(e) => handleUpdateCourse({ title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Цена</label>
                   <input type="number" value={course.price} onChange={(e) => handleUpdateCourse({ price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
               </CardContent>
             </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Обложка</CardTitle></CardHeader>
            <CardContent>
              <FileUpload bucket="course-content" path={`covers/${courseId}/`} accept="image/*" label="Загрузить обложку" currentUrl={course.thumbnail} onUploadComplete={(url) => handleUpdateCourse({ thumbnail: url })} />
            </CardContent>
          </Card>
        </div>
      </div>

      {editingLesson && activeLessonData && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setEditingLesson(null)} />
          <LessonEditor lesson={activeLessonData} onUpdate={(updates) => handleUpdateLesson(editingLesson.moduleId, editingLesson.lessonId, updates)} onClose={() => setEditingLesson(null)} />
        </>
      )}
    </PageShell>
  );
}
