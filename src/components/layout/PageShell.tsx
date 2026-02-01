import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageShell({ children, className, fullWidth = false }: PageShellProps) {
  return (
    <div className={cn(
      "min-h-screen bg-slate-50 pt-8 pb-12", // Top padding assumes under topbar
      className
    )}>
      <div className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        fullWidth ? "max-w-[1600px]" : "max-w-[1320px]"
      )}>
        {children}
      </div>
    </div>
  );
}
