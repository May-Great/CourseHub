'use client';

import { useState } from 'react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { VideoBookmark } from '@/lib/types';
import { useProgressStore } from '@/lib/stores/progressStore';

interface VideoBookmarksProps {
  lessonId: string;
  currentTime: number;
  duration: number;
  onSeekTo: (time: number) => void;
}

export function VideoBookmarks({ lessonId, currentTime, duration, onSeekTo }: VideoBookmarksProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const { getUserProgress, addVideoBookmark, deleteVideoBookmark } = useProgressStore();
  
  const userProgress = getUserProgress('current-user', 'current-course');
  const bookmarks = userProgress?.bookmarks.filter(bookmark => bookmark.lessonId === lessonId) || [];
  
  const handleCreateBookmark = () => {
    if (!bookmarkTitle.trim()) return;
    
    const newBookmark: Omit<VideoBookmark, 'id'> = {
      lessonId,
      timestamp: Math.floor(currentTime),
      title: bookmarkTitle.trim(),
      createdAt: new Date().toISOString(),
    };
    
    addVideoBookmark('current-user', 'current-course', newBookmark);
    setBookmarkTitle('');
    setIsCreating(false);
  };
  
  const handleDeleteBookmark = (bookmarkId: string) => {
    deleteVideoBookmark('current-user', 'current-course', bookmarkId);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getProgressPercentage = (timestamp: number) => {
    return duration > 0 ? (timestamp / duration) * 100 : 0;
  };
  
  const sortedBookmarks = [...bookmarks].sort((a, b) => a.timestamp - b.timestamp);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Закладки ({bookmarks.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          🔖 Добавить закладку
        </Button>
      </div>
      
      {isCreating && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Время:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {formatTime(Math.floor(currentTime))}
              </span>
            </div>
            
            <Input
              value={bookmarkTitle}
              onChange={(e) => setBookmarkTitle(e.target.value)}
              placeholder="Название закладки..."
              className="w-full"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateBookmark}
                disabled={!bookmarkTitle.trim()}
              >
                Сохранить
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setBookmarkTitle('');
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Timeline with bookmarks */}
      {duration > 0 && bookmarks.length > 0 && (
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
            {sortedBookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onSeekTo(bookmark.timestamp)}
                className="absolute top-0 w-1 h-full bg-purple-500 hover:bg-purple-600 transition-colors"
                style={{ left: `${getProgressPercentage(bookmark.timestamp)}%` }}
                title={`${bookmark.title} - ${formatTime(bookmark.timestamp)}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Кликните на закладку для перехода
          </p>
        </div>
      )}
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedBookmarks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <div className="text-4xl mb-2">🔖</div>
            <p>Закладок пока нет</p>
            <p className="text-sm">Отмечайте важные моменты в видео</p>
          </div>
        ) : (
          sortedBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onSeekTo(bookmark.timestamp)}
                        className="text-purple-600 hover:text-purple-800 font-mono text-sm font-medium"
                      >
                        {formatTime(bookmark.timestamp)}
                      </button>
                      <span className="text-gray-700 font-medium">
                        {bookmark.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(bookmark.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500 ml-2 p-1"
                    title="Удалить закладку"
                  >
                    ✕
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}