import { useState, useEffect } from 'react';
import { Lesson, Material, Quiz, QuizQuestion, QuizOption } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Video, 
  FileText, 
  Link as LinkIcon, 
  Plus, 
  Trash, 
  X,
  Clock,
  Save,
  File,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonEditorProps {
  lesson: Lesson;
  onUpdate: (updates: Partial<Lesson>) => void;
  onClose: () => void;
}

export function LessonEditor({ lesson, onUpdate, onClose }: LessonEditorProps) {
  const [localLesson, setLocalLesson] = useState<Lesson>(lesson);

  // Sync local state when prop changes (e.g. switching lessons)
  useEffect(() => {
    setLocalLesson(lesson);
  }, [lesson]);

  const handleChange = (field: keyof Lesson, value: any) => {
    const updated = { ...localLesson, [field]: value };
    // Initialize quiz if switching to quiz type
    if (field === 'type' && value === 'quiz' && !updated.quiz) {
      updated.quiz = {
        questions: [],
        passingScore: 70
      };
    }
    setLocalLesson(updated);
  };

  const handleSave = () => {
    onUpdate(localLesson);
  };

  // --- Material Handlers ---
  const addMaterial = () => {
    const newMaterial: Material = {
      type: 'link',
      title: 'Новый материал',
      url: ''
    };
    const materials = [...(localLesson.materials || []), newMaterial];
    handleChange('materials', materials);
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const materials = [...(localLesson.materials || [])];
    materials[index] = { ...materials[index], [field]: value };
    handleChange('materials', materials);
  };

  const removeMaterial = (index: number) => {
    const materials = [...(localLesson.materials || [])];
    materials.splice(index, 1);
    handleChange('materials', materials);
  };

  // --- Quiz Handlers ---
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      text: 'Новый вопрос',
      type: 'single_choice',
      options: [
        { id: `opt-${Date.now()}-1`, text: 'Вариант 1', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: 'Вариант 2', isCorrect: false }
      ]
    };
    const quiz = localLesson.quiz ? { ...localLesson.quiz } : { questions: [], passingScore: 70 };
    quiz.questions = [...quiz.questions, newQuestion];
    handleChange('quiz', quiz);
  };

  const updateQuestion = (qIndex: number, field: keyof QuizQuestion, value: any) => {
    if (!localLesson.quiz) return;
    const questions = [...localLesson.quiz.questions];
    questions[qIndex] = { ...questions[qIndex], [field]: value };
    handleChange('quiz', { ...localLesson.quiz, questions });
  };

  const removeQuestion = (qIndex: number) => {
    if (!localLesson.quiz) return;
    const questions = [...localLesson.quiz.questions];
    questions.splice(qIndex, 1);
    handleChange('quiz', { ...localLesson.quiz, questions });
  };

  const addOption = (qIndex: number) => {
    if (!localLesson.quiz) return;
    const questions = [...localLesson.quiz.questions];
    const newOption: QuizOption = {
      id: `opt-${Date.now()}`,
      text: 'Новый вариант',
      isCorrect: false
    };
    questions[qIndex] = { 
      ...questions[qIndex], 
      options: [...questions[qIndex].options, newOption] 
    };
    handleChange('quiz', { ...localLesson.quiz, questions });
  };

  const updateOption = (qIndex: number, oIndex: number, field: keyof QuizOption, value: any) => {
    if (!localLesson.quiz) return;
    const questions = [...localLesson.quiz.questions];
    const options = [...questions[qIndex].options];
    
    // Logic for single choice: if marking as correct, unmark others
    if (field === 'isCorrect' && value === true && questions[qIndex].type === 'single_choice') {
      options.forEach(opt => opt.isCorrect = false);
    }
    
    options[oIndex] = { ...options[oIndex], [field]: value };
    questions[qIndex] = { ...questions[qIndex], options };
    handleChange('quiz', { ...localLesson.quiz, questions });
  };
  
  const removeOption = (qIndex: number, oIndex: number) => {
     if (!localLesson.quiz) return;
     const questions = [...localLesson.quiz.questions];
     const options = [...questions[qIndex].options];
     options.splice(oIndex, 1);
     questions[qIndex] = { ...questions[qIndex], options };
     handleChange('quiz', { ...localLesson.quiz, questions });
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl w-full max-w-2xl absolute right-0 top-0 bottom-0 z-50 overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Редактирование урока</h2>
          <p className="text-sm text-slate-500 mt-1">Заполните содержание и материалы</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Сохранить
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название урока</label>
            <input
              type="text"
              value={localLesson.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
            <textarea
              rows={3}
              value={localLesson.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
              placeholder="Краткое описание того, о чем этот урок..."
            />
          </div>
        </div>

        {/* Content Type */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Тип контента</label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleChange('type', 'video')}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 text-center transition-all",
                localLesson.type === 'video'
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              )}
            >
              <Video className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Видео</div>
            </button>
            <button
              onClick={() => handleChange('type', 'text')}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 text-center transition-all",
                localLesson.type === 'text'
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              )}
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Статья</div>
            </button>
            <button
              onClick={() => handleChange('type', 'quiz')}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 text-center transition-all",
                localLesson.type === 'quiz'
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              )}
            >
              <HelpCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Тест</div>
            </button>
          </div>
        </div>

        {/* Video Settings */}
        {localLesson.type === 'video' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Video className="w-4 h-4 mr-2 text-primary-600" />
                Настройки видео
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка на видео (MP4)</label>
                <input
                  type="text"
                  value={localLesson.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Поддерживаются прямые ссылки на .mp4 файлы</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Длительность (сек)</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    value={localLesson.duration || 0}
                    onChange={(e) => handleChange('duration', Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Text Content */}
        {localLesson.type === 'text' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary-600" />
                Содержание статьи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                rows={10}
                value={localLesson.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
                placeholder="Markdown или HTML контент..."
              />
            </CardContent>
          </Card>
        )}

        {/* Quiz Editor */}
        {localLesson.type === 'quiz' && localLesson.quiz && (
          <div className="space-y-6">
             <Card>
               <CardHeader className="pb-3 flex flex-row items-center justify-between">
                 <CardTitle className="text-base flex items-center">
                   <HelpCircle className="w-4 h-4 mr-2 text-primary-600" />
                   Настройки теста
                 </CardTitle>
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Проходной балл:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={localLesson.quiz.passingScore}
                      onChange={(e) => handleChange('quiz', { ...localLesson.quiz, passingScore: Number(e.target.value) })}
                      className="w-16 px-2 py-1 border border-slate-200 rounded-md text-sm"
                    />
                    <span className="text-sm text-slate-600">%</span>
                 </div>
               </CardHeader>
               <CardContent className="space-y-6">
                 {localLesson.quiz.questions.map((question, qIndex) => (
                   <div key={question.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                     <button 
                       onClick={() => removeQuestion(qIndex)}
                       className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash className="w-4 h-4" />
                     </button>
                     
                     <div className="mb-4 pr-8">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Вопрос {qIndex + 1}</label>
                       <input 
                         type="text" 
                         value={question.text}
                         onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                         className="w-full bg-transparent border-b border-slate-300 focus:border-primary-500 font-medium text-slate-900 px-0 py-1 focus:outline-none"
                         placeholder="Введите текст вопроса..."
                       />
                     </div>
                     
                     <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                       {question.options.map((option, oIndex) => (
                         <div key={option.id} className="flex items-center gap-3">
                            <button 
                              onClick={() => updateOption(qIndex, oIndex, 'isCorrect', !option.isCorrect)}
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                option.isCorrect 
                                  ? "bg-emerald-500 border-emerald-500 text-white" 
                                  : "border-slate-300 text-transparent hover:border-emerald-400"
                              )}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <input 
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                              placeholder="Вариант ответа"
                            />
                            <button 
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-slate-300 hover:text-rose-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => addOption(qIndex)}
                         className="text-xs text-primary-600 hover:bg-primary-50 mt-2"
                       >
                         <Plus className="w-3 h-3 mr-1" /> Добавить вариант
                       </Button>
                     </div>
                   </div>
                 ))}
                 
                 <Button onClick={addQuestion} variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 hover:border-primary-500 hover:text-primary-600">
                   <Plus className="w-4 h-4 mr-2" /> Добавить вопрос
                 </Button>
               </CardContent>
             </Card>
          </div>
        )}

        {/* Materials (Only for Video/Text) */}
        {localLesson.type !== 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Материалы и ссылки</label>
              <Button size="sm" variant="ghost" onClick={addMaterial} className="text-primary-600 hover:bg-primary-50">
                <Plus className="w-3 h-3 mr-1" /> Добавить
              </Button>
            </div>
            
            <div className="space-y-3">
              {(localLesson.materials || []).map((material, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={material.type}
                        onChange={(e) => updateMaterial(idx, 'type', e.target.value)}
                        className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500"
                      >
                        <option value="link">Ссылка</option>
                        <option value="pdf">PDF</option>
                        <option value="file">Файл</option>
                      </select>
                      <input
                        type="text"
                        value={material.title}
                        onChange={(e) => updateMaterial(idx, 'title', e.target.value)}
                        placeholder="Название материала"
                        className="flex-1 bg-transparent border-b border-slate-200 focus:border-primary-500 text-sm px-1 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={material.url}
                      onChange={(e) => updateMaterial(idx, 'url', e.target.value)}
                      placeholder="URL (https://...)"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-primary-500 font-mono"
                    />
                  </div>
                  <button 
                    onClick={() => removeMaterial(idx)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity self-center"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(localLesson.materials || []).length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Нет прикрепленных материалов
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
