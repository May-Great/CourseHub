import { Lesson, LessonType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Video, FileText, HelpCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonMetaFormProps {
  lesson: Lesson;
  onChange: <K extends keyof Lesson>(field: K, value: Lesson[K]) => void;
}

export function LessonMetaForm({ lesson, onChange }: LessonMetaFormProps) {
  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Название урока</label>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
          <textarea
            rows={3}
            value={lesson.description}
            onChange={(e) => onChange('description', e.target.value)}
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
            onClick={() => onChange('type', 'video')}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 text-center transition-all",
              lesson.type === 'video'
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <Video className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">Видео</div>
          </button>
          <button
            onClick={() => onChange('type', 'text')}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 text-center transition-all",
              lesson.type === 'text'
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
            )}
          >
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">Статья</div>
          </button>
          <button
            onClick={() => onChange('type', 'quiz')}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 text-center transition-all",
              lesson.type === 'quiz'
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
      {lesson.type === 'video' && (
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
                value={lesson.content}
                onChange={(e) => onChange('content', e.target.value)}
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
                  value={lesson.duration || 0}
                  onChange={(e) => onChange('duration', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content */}
      {lesson.type === 'text' && (
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
              value={lesson.content}
              onChange={(e) => onChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm"
              placeholder="Markdown или HTML контент..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
