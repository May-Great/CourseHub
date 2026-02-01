import { useMemo } from 'react';
import { Lesson } from '@/lib/types';
import { strings } from '@/lib/strings.ru';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface DeadlineCalendarProps {
  lessons: Lesson[];
  completedLessonIds?: string[];
  className?: string;
}

interface DeadlineItem {
  id: string;
  title: string;
  date: Date;
  type: 'lesson' | 'assignment';
  isCompleted: boolean;
  isOverdue: boolean;
}

export function DeadlineCalendar({ 
  lessons, 
  completedLessonIds = [], 
  className 
}: DeadlineCalendarProps) {
  const deadlines = useMemo(() => {
    const items: DeadlineItem[] = [];
    const now = new Date();

    lessons.forEach(lesson => {
      // Check lesson deadline
      if (lesson.deadline) {
        const date = new Date(lesson.deadline);
        items.push({
          id: lesson.id,
          title: lesson.title,
          date,
          type: 'lesson',
          isCompleted: completedLessonIds.includes(lesson.id),
          isOverdue: date < now && !completedLessonIds.includes(lesson.id)
        });
      }

      // Check assignment deadline
      if (lesson.assignment?.dueDate) {
        // We consider assignment completed if the lesson is completed for now
        // In a real app, we would check assignment status specifically
        const date = new Date(lesson.assignment.dueDate);
        items.push({
          id: `${lesson.id}-assignment`,
          title: `${strings.assignment}: ${lesson.assignment.title}`,
          date,
          type: 'assignment',
          isCompleted: completedLessonIds.includes(lesson.id), // Simplified
          isOverdue: date < now && !completedLessonIds.includes(lesson.id)
        });
      }
    });

    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [lessons, completedLessonIds]);

  if (deadlines.length === 0) {
    return (
      <Card className={clsx("p-4", className)}>
        <h3 className="text-lg font-semibold mb-2">{strings.deadlines}</h3>
        <p className="text-gray-500 text-sm">{strings.noDeadlines}</p>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return strings.today;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return strings.tomorrow;
    } else {
      return new Intl.DateTimeFormat('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      }).format(date);
    }
  };

  return (
    <Card className={clsx("p-4", className)}>
      <h3 className="text-lg font-semibold mb-4">{strings.upcomingDeadlines}</h3>
      <div className="space-y-3">
        {deadlines.map((item) => (
          <div 
            key={item.id} 
            className={clsx(
              "flex items-center justify-between p-2 rounded-lg border",
              item.isOverdue ? "border-red-200 bg-red-50" : 
              item.isCompleted ? "border-green-200 bg-green-50" : "border-gray-100"
            )}
          >
            <div className="flex-1 min-w-0 mr-3">
              <p className={clsx(
                "text-sm font-medium truncate",
                item.isCompleted && "text-gray-500 line-through"
              )}>
                {item.title}
              </p>
              <p className={clsx(
                "text-xs",
                item.isOverdue ? "text-red-600 font-medium" : "text-gray-500"
              )}>
                {item.isOverdue ? strings.overdue : strings.dueBy} {formatDate(item.date)}
              </p>
            </div>
            <div className="flex-shrink-0">
              {item.isCompleted ? (
                <span className="text-green-600">✓</span>
              ) : item.type === 'assignment' ? (
                <span className="text-xl">📝</span>
              ) : (
                <span className="text-xl">⏰</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
