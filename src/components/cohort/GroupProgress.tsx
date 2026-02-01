import { Card } from '../ui/Card';
import { User } from '@/lib/types';

interface GroupProgressProps {
  participants: User[];
  courseModules: { id: string; title: string; lessonsCount: number }[];
  progressData: Record<string, { completedLessons: number }>; // userId -> progress
}

export function GroupProgress({ participants, courseModules, progressData }: GroupProgressProps) {
  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessonsCount, 0);

  if (participants.length === 0) {
    return <div className="text-center text-gray-500 py-4">Нет данных о прогрессе</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 font-medium text-gray-500 w-64">Студент</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Общий прогресс</th>
            {courseModules.map(module => (
              <th key={module.id} className="text-left py-3 px-4 font-medium text-gray-500 whitespace-nowrap">
                {module.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map(participant => {
            const userProgress = progressData[participant.id] || { completedLessons: 0 };
            const percent = totalLessons > 0 
              ? Math.round((userProgress.completedLessons / totalLessons) * 100) 
              : 0;

            return (
              <tr key={participant.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {participant.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{participant.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 w-24 bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${percent < 30 ? 'bg-red-500' : percent < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{percent}%</span>
                  </div>
                </td>
                {/* Mock module progress columns - in real app would calculate per module */}
                {courseModules.map(module => (
                   <td key={module.id} className="py-3 px-4">
                     <div className="w-2 h-2 rounded-full bg-gray-200 mx-auto" />
                   </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
