import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f5f5] placeholder:text-[#525252] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
