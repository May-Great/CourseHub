import { ReactNode } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  children?: ReactNode;
}

export function StatCard({ icon, label, value, change, children }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <span
                className={`text-sm font-medium ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.type === 'increase' ? '↗' : '↘'} {Math.abs(change.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}