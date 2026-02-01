'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Assignment, AssignmentRubric } from '@/lib/types';
import { useAssignmentStore } from '@/lib/stores/assignmentStore';

interface AssignmentCreatorProps {
  lessonId?: string;
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
}

export function AssignmentCreator({ lessonId, onAssignmentCreated, onCancel }: AssignmentCreatorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    submissionType: 'text' as Assignment['submissionType'],
    maxScore: 100,
    dueDate: '',
  });
  
  const [rubric, setRubric] = useState<Omit<AssignmentRubric, 'id'>[]>([
    { criteria: 'Качество выполнения', maxPoints: 50, description: 'Насколько хорошо выполнено задание' },
    { criteria: 'Соблюдение требований', maxPoints: 30, description: 'Соответствие всем указанным требованиям' },
    { criteria: 'Креативность', maxPoints: 20, description: 'Оригинальность и творческий подход' }
  ]);
  
  const { createAssignment } = useAssignmentStore();
  
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRubricChange = (index: number, field: keyof AssignmentRubric, value: string | number) => {
    setRubric(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };
  
  const addRubricItem = () => {
    setRubric(prev => [...prev, { criteria: '', maxPoints: 10, description: '' }]);
  };
  
  const removeRubricItem = (index: number) => {
    setRubric(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    const assignmentData: Omit<Assignment, 'id'> = {
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions,
      submissionType: formData.submissionType,
      maxScore: formData.maxScore,
      dueDate: formData.dueDate || undefined,
      status: 'not_started',
      rubric: rubric.map((item, index) => ({
        ...item,
        id: `rubric_${index}`
      }))
    };
    
    const assignmentId = createAssignment(assignmentData);
    onAssignmentCreated?.(assignmentId);
  };
  
  const isValid = formData.title && formData.description && formData.submissionType;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Создание задания</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Название задания *"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
              placeholder="Например: Создать презентацию"
            />
            
            <Select
              label="Тип сдачи *"
              value={formData.submissionType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('submissionType', e.target.value)}
              options={[
                { value: 'text', label: 'Текстовый ответ' },
                { value: 'file', label: 'Загрузка файла' },
                { value: 'link', label: 'Ссылка на работу' },
                { value: 'quiz', label: 'Тест/Опрос' }
              ]}
            />
          </div>
          
          <Textarea
            label="Описание задания *"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
            placeholder="Опишите, что должен сделать студент"
            rows={3}
          />
          
          <Textarea
            label="Подробные инструкции"
            value={formData.instructions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('instructions', e.target.value)}
            placeholder="Детальные инструкции по выполнению задания"
            rows={4}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Максимальный балл"
              type="number"
              value={formData.maxScore}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('maxScore', parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
            />
            
            <Input
              label="Срок сдачи"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('dueDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Критерии оценивания */}
      <Card>
        <CardHeader>
          <CardTitle>Критерии оценивания</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rubric.map((item, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Критерий {index + 1}</h4>
                {rubric.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRubricItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Название критерия"
                  value={item.criteria}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRubricChange(index, 'criteria', e.target.value)}
                />
                
                <Input
                  type="number"
                  placeholder="Макс. баллов"
                  value={item.maxPoints}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRubricChange(index, 'maxPoints', parseInt(e.target.value) || 0)}
                  min="1"
                />
                
                <Input
                  placeholder="Описание"
                  value={item.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRubricChange(index, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addRubricItem}
            leftIcon={<span>➕</span>}
          >
            Добавить критерий
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Общий максимальный балл:</span>
              <span className="font-semibold text-blue-700">
                {rubric.reduce((sum, item) => sum + item.maxPoints, 0)} баллов
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Действия */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          leftIcon={<span>💾</span>}
        >
          Создать задание
        </Button>
      </div>
    </div>
  );
}