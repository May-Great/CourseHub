'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-semibold rounded-full transition-colors",
          // Size variations
          size === 'sm' && "px-2 py-0.5 text-xs",
          size === 'md' && "px-2.5 py-0.5 text-sm", // Adjusted vertical padding for pill look
          size === 'lg' && "px-3 py-1 text-sm",
          
          // Variant styling (softer, pastel backgrounds)
          variant === 'primary' && "bg-primary-50 text-primary-700 border border-primary-100",
          variant === 'secondary' && "bg-slate-100 text-slate-700 border border-slate-200",
          variant === 'success' && "bg-emerald-50 text-emerald-700 border border-emerald-100",
          variant === 'warning' && "bg-amber-50 text-amber-700 border border-amber-100",
          variant === 'danger' && "bg-rose-50 text-rose-700 border border-rose-100",
          variant === 'outline' && "bg-transparent text-slate-600 border border-slate-200",
          variant === 'ghost' && "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
