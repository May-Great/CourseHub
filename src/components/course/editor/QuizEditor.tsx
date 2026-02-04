import { useState } from 'react';
import { Quiz, QuizQuestion, QuizOption } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { aiService } from '@/lib/aiService';
import { 
  Plus, 
  Trash, 
  X,
  HelpCircle,
  CheckCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizEditorProps {
  quiz: Quiz;
  onChange: (quiz: Quiz) => void;
}

export function QuizEditor({ quiz, onChange }: QuizEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [sourceText, setSourceText] = useState('');

  // --- AI Handlers ---
  const handleAiGenerate = async () => {
    if (!sourceText.trim()) return;
    
    setIsGenerating(true);
    try {
      const questions = await aiService.generateQuizFromText(sourceText);
      
      const updatedQuiz = {
        ...quiz,
        questions: [...quiz.questions, ...questions]
      };
      
      onChange(updatedQuiz);
      setShowAiInput(false);
      setSourceText('');
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
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
    const updatedQuiz = { ...quiz };
    updatedQuiz.questions = [...updatedQuiz.questions, newQuestion];
    onChange(updatedQuiz);
  };

  const updateQuestion = (qIndex: number, field: keyof QuizQuestion, value: string) => {
    const questions = [...quiz.questions];
    questions[qIndex] = { ...questions[qIndex], [field]: value };
    onChange({ ...quiz, questions });
  };

  const removeQuestion = (qIndex: number) => {
    const questions = [...quiz.questions];
    questions.splice(qIndex, 1);
    onChange({ ...quiz, questions });
  };

  const addOption = (qIndex: number) => {
    const questions = [...quiz.questions];
    const newOption: QuizOption = {
      id: `opt-${Date.now()}`,
      text: 'Новый вариант',
      isCorrect: false
    };
    questions[qIndex] = { 
      ...questions[qIndex], 
      options: [...questions[qIndex].options, newOption] 
    };
    onChange({ ...quiz, questions });
  };

  const updateOption = (qIndex: number, oIndex: number, field: keyof QuizOption, value: string | boolean) => {
    const questions = [...quiz.questions];
    const options = [...questions[qIndex].options];
    
    // Logic for single choice: if marking as correct, unmark others
    if (field === 'isCorrect' && value === true && questions[qIndex].type === 'single_choice') {
      options.forEach(opt => opt.isCorrect = false);
    }
    
    // @ts-ignore - dynamic key assignment
    options[oIndex] = { ...options[oIndex], [field]: value };
    questions[qIndex] = { ...questions[qIndex], options };
    onChange({ ...quiz, questions });
  };
  
  const removeOption = (qIndex: number, oIndex: number) => {
     const questions = [...quiz.questions];
     const options = [...questions[qIndex].options];
     options.splice(oIndex, 1);
     questions[qIndex] = { ...questions[qIndex], options };
     onChange({ ...quiz, questions });
  };

  return (
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
              value={quiz.passingScore}
              onChange={(e) => onChange({ ...quiz, passingScore: Number(e.target.value) })}
              className="w-16 px-2 py-1 border border-slate-200 rounded-md text-sm"
            />
            <span className="text-sm text-slate-600">%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Generator Button */}
          {!showAiInput ? (
            <Button 
              onClick={() => setShowAiInput(true)}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Сгенерировать вопросы с AI
            </Button>
          ) : (
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-violet-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" /> AI Генератор
                </h4>
                <button onClick={() => setShowAiInput(false)} className="text-violet-400 hover:text-violet-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-violet-600 mb-3">
                Вставьте текст урока, и AI автоматически создаст проверочные вопросы.
              </p>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Вставьте текст урока здесь..."
                rows={4}
                className="w-full p-3 text-sm border-violet-200 rounded-lg focus:ring-violet-500 mb-3"
              />
              <Button 
                onClick={handleAiGenerate} 
                disabled={isGenerating || !sourceText.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Генерирую...
                  </>
                ) : (
                  'Создать вопросы'
                )}
              </Button>
            </div>
          )}

          {quiz.questions.map((question, qIndex) => (
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
  );
}
