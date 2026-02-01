'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { Course, Module, Lesson } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { AssignmentReview } from '@/components/assignment/AssignmentReview';
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
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  const { courses, initialize, updateCourse, addModule, updateModule, deleteModule, addLesson, updateLesson, deleteLesson } = useCourseStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  const course = courses.find(c => c.id === courseId);
  
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
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

  const handleUpdateCourse = (updates: Partial<Course>) => {
    updateCourse(courseId, updates);
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: 'Новый модуль',
      description: '',
      lessons: [],
      order: course.modules.length + 1
    };
    addModule(courseId, newModule);
    setActiveModuleId(newModule.id);
  };

  const handleAddLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: 'Новый урок',
      description: '',
      type: 'video',
      content: '',
      order: 1, // Logic to find max order needed
      duration: 0
    };
    addLesson(courseId, moduleId, newLesson);
  };

  const togglePreview = () => {
    window.open(`/buyer/courses/${courseId}`, '_blank');
  };
  
  const togglePublish = () => {
    handleUpdateCourse({ status: course.status === 'published' ? 'draft' : 'published' });
  };
  
  return (
    <PageShell>
      <div className="flex items-center justify-between mb-8">
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
            Предпросмотр
          </Button>
          <Button 
            onClick={togglePublish}
            className={cn(
              "flex items-center border-none shadow-lg",
              course.status === 'published' 
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20"
            )}
          >
            {course.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Course Structure (Notion-like) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
              <CardTitle className="text-xl">Структура курса</CardTitle>
              <Button size="sm" variant="ghost" onClick={handleAddModule} className="text-primary-600 hover:bg-primary-50">
                <Plus className="w-4 h-4 mr-1" /> Добавить модуль
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.modules.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-slate-400">В курсе пока нет модулей</p>
                  <Button variant="ghost" onClick={handleAddModule} className="mt-2 text-primary-600">
                    Создать первый модуль
                  </Button>
                </div>
              )}

              {course.modules.map((module, mIndex) => (
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
                        onChange={(e) => updateModule(courseId, module.id, { title: e.target.value })}
                        className="w-full bg-transparent border-none p-0 font-semibold text-slate-900 focus:ring-0 placeholder:text-slate-300"
                        placeholder="Название модуля"
                      />
                    </div>
                    <div className="flex items-center opacity-0 group-hover/header:opacity-100 transition-opacity space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => handleAddLesson(module.id)} title="Добавить урок">
                        <Plus className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteModule(courseId, module.id)} title="Удалить модуль">
                        <Trash className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {activeModuleId === module.id && (
                    <div className="ml-10 mt-1 space-y-1 border-l border-slate-100 pl-4 py-2">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lesson.id} className="flex items-center py-1.5 px-2 hover:bg-slate-50 rounded-md group/lesson transition-colors">
                          <div className="mr-2 cursor-grab text-slate-300 hover:text-slate-500 opacity-0 group-hover/lesson:opacity-100">
                            <GripVertical className="w-3 h-3" />
                          </div>
                          <div className="mr-3 text-slate-400">
                            {lesson.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <input 
                              type="text" 
                              value={lesson.title}
                              onChange={(e) => updateLesson(courseId, module.id, lesson.id, { title: e.target.value })}
                              className="w-full bg-transparent border-none p-0 text-sm text-slate-700 focus:ring-0"
                              placeholder="Название урока"
                            />
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteLesson(courseId, module.id, lesson.id)}
                            className="opacity-0 group-hover/lesson:opacity-100 h-6 w-6 p-0"
                          >
                            <Trash className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                          </Button>
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
        </div>

        {/* RIGHT COLUMN: Settings & Metadata */}
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
    </PageShell>
  );
}
