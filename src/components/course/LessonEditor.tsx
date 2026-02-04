import { useState, useEffect } from 'react';
import { Lesson } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Save, X } from 'lucide-react';
import { LessonMetaForm } from './editor/LessonMetaForm';
import { QuizEditor } from './editor/QuizEditor';
import { MaterialsManager } from './editor/MaterialsManager';

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

  const handleChange = <K extends keyof Lesson>(field: K, value: Lesson[K]) => {
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
        
        {/* Basic Info & Content Settings */}
        <LessonMetaForm 
          lesson={localLesson} 
          onChange={handleChange} 
        />

        {/* Quiz Editor */}
        {localLesson.type === 'quiz' && (
          <QuizEditor 
            quiz={localLesson.quiz || { questions: [], passingScore: 70 }}
            onChange={(updatedQuiz) => handleChange('quiz', updatedQuiz)}
          />
        )}

        {/* Materials (Only for Video/Text) */}
        {localLesson.type !== 'quiz' && (
          <MaterialsManager 
            materials={localLesson.materials || []}
            onChange={(updatedMaterials) => handleChange('materials', updatedMaterials)}
          />
        )}
      </div>
    </div>
  );
}
