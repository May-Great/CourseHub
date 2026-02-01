'use client';

import { useState } from 'react';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { Material } from '@/lib/types';

interface LessonMaterialsProps {
  materials: Material[];
  onDownload?: (material: Material) => void;
}

export function LessonMaterials({ materials, onDownload }: LessonMaterialsProps) {
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  
  const getTypeIcon = (type: Material['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'link': return '🔗';
      case 'text': return '📝';
      case 'video': return '🎥';
      default: return '📎';
    }
  };
  
  const getTypeLabel = (type: Material['type']) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'link': return 'Ссылка';
      case 'text': return 'Текст';
      case 'video': return 'Видео';
      default: return 'Файл';
    }
  };
  
  const handleMaterialClick = (material: Material) => {
    if (material.type === 'link' && material.url) {
      window.open(material.url, '_blank');
    } else if (material.type === 'text') {
      setExpandedMaterial(
        expandedMaterial === material.title ? null : material.title
      );
    } else if (onDownload) {
      onDownload(material);
    }
  };
  
  if (materials.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="text-4xl mb-2">📎</div>
        <p>Материалов к уроку нет</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Материалы урока ({materials.length})
      </h3>
      
      <div className="space-y-3">
        {materials.map((material, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(material.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{material.title}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {getTypeLabel(material.type)}
                      </Badge>
                    </div>
                  </div>
                  
                  {expandedMaterial === material.title && material.content && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {material.content}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMaterialClick(material)}
                  >
                    {material.type === 'link' ? 'Открыть' : 
                     material.type === 'text' ? 
                       (expandedMaterial === material.title ? 'Свернуть' : 'Читать') : 
                     'Скачать'}
                  </Button>
                  
                  {material.type === 'link' && material.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(material.url!)}
                      className="text-xs"
                    >
                      Копировать
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        💡 Совет: Скачайте материалы для изучения офлайн
      </div>
    </div>
  );
}