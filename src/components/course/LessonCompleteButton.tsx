'use client';

import { useStudentStore } from '@/lib/stores/studentStore';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonCompleteButtonProps {
  lessonId: string;
  className?: string;
}

export function LessonCompleteButton({ lessonId, className }: LessonCompleteButtonProps) {
  const { isLessonCompleted, markLessonCompleted } = useStudentStore();
  const isCompleted = isLessonCompleted(lessonId);

  const toggle = () => {
    markLessonCompleted(lessonId, !isCompleted);
  };

  return (
    <Button
      variant={isCompleted ? 'success' : 'outline'}
      onClick={toggle}
      className={cn("flex items-center transition-all", className)}
    >
      {isCompleted ? (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Урок пройден
        </>
      ) : (
        <>
          <Circle className="w-5 h-5 mr-2 text-slate-400" />
          Отметить как пройденный
        </>
      )}
    </Button>
  );
}
