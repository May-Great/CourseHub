import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white'; // white variant for dark backgrounds if needed later
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-slate-900';
  
  return (
    <div className={cn("flex items-center gap-1 font-bold tracking-tight select-none", className)}>
      <span className={cn("text-2xl", textColor)}>Course</span>
      <span className="bg-primary-600 text-white text-2xl px-2 py-0.5 rounded-md flex items-center justify-center">
        Hub
      </span>
    </div>
  );
}
