import { useState, useEffect, useRef } from 'react';
import { Lesson } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Save, X, Check, Loader2 } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when prop changes (e.g. switching lessons)
  // But only if IDs are different to avoid overwriting unsaved changes
  useEffect(() => {
    if (lesson.id !== localLesson.id) {
      setLocalLesson(lesson);
      setLastSaved(null);
      setSaving(false);
    }
  }, [lesson, localLesson.id]);

  const triggerSave = (dataToSave: Lesson) => {
    setSaving(true);
    // Simulate network delay or just call update
    onUpdate(dataToSave);
    
    // We assume onUpdate is optimistic or fast enough. 
    // Ideally onUpdate should return a promise.
    setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date());
    }, 500);
  };

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

    // Debounce Save
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    setSaving(true);
    debounceTimer.current = setTimeout(() => {
      triggerSave(updated);
    }, 1500);
  };

  // Manual save
  const handleSave = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    triggerSave(localLesson);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl w-full max-w-2xl absolute right-0 top-0 bottom-0 z-50 overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Редактирование урока</h2>
          <div className="flex items-center mt-1 space-x-2">
            <p className="text-sm text-slate-500">Заполните содержание и материалы</p>
            {saving ? (
              <span className="text-xs text-primary-600 flex items-center animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Сохранение...
              </span>
            ) : lastSaved ? (
              <span className="text-xs text-emerald-600 flex items-center">
                <Check className="w-3 h-3 mr-1" /> Сохранено
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white" disabled={saving}>
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
