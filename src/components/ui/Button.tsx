import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[#10b981] text-[#022c22] hover:bg-[#059669]': variant === 'primary',
            'bg-[#171717] text-[#f5f5f5] hover:bg-[#262626]': variant === 'secondary',
            'border border-[#262626] bg-transparent hover:bg-[#171717] text-[#a3a3a3]': variant === 'outline',
            'hover:bg-[#171717] text-[#a3a3a3]': variant === 'ghost',
            'bg-[#991b1b] text-[#fef2f2] hover:bg-[#7f1d1d]': variant === 'danger',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
