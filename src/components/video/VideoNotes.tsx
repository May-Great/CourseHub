'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui';
import { VideoNote } from '@/lib/types';
import { useProgressStore } from '@/lib/stores/progressStore';

interface VideoNotesProps {
  lessonId: string;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

export function VideoNotes({ lessonId, currentTime, onSeekTo }: VideoNotesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const { getUserProgress, addVideoNote, updateVideoNote, deleteVideoNote } = useProgressStore();
  
  const userProgress = getUserProgress('current-user', 'current-course');
  const notes = userProgress?.notes.filter(note => note.lessonId === lessonId) || [];
  
  const handleCreateNote = () => {
    if (!noteContent.trim()) return;
    
    const newNote: Omit<VideoNote, 'id'> = {
      lessonId,
      timestamp: Math.floor(currentTime),
      content: noteContent.trim(),
      createdAt: new Date().toISOString(),
      isPrivate: true,
    };
    
    addVideoNote('current-user', 'current-course', newNote);
    setNoteContent('');
    setIsCreating(false);
  };
  
  const handleDeleteNote = (noteId: string) => {
    deleteVideoNote('current-user', 'current-course', noteId);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  const sortedNotes = [...notes].sort((a, b) => a.timestamp - b.timestamp);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Заметки ({notes.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          + Добавить заметку
        </Button>
      </div>
      
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Время:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {formatTime(Math.floor(currentTime))}
              </span>
            </div>
            
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Введите текст заметки..."
              rows={3}
              className="resize-none"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateNote}
                disabled={!noteContent.trim()}
              >
                Сохранить
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNoteContent('');
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>Заметок пока нет</p>
            <p className="text-sm">Создайте первую заметку во время просмотра</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <button
                      onClick={() => onSeekTo(note.timestamp)}
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm font-medium mb-1 block"
                    >
                      {formatTime(note.timestamp)}
                    </button>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 ml-2 p-1"
                    title="Удалить заметку"
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