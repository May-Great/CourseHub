'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { QuickCreateFile } from '@/lib/types';
import { useCourseStore } from '@/lib/stores';

interface QuickCreateProps {
  onFilesAdded: (files: QuickCreateFile[]) => void;
}

export function QuickCreate({ onFilesAdded }: QuickCreateProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<QuickCreateFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addQuickCreateFiles, initialize } = useCourseStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: QuickCreateFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      const fileType = getFileType(file.type, file.name);
      if (fileType) {
        const quickCreateFile: QuickCreateFile = {
          name: file.name,
          type: fileType,
          url: URL.createObjectURL(file), // В реальном приложении здесь будет загрузка на сервер
          size: file.size,
        };
        
        // Для видео файлов можно получить длительность
        if (fileType === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            quickCreateFile.duration = Math.round(video.duration);
            URL.revokeObjectURL(video.src);
          };
          video.src = quickCreateFile.url;
        }
        
        newFiles.push(quickCreateFile);
      }
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    addQuickCreateFiles(newFiles);
    onFilesAdded(updatedFiles);
  };

  const getFileType = (mimeType: string, fileName: string): QuickCreateFile['type'] | null => {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    
    // Fallback to extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'webm':
        return 'video';
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'm4a':
        return 'audio';
      case 'pdf':
        return 'pdf';
      case 'txt':
      case 'md':
        return 'text';
      default:
        return null;
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesAdded(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: QuickCreateFile['type']) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'pdf': return '📄';
      case 'text': return '📝';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Быстрое создание курса
        </h3>
        <p className="text-gray-600">
          Загрузите файлы курса, и мы автоматически создадим структуру уроков
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept="video/*,audio/*,.pdf,.txt,.md"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Поддерживаются: видео, аудио, PDF, текстовые файлы
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Выбрать файлы
          </Button>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Загруженные файлы ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="capitalize">{file.type}</span>
                      {file.size && <span>• {formatFileSize(file.size)}</span>}
                      {file.duration && <span>• {Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}</span>}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          {/* Auto-generation options */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">
              Автоматическая генерация
            </h5>
            <div className="space-y-2 text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Создать названия уроков из имен файлов</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Сгенерировать описания уроков</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Организовать в модули автоматически</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}