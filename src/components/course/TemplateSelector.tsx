'use client';

import { useState } from 'react';
import { CourseTemplate } from '@/lib/types';
import { courseTemplates } from '@/lib/courseTemplates';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  onSelect: (template: CourseTemplate) => void;
  selectedTemplateId?: string;
}

export function TemplateSelector({ onSelect, selectedTemplateId }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CourseTemplate | null>(
    selectedTemplateId ? courseTemplates.find(t => t.id === selectedTemplateId) || null : null
  );

  const handleSelect = (template: CourseTemplate) => {
    setSelectedTemplate(template);
    onSelect(template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Выберите шаблон курса
        </h3>
        <p className="text-gray-600">
          Шаблон поможет быстро создать структуру курса и настроить поток студентов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courseTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => handleSelect(template)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{template.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {template.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {template.description}
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Длительность:</span>
                  <span className="font-medium">{template.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Модулей:</span>
                  <span className="font-medium">{template.structure.modulesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Уроков:</span>
                  <span className="font-medium">
                    {template.structure.modulesCount * template.structure.lessonsPerModule}
                  </span>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {template.structure.suggestedSchedule}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Выбран шаблон: {selectedTemplate.name}
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• {selectedTemplate.structure.modulesCount} модулей по {selectedTemplate.structure.lessonsPerModule} уроков</p>
            <p>• Рекомендуемый график: {selectedTemplate.structure.suggestedSchedule}</p>
            <p>• Длительность потока: {selectedTemplate.duration}</p>
            {selectedTemplate.cohortSettings.hasDeadlines && (
              <p>• Включены дедлайны и чекпоинты</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}