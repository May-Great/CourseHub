import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  size = 'md', 
  showLabel = false, 
  className 
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Прогресс</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          {
            'h-1': size === 'sm',
            'h-2': size === 'md',
            'h-3': size === 'lg',
          }
        )}
      >
        <div
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}