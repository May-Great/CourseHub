'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 cursor-pointer">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-3 py-2 border border-neutral-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
            disabled:bg-neutral-50 disabled:text-neutral-500
            placeholder:text-neutral-400
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
