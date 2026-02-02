import { useState } from 'react';
import { Course, CourseTheme } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Layout, Palette, Type, MousePointer, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeEditorProps {
  course: Course;
  onUpdate: (theme: CourseTheme) => void;
}

const DEFAULT_THEME: CourseTheme = {
  primaryColor: '#3b82f6',
  backgroundColor: '#f8fafc',
  fontFamily: 'sans',
  layout: 'default',
  coverStyle: 'banner',
  buttonStyle: 'rounded'
};

const COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#1f2937', // Gray
];

const BACKGROUNDS = [
  '#f8fafc', // Slate 50
  '#ffffff', // White
  '#faf5ff', // Purple 50
  '#eff6ff', // Blue 50
  '#fff7ed', // Orange 50
  '#f0fdf4', // Green 50
];

export function ThemeEditor({ course, onUpdate }: ThemeEditorProps) {
  const [theme, setTheme] = useState<CourseTheme>(course.theme || DEFAULT_THEME);

  const handleUpdate = (updates: Partial<CourseTheme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    onUpdate(newTheme);
  };

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layout className="w-5 h-5 mr-2 text-slate-500" />
            Расположение элементов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'default', name: 'Стандартный', desc: 'Плеер слева, список справа' },
              { id: 'sidebar-left', name: 'Меню слева', desc: 'Список уроков слева' },
              { id: 'centered', name: 'По центру', desc: 'Фокус на контенте' },
              { id: 'immersive', name: 'Кинотеатр', desc: 'Темный фон, широкий плеер' },
            ].map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleUpdate({ layout: layout.id as any })}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  theme.layout === layout.id
                    ? "border-primary-600 bg-primary-50 ring-2 ring-primary-100"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="font-semibold text-slate-900">{layout.name}</div>
                <div className="text-xs text-slate-500 mt-1">{layout.desc}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Palette className="w-5 h-5 mr-2 text-slate-500" />
            Цветовая схема
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Основной цвет</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleUpdate({ primaryColor: color })}
                  className={cn(
                    "w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
                    theme.primaryColor === color && "ring-2 ring-offset-2 ring-slate-900 scale-110"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input 
                type="color" 
                value={theme.primaryColor}
                onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Цвет фона</label>
            <div className="flex flex-wrap gap-3">
              {BACKGROUNDS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleUpdate({ backgroundColor: color })}
                  className={cn(
                    "w-8 h-8 rounded-full border border-slate-200 transition-transform hover:scale-110 focus:outline-none",
                    theme.backgroundColor === color && "ring-2 ring-offset-2 ring-slate-900 scale-110"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography & Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Type className="w-5 h-5 mr-2 text-slate-500" />
            Стиль интерфейса
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Шрифт</label>
            <div className="space-y-2">
              {[
                { id: 'sans', name: 'Sans Serif', font: 'font-sans' },
                { id: 'serif', name: 'Serif', font: 'font-serif' },
                { id: 'mono', name: 'Monospace', font: 'font-mono' },
              ].map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleUpdate({ fontFamily: font.id as any })}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border text-left text-sm transition-colors flex items-center justify-between",
                    theme.fontFamily === font.id
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <span className={font.font}>{font.name}</span>
                  {theme.fontFamily === font.id && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Стиль кнопок</label>
            <div className="space-y-3">
              <button
                onClick={() => handleUpdate({ buttonStyle: 'rounded' })}
                className="w-full py-2 px-4 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                style={theme.buttonStyle === 'rounded' ? { backgroundColor: theme.primaryColor, color: '#fff' } : {}}
              >
                Скругленные (Rounded)
              </button>
              <button
                onClick={() => handleUpdate({ buttonStyle: 'pill' })}
                className="w-full py-2 px-4 bg-slate-100 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                style={theme.buttonStyle === 'pill' ? { backgroundColor: theme.primaryColor, color: '#fff' } : {}}
              >
                Овальные (Pill)
              </button>
              <button
                onClick={() => handleUpdate({ buttonStyle: 'sharp' })}
                className="w-full py-2 px-4 bg-slate-100 rounded-none text-sm font-medium hover:bg-slate-200 transition-colors"
                style={theme.buttonStyle === 'sharp' ? { backgroundColor: theme.primaryColor, color: '#fff' } : {}}
              >
                Прямоугольные (Sharp)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cover Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-slate-500" />
            Обложка курса
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'banner', name: 'Баннер' },
              { id: 'overlay', name: 'Затемнение' },
              { id: 'minimal', name: 'Минимализм' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => handleUpdate({ coverStyle: style.id as any })}
                className={cn(
                  "p-3 rounded-xl border text-center text-sm transition-all",
                  theme.coverStyle === style.id
                    ? "border-primary-600 bg-primary-50 font-medium text-primary-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                )}
              >
                {style.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
