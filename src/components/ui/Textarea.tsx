'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 border border-neutral-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-neutral-50 disabled:text-neutral-500
            placeholder:text-neutral-400
            transition-colors resize-vertical
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';