import { forwardRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Cohort } from '@/lib/types';
import { strings } from '@/lib/strings.ru';

interface CohortCardProps {
  cohort: Cohort;
  courseTitle: string;
  onClick?: () => void;
}

export const CohortCard = forwardRef<HTMLDivElement, CohortCardProps>(
  ({ cohort, courseTitle, onClick }, ref) => {
    const isActive = cohort.status === 'active';
    const isUpcoming = cohort.status === 'upcoming';
    
    // Calculate progress (mock logic for now)
    const progress = 45; // This would come from real data aggregation

    return (
      <Card 
        ref={ref}
        className="p-5 hover:shadow-md transition-shadow cursor-pointer border-gray-100"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2
              ${isActive ? 'bg-green-100 text-green-800' : 
                isUpcoming ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {isActive ? 'Активен' : isUpcoming ? 'Скоро старт' : 'Завершен'}
            </span>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{cohort.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{courseTitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{cohort.participants.length}</div>
            <div className="text-xs text-gray-500">студентов</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>📅 {new Date(cohort.startDate).toLocaleDateString('ru-RU')} — {new Date(cohort.endDate).toLocaleDateString('ru-RU')}</span>
          </div>

          {isActive && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Прогресс группы</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

CohortCard.displayName = 'CohortCard';
