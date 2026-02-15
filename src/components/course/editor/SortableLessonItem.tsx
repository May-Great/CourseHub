'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lesson } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { GripVertical, Video, FileText, Edit, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableLessonItemProps {
  lesson: Lesson;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableLessonItem({ lesson, isEditing, onEdit, onDelete }: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center py-1.5 px-2 rounded-md group/lesson transition-colors cursor-pointer bg-white border border-transparent mb-1",
        isEditing ? "bg-primary-50 ring-1 ring-primary-100 border-primary-100" : "hover:bg-slate-50 hover:border-slate-100",
        isDragging && "shadow-lg border-primary-200"
      )}
      onClick={onEdit}
    >
      {/* Drag Handle */}
      <div 
        className="mr-2 cursor-grab text-slate-300 hover:text-slate-500 opacity-0 group-hover/lesson:opacity-100 touch-none"
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Icon */}
      <div className="mr-3 text-slate-400">
        {lesson.type === 'video' || lesson.videoUrl ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
      </div>

      {/* Title */}
      <div className="flex-1 text-sm text-slate-700 font-medium truncate select-none">
        {lesson.title}
      </div>

      {/* Actions */}
      <div className="flex items-center opacity-0 group-hover/lesson:opacity-100">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0 mr-1 text-slate-400 hover:text-primary-600"
          title="Редактировать"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-6 w-6 p-0 text-slate-400 hover:text-rose-500"
          title="Удалить"
        >
          <Trash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
